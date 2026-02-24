import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { message: '入力が不足しています' },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: 'メールまたはパスワードが違います' },
      { status: 401 },
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { message: 'メールまたはパスワードが違います' },
      { status: 401 },
    );
  }

  const res = NextResponse.json(
    {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    { status: 200 },
  );

  // 学習用の最小：ログイン済みフラグcookie
  res.cookies.set('login', '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return res;
}
