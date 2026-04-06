'use client';

import { useRouter } from 'next/navigation';

type Props = {
  userName: string;
  userEmail: string;
};

export default function TopNavClient({ userName, userEmail }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-blue-600">✉ Email Delivery</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{userEmail}</span>
        <span className="text-sm font-medium">{userName}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
