import type { ReactNode } from 'react';
import TopNav from '@/components/layout/TopNav';

// ✅🤖最上位レイアウト部、描画を担う片割れ。ページの共通部分。

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-gray-50">
      <TopNav />

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
