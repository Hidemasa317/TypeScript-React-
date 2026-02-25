import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// ✅export async function POST() {} で、POSTリクエストが来た時に実行される関数。
// ✅　req: Request は、ブラウザからのリクエスト情報。body・headers・method・url。
// fetch('/api/auth/register', {
//   method: 'POST',
//   body: JSON.stringify({ name, email, password }),
// });　　　を受け取るには、➡️ ✅　await req.json()

// ✅const{} = は、右側がオブジェクトの際のみ使用可能。
export async function POST(req: Request) {
  const { name, email, password } = (await req.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  // TODO: バリデーション強化（文字数/メール形式/強度など）
  if (!name || !email || !password) {
    return NextResponse.json(
      { message: '入力が不足しています' },
      { status: 400 },
    );
  }

  // email重複チェック
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { message: 'このメールは既に登録済みです' },
      { status: 409 },
    );
  }

  // パスワードは必ずハッシュ化して保存
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash }, // role は default が入る
    select: { name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
