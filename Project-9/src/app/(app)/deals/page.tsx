import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import RowDealActions from './row-actions';

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
  // 💎searchParams は Promise
}) {
  // 🍪
  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) {
    return <div className="p-6">ログインしてください</div>;
  }
  const userId = BigInt(uid);

  // 📦📄Page

  const params = await searchParams;
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;

  const page = Number(pageParam ?? 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const total = await prisma.deal.count();
  const totalPages = Math.ceil(total / pageSize);

  // 表示開始番号
  const start = skip + 1;
  // 表示終了番号
  const end = Math.min(skip + pageSize, total);

  // ✅prismaで　dealテーブルから取得し、格納。
  const deals = await prisma.deal.findMany({
    // where: { userId },
    include: { company: true, contact: true }, //✅🚨
    orderBy: { createdAt: 'desc' },
  });

  // ✅status プルダウン設定部
  const statusLabels: Record<string, string> = {
    prospecting: '新規開拓',
    qualification: 'ヒアリング',
    needs_analysis: '課題分析',
    proposal: '提案',
    negotiation: '交渉',
    closed_won: '受注',
    closed_lost: '失注',
  };

  return (
    <section className="rounded-lg bg-white">
      <div className="flex items-center justify-between px-5 py-4 shadow-2xl">
        <h1 className="text-sm font-semibold ">商談</h1>
        {/* Linkはサーバコンポーネントで使用できる。 */}
        <Link
          href="/deals/new"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
        >
          商談を追加
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg">
        <table className="min-w-full text-sm shadow-sm">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              <th className="px-5 py-3 text-left">タイトル</th>
              <th className="px-5 py-3 text-left">会社</th>
              <th className="px-5 py-3 text-left">連絡先</th>
              <th className="px-5 py-3 text-left">金額</th>
              <th className="px-5 py-3 text-left">ステータス</th>
              <th className="px-5 py-3 text-left">見込み制約日</th>
              <th className="px-5 py-3 text-left">アクション</th>
              {/* title String amount Decimal? status DealStatus expectedClosingDate
              DateTime? // 要件は
              date。PrismaはDateTimeで扱うのが一般的（DB側はdateでもOK）
              probability Int? description String? note String? */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deals.map((c) => {
              const dealStatusColor =
                c.status === 'closed_won'
                  ? 'bg-green-100 text-green-700'
                  : c.status === 'closed_lost'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700';

              return (
                <tr key={String(c.id)}>
                  {/* ✅　❶タイトル　*/}
                  <td className="px-5 py-4 font-semibold">
                    <Link
                      href={`/deals/${c.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {c.title}
                    </Link>
                  </td>
                  {/* ✅　❷会社　*/}
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
                  {/* ✅ ❸連絡先 リンク必要🚨　*/}
                  <td className="px-5 py-4 font-semibold">
                    {c.contact ? (
                      <Link
                        href={`/contacts/${c.contactId}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {c.contact.lastName} {c.contact.firstName}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </td>
                  {/* ✅　❹金額 リンクは必要ない。 */}
                  <td className="px-5 py-4">
                    {c.amount ? Number(c.amount).toLocaleString() : '-'}
                  </td>
                  {/* ✅　❺スタータス　プルダウン式の新要素　🔵 */}
                  <td className="px-5 py-4 font-semibold">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${dealStatusColor}`}
                    >
                      {statusLabels[c.status] ?? c.status}
                    </span>
                  </td>

                  {/* ✅　❻見込み制約日 */}
                  <td className="font-semibold px-5 py-4">
                    {c.expectedClosingDate
                      ? c.expectedClosingDate.toLocaleDateString('ja-JP')
                      : '-'}
                  </td>

                  <td className="px-5 py-4">
                    {/* ✅🤖　❻アクション 編集削除 部位 */}
                    <RowDealActions id={String(c.id)} />
                  </td>
                </tr>
              );
            })}
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
