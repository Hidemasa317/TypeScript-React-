import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/campaigns/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;
  const campaign = await prisma.campaign.findFirst({
    where: { id: BigInt(id), userId },
    include: {
      template: true,
      contactList: { include: { _count: { select: { memberships: true } } } },
      sends: {
        select: { status: true },
      },
    },
  });

  if (!campaign) return NextResponse.json({ error: '見つかりません' }, { status: 404 });

  // 送信統計を集計
  const stats = campaign.sends.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return NextResponse.json({
    id: campaign.id.toString(),
    name: campaign.name,
    status: campaign.status,
    scheduledAt: campaign.scheduledAt,
    sentAt: campaign.sentAt,
    createdAt: campaign.createdAt,
    template: { ...campaign.template, id: campaign.template.id.toString(), userId: campaign.template.userId.toString() },
    contactList: {
      id: campaign.contactList.id.toString(),
      name: campaign.contactList.name,
      contactCount: campaign.contactList._count.memberships,
    },
    stats,
  });
}

// PUT /api/campaigns/[id] - ステータス変更など
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;
  const { name, status, scheduledAt } = await req.json();

  await prisma.campaign.updateMany({
    where: { id: BigInt(id), userId },
    data: { name, status, scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined },
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/campaigns/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;
  await prisma.campaign.deleteMany({ where: { id: BigInt(id), userId } });

  return NextResponse.json({ ok: true });
}
