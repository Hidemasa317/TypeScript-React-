import type { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-gray-50">
      <Sidebar />

      {/* メイン領域 */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </main>
    </div>
  );
}
