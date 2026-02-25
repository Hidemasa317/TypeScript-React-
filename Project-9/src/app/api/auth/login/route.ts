import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// ✅export async function POST() {} で、POSTリクエストが来た時に実行される関数。
// ✅　req: Request は、ブラウザからのリクエスト情報。body・headers・method・url。
// fetch('/api/auth/register', {
//   method: 'POST',
//   body: JSON.stringify({ name, email, password }),
// });　　　を受け取るには、➡️ ✅　await req.json()

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as {
    // ✅ as で、型指定。
    email?: string;
    // ✅　?で、無い可能性もある。　という意味も持つ。jsonの中身には本当にnameなどが含まれているかわからないため。
    password?: string;
  };

  // ✅　OR条件
  if (!email || !password) {
    return NextResponse.json(
      { message: '入力が不足しています' },
      { status: 400 },
    );
  }

  // ✅　emailは、schema.prismaで『email     String   @unique』と指定しているので、
  // 　findUniqueが使える。　await(通信待つ)　prisma.user(Userテーブル操作).findUnique
  // ✅　where: {email}で、一致するレコードを探す。select: で、このカラムのみ取得と云う。
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
      // ✅　NextResponse.json(データ, オプション)
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

  // ログイン済みフラグcookie
  res.cookies.set('login', '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return res;
}
