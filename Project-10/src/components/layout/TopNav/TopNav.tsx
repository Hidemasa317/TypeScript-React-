import { getCurrentUser } from '@/lib/auth';
import TopNavClient from './TopNavClient';

export const dynamic = 'force-dynamic';

export default async function TopNav() {
  const user = await getCurrentUser();

  return (
    <TopNavClient
      userName={user?.name ?? ''}
      userEmail={user?.email ?? ''}
    />
  );
}
