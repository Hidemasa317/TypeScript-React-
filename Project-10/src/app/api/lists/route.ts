import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/lists
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const lists = await prisma.contactList.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { memberships: true } } },
  });

  return NextResponse.json(
    lists.map((l) => ({
      id: l.id.toString(),
      name: l.name,
      description: l.description,
      contactCount: l._count.memberships,
      createdAt: l.createdAt,
    }))
  );
}

// POST /api/lists
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { name, description } = await req.json();

  if (!name) return NextResponse.json({ error: 'name は必須です' }, { status: 400 });

  const list = await prisma.contactList.create({
    data: { userId, name, description },
  });

  return NextResponse.json({ ...list, id: list.id.toString(), userId: list.userId.toString() }, { status: 201 });
}
