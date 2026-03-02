import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import TopNavClient from './TopNavClient';

export default async function TopNav() {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <TopNavClient user={null} />;
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(uid) },
    select: { name: true, role: true },
  });

  return <TopNavClient user={user} />;
}
