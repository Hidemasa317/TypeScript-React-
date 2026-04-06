import { cookies } from 'next/headers';
import { prisma } from './prisma';

// ログイン中ユーザーのIDを取得（BigInt）
export async function getUserId(): Promise<bigint | null> {
  const cookieStore = await cookies();
  const uid = cookieStore.get('uid')?.value;
  if (!uid) return null;
  try {
    return BigInt(uid);
  } catch {
    return null;
  }
}

// ログイン中ユーザーの情報を取得
export async function getCurrentUser() {
  const userId = await getUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}
