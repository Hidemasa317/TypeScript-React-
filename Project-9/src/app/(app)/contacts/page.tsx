import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import RowCtcActions from './row-actions';

export default async function ContactsPage({
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

  // ✅prismaで　contactテーブルから取得し、格納。
  const contacts = await prisma.contact.findMany({
    // where: { userId },
    include: { company: true }, //✅🚨
    orderBy: { createdAt: 'desc' },
  });

  // 📦📄Page
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;

  const page = Number(pageParam ?? 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const total = await prisma.contact.count();
  const totalPages = Math.ceil(total / pageSize);

  // 表示開始番号
  const start = skip + 1;
  // 表示終了番号
  const end = Math.min(skip + pageSize, total);

  return (
    <section className="rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 shadow-sm">
        <h1 className="text-sm font-semibold">連絡先</h1>
        {/* Linkはサーバコンポーネントで使用できる。 */}
        <Link
          href="/contacts/new"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
        >
          連絡先を追加
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg">
        <table className="min-w-full text-sm shadow-sm">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              <th className="px-5 py-3 text-left">名前</th>
              <th className="px-5 py-3 text-left">会社</th>
              <th className="px-5 py-3 text-left">役職</th>
              <th className="px-5 py-3 text-left">メール</th>
              <th className="px-5 py-3 text-left">電話番号</th>
              <th className="px-5 py-3 text-left">アクション</th>
              {/* // firstName String 
              // // lastName String 
              // // position String? 
              // //email String? 
              // // phone String? 
              // mobile String? 
              // / note String? */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* ✅map で、格納された定数から取り出す。 */}
            {contacts.map((c) => (
              <tr key={String(c.id)}>
                {/* ✅　❶氏名　*/}
                <td className="px-5 py-4 font-semibold">
                  <Link
                    href={`/contacts/${c.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {c.lastName}
                    {c.firstName}
                  </Link>
                </td>
                {/* ✅　❷会社　ここに❶を移行 */}
                <td className="px-5 py-4 font-semibold">
                  {c.company ? (
                    <Link
                      href={`/companies/${c.companyId}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {c.company.name}
                    </Link>
                  ) : (
                    '-'
                  )}
                </td>
                {/* ✅ ❸役職 リンクは必要ない　*/}
                <td className="px-5 py-4">{c.position ?? '-'}</td>
                {/* ✅　❹メール リンクは必要ない。 */}
                <td className="px-5 py-4">{c.email ?? '-'}</td>
                {/* ✅　❺電話番号　リンクは必要ない */}
                <td className="px-5 py-4">{c.phone ?? '-'}</td>

                <td className="px-5 py-4">
                  {/* ✅🤖　❻アクション 編集削除 部位 */}
                  <RowCtcActions id={String(c.id)} />
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
