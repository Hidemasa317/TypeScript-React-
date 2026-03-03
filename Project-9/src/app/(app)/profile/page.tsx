import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import ProfileForm from './profile-form';

export default async function ProfilePage() {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <div className="p-6">ログインしてください。</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(uid) },
    select: { name: true, email: true, role: true },
  });

  if (!user) {
    return <div className="p-6">ユーザーが見つかりません。</div>;
  }

  return <ProfileForm user={user} />;
}
