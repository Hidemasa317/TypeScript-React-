import type { ReactNode } from 'react';
import TopNav from '@/components/layout/TopNav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-gray-50">
      <TopNav />

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
