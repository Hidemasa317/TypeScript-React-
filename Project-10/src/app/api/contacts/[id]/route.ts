import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/contacts/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;
  const contact = await prisma.contact.findUnique({
    where: { id: BigInt(id) },
    include: {
      memberships: { include: { contactList: { select: { id: true, name: true } } } },
    },
  });

  if (!contact) return NextResponse.json({ error: '見つかりません' }, { status: 404 });

  return NextResponse.json({
    ...contact,
    id: contact.id.toString(),
    lists: contact.memberships.map((m) => ({
      id: m.contactList.id.toString(),
      name: m.contactList.name,
    })),
  });
}

// PUT /api/contacts/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;
  const { firstName, lastName, company, status } = await req.json();

  const contact = await prisma.contact.update({
    where: { id: BigInt(id) },
    data: { firstName, lastName, company, ...(status ? { status } : {}) },
  });

  return NextResponse.json({ ...contact, id: contact.id.toString() });
}

// DELETE /api/contacts/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;
  await prisma.contact.delete({ where: { id: BigInt(id) } });

  return NextResponse.json({ ok: true });
}
