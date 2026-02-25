import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getUserId(): Promise<bigint | null> {
  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) return null;
  return BigInt(uid);
}

// PUT（編集）

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = BigInt(idParam);

  const existing = await prisma.company.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  }

  const body = await req.json();

  const updated = await prisma.company.update({
    where: { id },
    data: {
      name: body.name,
      industry: body.industry,
      phone: body.phone,
      address: body.address,
      website: body.website,
      note: body.note,
    },
  });

  return NextResponse.json(updated);
}

// DELETE（削除）
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = BigInt(idParam);

  const existing = await prisma.company.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  }

  await prisma.company.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
