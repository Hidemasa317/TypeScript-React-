import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// 🔵PUT📦
export async function PUT(req: Request) {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  // ✅📦　bodyから、name・email・currentPassword・newPassword・confirmPasswordを取得。
  const { name, email, currentPassword, newPassword, confirmPassword } = body;

  // const user = await prisma.user.findUnique({
  //   where: { id: BigInt(uid) },
  // }

  const user = await prisma.user.update({
    where: { id: BigInt(uid) },
    data: { name, email },
  });
  if (!user) {
    return NextResponse.json(
      { message: 'ユーザーが見つかりません' },
      { status: 404 },
    );
  }

  // 📦プロフィール更新部
  if (name || email) {
    await prisma.user.update({
      where: { id: BigInt(uid) },
      data: { name, email },
    });
  }
  // 📦パスワード更新部
  if (currentPassword && newPassword) {
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { message: '現在のパスワードが違います' },
        { status: 401 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: '新しいパスワードと確認用パスワードが一致しません' },
        { status: 400 },
      );
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: BigInt(uid) },
      data: { passwordHash: newHash },
    });
  }

  return NextResponse.json({ ok: true });
}

// 🔵DELETE📦
export async function DELETE(req: Request) {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json(
      { message: 'Password is required' },
      { status: 400 },
    );
  }

  // 📦ユーザ取得
  const user = await prisma.user.findUnique({
    where: { id: BigInt(uid) },
    select: { passwordHash: true },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // 📦入力PWと、DBのハッシュパスワードを比較。
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { message: 'Incorrect password' },
      { status: 401 },
    );
  }

  // 📦ユーザ削除
  await prisma.user.delete({
    where: { id: BigInt(uid) },
  });

  // 📦クッキー削除
  const res = NextResponse.json({ ok: true });
  res.cookies.set('uid', '', { maxAge: 0, path: '/' });
}
