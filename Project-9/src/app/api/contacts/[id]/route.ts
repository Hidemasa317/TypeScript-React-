import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

//----✅連絡先、保存、削除処理　api

function toContactJson(c: any) {
  return {
    ...c,
    id: c.id.toString(),
    userId: c.userId.toString(),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

async function getUserId(): Promise<bigint | null> {
  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) return null;
  return BigInt(uid);
}

// PUT /api/contacts/:id
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;

  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = BigInt(idParam);

  const body = (await req.json()) as {
    companyId?: string; //✅🚨追加忘れ。
    firstName?: string;
    lastName?: string;
    position?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    note?: string;
  };

  if (!body.companyId) {
    return NextResponse.json({ message: '会社は必須です' }, { status: 400 });
  }

  if (!body.firstName?.trim()) {
    return NextResponse.json({ message: '名は必須です' }, { status: 400 });
  }

  if (!body.lastName?.trim()) {
    return NextResponse.json({ message: '姓は必須です' }, { status: 400 });
  }

  const existing = await prisma.contact.findFirst({
    where: { id, userId },
  });
  if (!existing)
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });

  const contact = await prisma.contact.update({
    where: { id },
    data: {
      user: { connect: { id: userId } },
      company: { connect: { id: BigInt(body.companyId) } },
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      position: body.position?.trim() || null,
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      mobile: body.mobile?.trim() || null,
      note: body.note?.trim() || null,
    },
  });

  return NextResponse.json(
    { contact: toContactJson(contact) },
    { status: 200 },
  );
}

// DELETE /api/contacts/:id
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;

  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = BigInt(idParam);

  const existing = await prisma.contact.findFirst({
    where: { id, userId },
  });
  if (!existing)
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });

  await prisma.contact.delete({ where: { id } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
