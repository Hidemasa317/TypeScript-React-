import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/campaigns
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      template: { select: { id: true, name: true } },
      contactList: { select: { id: true, name: true } },
      _count: { select: { sends: true } },
    },
  });

  return NextResponse.json(
    campaigns.map((c) => ({
      id: c.id.toString(),
      name: c.name,
      status: c.status,
      scheduledAt: c.scheduledAt,
      sentAt: c.sentAt,
      createdAt: c.createdAt,
      template: { id: c.template.id.toString(), name: c.template.name },
      contactList: { id: c.contactList.id.toString(), name: c.contactList.name },
      sendCount: c._count.sends,
    }))
  );
}

// POST /api/campaigns - キャンペーン作成
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { name, templateId, contactListId, scheduledAt } = await req.json();

  if (!name || !templateId || !contactListId) {
    return NextResponse.json({ error: 'name, templateId, contactListId は必須です' }, { status: 400 });
  }

  const campaign = await prisma.campaign.create({
    data: {
      userId,
      name,
      templateId: BigInt(templateId),
      contactListId: BigInt(contactListId),
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: scheduledAt ? 'scheduled' : 'draft',
    },
  });

  return NextResponse.json(
    { ...campaign, id: campaign.id.toString(), userId: campaign.userId.toString(), templateId: campaign.templateId.toString(), contactListId: campaign.contactListId.toString() },
    { status: 201 }
  );
}
