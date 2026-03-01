import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { cookies } from 'next/headers';
// ✅🤖URL毎のページ本体、描画を担う片割れ。会社ページ・連絡先ページ等を探しに行く。

// function StatusPill({ text }: { text: string }) {
//   return (
//     <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
//       {text}
//     </span>
//   );
// }

// ✅関数　DashboardPage部

export default async function DashboardPage() {
  // ✅🔵DBから会社数を取得。🔵
  const companyCount = await prisma.company.count();
  const cmpcount = [{ label: '会社', value: companyCount }];
  // ✅🔵DBから連絡先数を取得。🔵
  const contactCount = await prisma.contact.count();
  const ctcCount = [{ label: '連絡先', value: contactCount }];

  // ✅🔵DBから商談数を取得。🔵
  const dealCount = await prisma.deal.count();
  const dlCount = [{ label: '商談', value: dealCount }];

  const closedWonCount = await prisma.deal.count({
    where: {
      status: 'closed_won',
    },
  });
  const wonCount = [{ label: '受注済み商談', value: closedWonCount }];

  // 🟠商談カード　部
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <div>"ログインしてください。"</div>;
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

  //✅🤖最近の活動　部
  const activities = await prisma.activity.findMany({
    where: { userId },
    include: {
      company: true,
      contact: true,
      deal: true,
    },
    orderBy: { scheduledAt: 'desc' },
  });

  const typeLabel: Record<string, string> = {
    tel: '電話',
    mail: 'メール',
    meeting: '会議',
    task: 'タスク',
    memo: 'メモ',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">ダッシュボード</h1>

      {/* ✅🤖カード部 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* ✅配列の数分、UIを繰り返す。 */}
        {cmpcount.map((s) => (
          <div key={s.label} className="rounded-lg border bg-white p-5">
            {/* ✅label・会社を取得 */}
            <div className="text-sm text-gray-600">{s.label}</div>
            {/* ✅conpanyCountを取得 */}
            <div className="mt-2 text-3xl font-semibold">
              登録社数 : {s.value}
            </div>
          </div>
        ))}

        {ctcCount.map((s) => (
          <div key={s.label} className="rounded-lg border bg-white p-5">
            {/* ✅label・会社を取得 */}
            <div className="text-sm text-gray-600">{s.label}</div>
            {/* ✅conpanyCountを取得 */}
            <div className="mt-2 text-3xl font-semibold">
              連絡先数 : {s.value}
            </div>
          </div>
        ))}

        {dlCount.map((s) => (
          <div key={s.label} className="rounded-lg border bg-white p-5">
            {/* ✅label・会社を取得 */}
            <div className="text-sm text-gray-600">{s.label}</div>
            {/* ✅conpanyCountを取得 */}
            <div className="mt-2 text-3xl font-semibold">
              商談数 : {s.value}
            </div>
          </div>
        ))}

        {wonCount.map((s) => (
          <div key={s.label} className="rounded-lg border bg-white p-5">
            {/* ✅label・会社を取得 */}
            <div className="text-sm text-gray-600">{s.label}</div>
            {/* ✅conpanyCountを取得 */}
            <div className="mt-2 text-3xl font-semibold">
              受注した商談数 : {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ✅🤖　🆕　進行中の商談部 */}
      <section className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h1 className="text-sm font-semibold">進行中の商談</h1>
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
                      ? c.expectedClosingDate.toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-b px-5 py-4">
            <Link
              href="/deals/new"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
            >
              新規商談
            </Link>
          </div>
        </div>
      </section>

      {/* ✅活動の2カード表示部　🤖 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">今後の活動</h2>
            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              新規活動
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            今後の活動が見つかりませんでした。
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border bg-white p-5">
            <h2 className="text-sm font-semibold">最近の活動</h2>

            <div className="mt-4 space-y-4">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-1 rounded bg-indigo-500" />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{a.title}</div>
                    </div>

                    <div className="text-sm text-gray-700">
                      タイプ：{typeLabel[a.type] ?? a.type}
                    </div>

                    {a.company && (
                      <div className="text-sm">
                        関連：
                        <Link
                          href={`/companies/${a.companyId}`}
                          className="text-indigo-600 hover:underline"
                        >
                          {a.company.name}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
