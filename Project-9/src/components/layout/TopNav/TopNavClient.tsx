'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// ✅配列の中にオブジェクトを入れている。[{}]
const tabs = [
  { href: '/dashboard', label: 'ダッシュボード' },
  { href: '/companies', label: '会社' },
  { href: '/contacts', label: '連絡先' },
  { href: '/deals', label: '商談' },
  { href: '/activities', label: '活動' },
];

type User = {
  name: string | null;
  role: string | null;
} | null;

export default function TopNavClient({ userNow }: { userNow: User }) {
  //  現在のURLのパスを取得する。

  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  return (
    <header className="shadow-sm bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="grid h-8 w-8 place-items-center rounded-md bg-gray-100 text-sm font-bold"
          >
            CRM
          </Link>

          {/* ✅navは、『ここはナビゲーションです』と検索エンジンに伝える。見た目の変化はない。 */}
          <nav className="flex items-center gap-6 text-sm">
            {/* ✅mapは正確には配列のエレメント */}

            {tabs.map((t) => {
              // ✅今のURLとタブURLが同じかのチェック。厳密等価演算子。booleanを返す。trueのとき、activeはtrueになる。
              // ✅配列tabsの href（パス）と、定数pathname（フックで取ってきた）が、同じかを見ている。
              const active = pathname === t.href;
              return (
                // Linkは<a>の変わり。
                <Link
                  key={t.href} //✅配列tabsの中の、hrefをkeyにしている。
                  href={t.href}
                  className={[
                    'relative py-4 text-gray-900 hover:text-gray-900',
                    active ? 'text-gray-900 font-semibold' : '',
                  ].join(' ')}
                >
                  {/* ⬇️各項目表示部 */}
                  {t.label}
                  {/* ✅配列tabsの中の、labelを表示している。 */}
                  {active && (
                    // ⬇️タブを押下時の、青線を表している。論理演算子＆＆。
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-indigo-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ✅プロフィール欄表示部　🤖 */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
          >
            {/* ✅三項演算子　trueの際に、userNow.nameを返す。 */}
            {userNow ? userNow.name : 'Guest'} 🔽
          </button>

          {/* ✅　openがtrueのときに表示されるメニュー */}
          {open && (
            <div className="absolute right-0 top-full mt-2 w-40 rounded-md  bg-white shadow-md">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100 font-semibold"
                onClick={() => setOpen(false)}
              >
                プロフィール
              </Link>

              <Link
                href="/register"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 font-semibold"
                onClick={() => {
                  setOpen(false);
                  // window.location.href = '/api/auth/logout';
                }}
              >
                ログアウト
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
