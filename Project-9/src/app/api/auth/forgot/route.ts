import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

// 🔵POST

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = randomUUID();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExp: new Date(Date.now() + 1000 * 60 * 60), // 1時間有効
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset/${token}`;
  console.log(`パスワードリセットリンク: ${resetLink}`);

  return NextResponse.json({ ok: true });
}
