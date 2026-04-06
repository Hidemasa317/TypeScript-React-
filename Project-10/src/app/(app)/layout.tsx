import Link from 'next/link';
import TopNav from '@/components/layout/TopNav/TopNav';

export const dynamic = 'force-dynamic';

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード' },
  { href: '/campaigns', label: 'キャンペーン' },
  { href: '/templates', label: 'テンプレート' },
  { href: '/lists', label: '配信リスト' },
  { href: '/contacts', label: '連絡先' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <div className="flex flex-1">
        {/* サイドバー */}
        <aside className="w-56 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        {/* メインコンテンツ */}
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
