import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { cookies } from 'next/headers';
import CmpRend from '@/components/layout/CmpRend/dashboardForm';
import CtcRend from '@/components/layout/CtcRend/dashboardForm';
import DealRend from '@/components/layout/DealRend/dashboardForm';
import WonDealRend from '@/components/layout/WonDealRend/dashboardForm';
import SearchDealModal from '@/components/modal/SearchDealModal';
import SearchDealButton from '@/components/SearchDealButton';

// ✅🤖URL毎のページ本体、描画を担う片割れ。会社ページ・連絡先ページ等を探しに行く。

// function StatusPill({ text }: { text: string }) {
//   return (
//     <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
//       {text}
//     </span>
//   );
// }

// ✅関数　DashboardPage部

// 📦活動ページで使用する、時間差異計算部。🤖
function getRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 30) return `${days}日前`;
  if (months < 12) return `${months}ヶ月前`;

  return `${years}年前`;
}

export default async function DashboardPage() {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <div>"ログインしてください。"</div>;
  }
  const userId = BigInt(uid);
  // ✅🔵DBから会社数を取得。🔵
  const companyCount = await prisma.company.count();
  // { where: { userId } }は不要。
  const cmpcount = [{ label: '会社', value: companyCount }];
  // ✅🔵DBから連絡先数を取得。🔵
  const contactCount = await prisma.contact.count();
  const ctcCount = [{ label: '連絡先', value: contactCount }];

  // ✅🔵DBから商談数を取得。🔵
  const dealCount = await prisma.deal.count();
  // 閲覧制限をかけるときに、引数に➡️{ where: { userId }を記述。
  const dlCount = [{ label: '商談', value: dealCount }];

  // ✅🔵DBから活動数を取得。🔵
  const ActCount = await prisma.activity.count();

  const closedWonCount = await prisma.deal.count({
    where: {
      status: 'closed_won',
      // userId,
    },
  });

  // ✅🔵受注済み商談のみに絞って抽出。🔵
  const wonCount = [{ label: '受注済み商談', value: closedWonCount }];

  // 🟠商談カード　部

  // const userId = BigInt(uid);

  // ✅prismaで　dealテーブルから取得し、格納。
  const deals = await prisma.deal.findMany({
    // where: { userId },
    include: { company: true, contact: true }, //✅🚨
    orderBy: { createdAt: 'desc' },
    take: 5,
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

  // 🆕今後の活動
  const upcomingActivities = await prisma.activity.findMany({
    where: {
      // userId,

      scheduledAt: { gte: new Date() },
    },
    include: {
      company: true,
      contact: true,
      deal: true,
    },
    orderBy: { scheduledAt: 'asc' },
    take: 5,
  });
  // 🆕最近の活動　（分けて定数を定義）

  const resentActivities = await prisma.activity.findMany({
    where: {
      // userId,
      scheduledAt: { lt: new Date() },
    },
    include: {
      company: true,
      contact: true,
      deal: true,
    },
    orderBy: { scheduledAt: 'desc' },
    take: 5,
  });

  const typeLabel: Record<string, string> = {
    tel: '電話',
    mail: 'メール',
    meeting: '会議',
    task: 'タスク',
    memo: 'メモ',
  };

  // 🏢CmpRend用
  const company = await prisma.company.findMany({
    select: { id: true, name: true },
  });

  // 📝CtcRend
  const contact = await prisma.contact.findMany({
    select: { id: true, firstName: true, lastName: true },
  });

  // 💰DealRend
  const deal = await prisma.deal.findMany({
    select: { id: true, title: true },
  });

  // 🟢WonDealRend
  const WonDeal = await prisma.deal.findMany({
    where: { status: 'closed_won' },
    select: { id: true, title: true, status: true },
  });

  // 検索商談モーダル 部
  // const [showSearchCmp, setShowSearchCmp] = useState(false);

  // 🆕商談検索部　DBパーツ

  const searchDeals = await prisma.deal.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      status: true,
      expectedClosingDate: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 🆕bigintをstringへ変換。

  const searchDealItems = searchDeals.map((c) => ({
    id: c.id.toString(),
    title: c.title,
    status: c.status,
    expectedClosingDate: c.expectedClosingDate?.toISOString() ?? '',
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">DashBoard</h1>

      {/* ✅🤖カード部 */}
      <div className="flex grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* ✅配列の数分、UIを繰り返す。 */}
        {cmpcount.map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-5 shadow-sm">
            {/* ✅label・会社を取得 */}
            <div className="flex text-sm text-gray-600">
              {s.label}/ <CmpRend company={company} />
              {/* <div className=" ml-auto">
                <CmpRend company={company} />
              </div> */}
            </div>
            {/* ✅conpanyCountを取得 */}
            <div className="mt-2 text-3xl font-semibold">{s.value}</div>
            {/* 🚨　CmpRend */}
          </div>
        ))}

        {/* 🚨ここを改修 */}
        {ctcCount.map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-5 shadow-sm">
            {/* ✅label・連絡先を取得 */}
            <div className="flex text-sm text-gray-600">
              {s.label}/<CtcRend contact={contact} />
            </div>
            {/* ✅contactCountを取得 */}
            <div className="mt-2 text-3xl font-semibold">{s.value}</div>
          </div>
        ))}

        {dlCount.map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-5 shadow-sm">
            {/* ✅label・商談を取得 */}
            <div className="text-sm text-gray-600">
              {s.label}/ <DealRend deal={deal} />
            </div>
            {/* ✅dealCountを取得 */}
            <div className="mt-2 text-3xl font-semibold">{s.value}</div>
          </div>
        ))}

        {wonCount.map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-5 shadow-sm">
            {/* ✅label・受注済み商談を取得 */}
            <div className="text-sm text-gray-600">
              {s.label}/ <WonDealRend deal={WonDeal} />
            </div>
            {/* ✅wonCountを取得 */}
            <div className="mt-2 text-3xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ✅🤖　🆕　進行中の商談部 */}
      <section className="rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between  px-5 py-4 shadow-sm">
          <h1 className="flex items-center gap-3  text-sm font-semibold">
            進行中の商談（最新の5件）/
            <Link href="/deals" className="font-semibold text-indigo-600">
              {' '}
              See all
            </Link>
          </h1>
          <SearchDealButton deals={searchDealItems} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-800">
              <tr>
                <th className="px-5 py-3 text-left">タイトル</th>
                <th className="px-5 py-3 text-left">会社</th>
                <th className="px-5 py-3 text-left">金額</th>
                <th className="px-5 py-3 text-left">ステータス</th>
                <th className="px-5 py-3 text-left">見込み制約日</th>
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
                    <td className="px-5 py-4">
                      <Link
                        href={`/deals/${c.id}`}
                        className="text-indigo-600 font-semibold text-sm hover:underline"
                      >
                        {c.title}
                      </Link>
                    </td>
                    {/* ✅　❷会社　*/}
                    <td className="px-5 py-4">
                      {c.company ? (
                        <Link
                          href={`/companies/${c.companyId}`}
                          className="text-indigo-600 font-semibold text-sm hover:underline"
                        >
                          {c.company.name}
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
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${dealStatusColor}`}
                      >
                        {statusLabels[c.status] ?? c.status}
                      </span>
                    </td>

                    {/* ✅　❻見込み制約日 */}
                    <td className="px-5 py-4 text-sm font-semibold text-gray-500">
                      {c.expectedClosingDate
                        ? c.expectedClosingDate.toLocaleDateString('ja-Jp')
                        : '-'}{' '}
                      日
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between  px-5 py-4 shadow-sm">
            <Link
              href="/deals/new"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
            >
              新規商談
            </Link>
          </div>
        </div>
      </section>

      {/* ✅活動の2カード表示部　🤖 */}
      {/* --------------------⬇️今後の活動⬇️-------------------- */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between ">
            <h2 className="text-sm font-semibold">
              今後の活動
              <hr />
              {/* <div className="font-semibold">
                Number of registered activities 『{ActCount}』
              </div> */}
              5件まで表示されます。
              <Link
                href="./activities"
                className="text-indigo-600
              "
              >
                ➡️ See all
              </Link>
            </h2>

            <Link
              href="/activities/new"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
            >
              新規活動
            </Link>
            {/* {a.scheduledAt && (
              <div className="text-sm text-gray-600 mt-2">
                予定日時: {a.scheduledAt.toLocaleString()}
              </div>
            )} */}
          </div>

          <div className="mt-4 space-y-4">
            {/* 🆕文言追加 */}
            {upcomingActivities.length === 0 && (
              <div className="text-sm text-gray-500">
                今後の活動はありません。
              </div>
            )}

            {upcomingActivities.map((a, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1 w-1 rounded bg-indigo-500" />

                <div className="flex-1">
                  {/* ❶タイトル */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/activities/${a.id}`}
                      className="font-semibold"
                    >
                      {a.title}
                    </Link>
                    <div className="text-sm font-semibold text-gray-500">
                      {a.scheduledAt
                        ? a.scheduledAt.toLocaleString('ja-JP', {
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                          })
                        : '-'}
                      <br />
                      の活動予定。🗓️
                    </div>
                  </div>

                  {/* ❷タイプ */}
                  <div className="text-sm font-semibold text-gray-700">
                    タイプ：{typeLabel[a.type] ?? a.type}
                  </div>

                  {/* ❸関連（会社） */}
                  {a.company && (
                    <div className="text-sm font-semibold">
                      関連：
                      <Link
                        href={`/companies/${a.companyId}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {a.company.name}
                      </Link>
                    </div>
                  )}
                  {upcomingActivities.length === 0 && (
                    <div className="text-sm text-gray-500">
                      活動がまだ登録されていません。
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --------------------⬇️最近の活動⬇️-------------------- */}

        <section className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center">
            <h2 className="text-sm font-semibold">最近の活動</h2>
          </div>

          <div className="mt-4 space-y-4">
            {resentActivities.length === 0 && (
              <div className="text-sm text-gray-500">
                今後の活動はありません。
              </div>
            )}
            {resentActivities.map((a, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1 w-1 rounded bg-indigo-500" />

                <div className="flex-1">
                  {/* ❶タイトル */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/activities/${a.id}`}
                      className="rounded-full text-indigo-600 font-semibold"
                    >
                      {a.title}
                    </Link>
                    <div className="text-sm font-semibold text-gray-500">
                      予定日時:
                      {a.scheduledAt
                        ? a.scheduledAt.toLocaleString('ja-JP')
                        : '-'}
                    </div>
                  </div>

                  {/* ❷タイプ */}
                  <div className="text-sm font-semibold text-gray-700">
                    タイプ：{typeLabel[a.type] ?? a.type}
                  </div>

                  {/* ❸関連（会社） */}
                  {a.company && (
                    <div className="text-sm font-semibold">
                      関連：
                      <Link
                        href={`/companies/${a.companyId}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {a.company.name}
                      </Link>
                    </div>
                  )}
                  {resentActivities.length === 0 && (
                    <div className="text-sm text-gray-500">
                      活動がまだ登録されていません。
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
