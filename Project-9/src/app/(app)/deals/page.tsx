import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import RowActions from './row-actions';

export default async function ContactsPage() {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <div className="p-6">ログインしてください</div>;
  }

  const userId = BigInt(uid);

  // ✅prismaで　dealテーブルから取得し、格納。
  const deals = await prisma.deal.findMany({
    where: { userId },
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
    <section className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h1 className="text-sm font-semibold">商談</h1>
        {/* Linkはサーバコンポーネントで使用できる。 */}
        <Link
          href="/deals/new"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
        >
          商談を追加
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              <th className="px-5 py-3 text-left">タイトル</th>
              <th className="px-5 py-3 text-left">会社</th>
              <th className="px-5 py-3 text-left">連絡先</th>
              <th className="px-5 py-3 text-left">金額</th>
              <th className="px-5 py-3 text-left">ステータス</th>
              <th className="px-5 py-3 text-left">見込み制約日</th>
              {/* title String amount Decimal? status DealStatus expectedClosingDate
              DateTime? // 要件は
              date。PrismaはDateTimeで扱うのが一般的（DB側はdateでもOK）
              probability Int? description String? note String? */}
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* ✅map で、格納された定数から取り出す。 */}
            {deals.map((c) => (
              <tr key={String(c.id)}>
                {/* ✅　❶タイトル　*/}
                <td className="px-5 py-4">
                  <Link
                    href={`/deals/${c.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {c.title}
                  </Link>
                </td>
                {/* ✅　❷会社　*/}
                <td className="px-5 py-4">
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
                <td className="px-5 py-4">
                  {c.contact ? (
                    <Link
                      href={`/contacts/${c.contactId}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {c.contact.firstName} {c.contact.lastName}
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
                <td className="px-5 py-4">
                  {statusLabels[c.status] ?? c.status}
                </td>

                {/* ✅　❻見込み制約日 */}
                <td className="px-5 py-4">
                  {c.expectedClosingDate
                    ? new Date(c.expectedClosingDate).toLocaleDateString()
                    : '-'}
                </td>

                <td className="px-5 py-4">
                  {/* ✅🤖　❻アクション 編集削除 部位 */}
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
