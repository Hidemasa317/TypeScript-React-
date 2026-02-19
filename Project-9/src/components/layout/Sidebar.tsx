'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'ダッシュボード' },
  { href: '/companies', label: '会社' },
  { href: '/contacts', label: '連絡先' },
  { href: '/deals', label: '商談' },
  { href: '/activities', label: '活動' },
  { href: '/profile', label: 'プロフィール' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* モバイル：上部バー */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
        <div className="text-sm font-semibold">CRM</div>
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          ☰
        </button>
      </div>

      {/* モバイル：オーバーレイ */}
      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="close"
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={[
          'fixed left-0 top-0 z-40 h-dvh w-64 border-r bg-white',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
          'transition-transform lg:transition-none',
        ].join(' ')}
      >
        <div className="flex h-14 items-center border-b px-4">
          <div className="text-sm font-semibold">CRM</div>
        </div>

        <nav className="px-2 py-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                  'block rounded-md px-3 py-2 text-sm',
                  active ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}