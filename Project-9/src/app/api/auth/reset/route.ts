// パスワード更新なのでPOST

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: '無効なトークンです' },
      { status: 400 },
    );
  }

  if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
    return NextResponse.json(
      { message: 'トークンの有効期限が切れています' },
      { status: 400 },
    );
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hash,
      resetToken: null,
      resetTokenExp: null,
    },
  });

  return NextResponse.json({ ok: true });
}
