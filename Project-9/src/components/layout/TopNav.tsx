'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'ダッシュボード' },
  { href: '/companies', label: '会社' },
  { href: '/contacts', label: '連絡先' },
  { href: '/deals', label: '商談' },
  { href: '/activities', label: '活動' },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-gray-100 text-sm font-bold">
            CRM
          </div>

          <nav className="flex items-center gap-6 text-sm">
            {tabs.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={[
                    'relative py-4 text-gray-600 hover:text-gray-900',
                    active ? 'text-gray-900 font-semibold' : '',
                  ].join(' ')}
                >
                  {t.label}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-indigo-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 右上（ログイン未実装なので仮置き） */}
        <button
          type="button"
          className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Admin User ▾
        </button>
      </div>
    </header>
  );
}
