import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import RowCmpActions from './row-actions';

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
  // 💎searchParams は Promise
}) {
  const params = await searchParams;

  // 🍪
  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) {
    return <div className="p-6">ログインしてください</div>;
  }
  const userId = BigInt(uid);

  // 📦📄Page
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;

  const page = Number(pageParam ?? 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const total = await prisma.company.count();
  const totalPages = Math.ceil(total / pageSize);

  // 表示開始番号
  const start = skip + 1;
  // 表示終了番号
  const end = Math.min(skip + pageSize, total);

  // ✅prismaで　companyテーブルから取得し、格納。
  const companies = await prisma.company.findMany({
    // where: { userId },
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize,
  });

  // 🔴Adminユーザ権限設定🔴

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return (
    <section className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h1 className="text-sm font-semibold">会社</h1>
        {/* Linkはサーバコンポーネントで使用できる。 */}

        {user?.role === 'admin' && (
          <Link
            href="/companies/new"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
          >
            会社を追加
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              <th className="px-5 py-3 text-left">名前</th>
              <th className="px-5 py-3 text-left">業界</th>
              <th className="px-5 py-3 text-left">電話番号</th>
              <th className="px-5 py-3 text-left">ウェブサイト</th>
              <th className="px-5 py-3 text-left">アクション</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* ✅map で、格納された定数から取り出す。 */}
            {companies.map((c) => (
              <tr key={String(c.id)}>
                {/* ✅会社名 */}
                <td className="px-5 py-4">
                  <Link
                    href={`/companies/${c.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {c.name}
                  </Link>
                </td>
                {/* ✅業界 */}
                <td className="px-5 py-4">{c.industry ?? '-'}</td>
                {/* ✅電話番号 */}
                <td className="px-5 py-4">{c.phone ?? '-'}</td>
                {/* ✅ウェブサイト */}
                <td className="px-5 py-4">
                  {c.website ? (
                    <a
                      href={c.website}
                      target="_blank"
                      className="text-indigo-600"
                    >
                      {c.website}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-5 py-4">
                  {/* ✅🤖アクション 編集削除 部位 */}
                  {user?.role === 'admin' && (
                    <RowCmpActions id={String(c.id)} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 📦📄Page */}

        <div className="flex items-center justify-between p-4 text-sm">
          {/* 左側 表示件数 */}
          <div className="text-gray-600">
            Showing {start} to {end} of {total} results
          </div>

          {/* 右側 ページ番号 */}
          <div className="flex items-center gap-1">
            {/* 前ページ */}
            {page > 1 && (
              <Link
                href={`?page=${page - 1}`}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                &lt;
              </Link>
            )}

            {/* ページ番号 */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;

              return (
                <Link
                  key={pageNumber}
                  href={`?page=${pageNumber}`}
                  className={`px-3 py-1 border rounded ${
                    page === pageNumber
                      ? 'bg-gray-200 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}

            {/* 次ページ */}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}`}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                &gt;
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
