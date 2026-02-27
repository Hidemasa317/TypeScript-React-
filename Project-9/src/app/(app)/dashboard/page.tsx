import { prisma } from '@/lib/prisma';
// ✅🤖URL毎のページ本体、描画を担う片割れ。会社ページ・連絡先ページ等を探しに行く。

//✅🤖進行中の商談　部
const deals = [
  {
    title: 'タイトル',
    company: '九州メディカルケア株式会社',
    amount: '300',
    status: '見込み客発掘',
    close: '-',
  },
  {
    title: 'リスト分析自動化',
    company: 'アリが10宅急.inc',
    amount: '3,500,000',
    status: '見込み客発掘',
    close: '2025-12-31',
  },
  {
    title: 'クラウドAIソリューション導入案件',
    company: '株式会社テクノソリューション',
    amount: '5,000,000',
    status: '提案',
    close: '2025-10-25',
  },
];

//✅🤖最近の活動　部
const activities = [
  {
    title: '電話営業',
    type: '電話',
    related: 'アリが10宅急.inc',
    ago: '4ヶ月前',
  },
  { title: 'AAA', type: '電話', related: 'アリが10宅急.inc', ago: '4ヶ月前' },
];

function StatusPill({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
      {text}
    </span>
  );
}

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

      {/* ✅🤖　進行中の商談部 */}
      <section className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold">進行中の商談</h2>
          <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            新規商談
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-medium">タイトル</th>
                <th className="px-5 py-3 text-left font-medium">会社</th>
                <th className="px-5 py-3 text-left font-medium">金額</th>
                <th className="px-5 py-3 text-left font-medium">ステータス</th>
                <th className="px-5 py-3 text-left font-medium">
                  見込み成約日
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {deals.map((d, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-5 py-4 font-medium text-indigo-600">
                    {d.title}
                  </td>
                  <td className="px-5 py-4 text-indigo-600">{d.company}</td>
                  <td className="px-5 py-4">{d.amount}</td>
                  <td className="px-5 py-4">
                    <StatusPill text={d.status} />
                  </td>
                  <td className="px-5 py-4">{d.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 下2カラム */}
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

        <section className="rounded-lg border bg-white p-5">
          <h2 className="text-sm font-semibold">最近の活動</h2>
          <div className="mt-4 space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1 h-12 w-1 rounded bg-gray-200" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-xs text-gray-500">{a.ago}</div>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    タイプ：{a.type}
                  </div>
                  <div className="text-sm text-indigo-600">
                    関連：{a.related}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
