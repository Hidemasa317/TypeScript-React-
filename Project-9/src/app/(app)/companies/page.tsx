import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import RowActions from './row-actions';

export default async function CompaniesPage() {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <div className="p-6">ログインしてください</div>;
  }

  const userId = BigInt(uid);

  // ✅prismaで　companyテーブルから取得し、格納。
  const companies = await prisma.company.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <section className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h1 className="text-sm font-semibold">会社</h1>
        {/* Linkはサーバコンポーネントで使用できる。 */}
        <Link
          href="/companies/new"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
        >
          会社を追加
        </Link>
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
                  <RowActions id={String(c.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
