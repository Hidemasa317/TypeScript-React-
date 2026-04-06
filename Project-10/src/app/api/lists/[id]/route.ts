import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/lists/[id] - リスト詳細 + メンバー一覧
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;
  const list = await prisma.contactList.findFirst({
    where: { id: BigInt(id), userId },
    include: {
      memberships: {
        include: { contact: true },
        orderBy: { joinedAt: 'desc' },
      },
    },
  });

  if (!list) return NextResponse.json({ error: '見つかりません' }, { status: 404 });

  return NextResponse.json({
    id: list.id.toString(),
    name: list.name,
    description: list.description,
    createdAt: list.createdAt,
    contacts: list.memberships.map((m) => ({
      id: m.contact.id.toString(),
      email: m.contact.email,
      firstName: m.contact.firstName,
      lastName: m.contact.lastName,
      status: m.contact.status,
      joinedAt: m.joinedAt,
    })),
  });
}

// PUT /api/lists/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;
  const { name, description } = await req.json();

  await prisma.contactList.updateMany({
    where: { id: BigInt(id), userId },
    data: { name, description },
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/lists/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;

  await prisma.contactList.deleteMany({ where: { id: BigInt(id), userId } });

  return NextResponse.json({ ok: true });
}
