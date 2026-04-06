import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const userId = await getUserId();
  if (!userId) return null;

  const [campaigns, templates, lists, contacts] = await Promise.all([
    prisma.campaign.count({ where: { userId } }),
    prisma.emailTemplate.count({ where: { userId } }),
    prisma.contactList.count({ where: { userId } }),
    prisma.contact.count(),
  ]);

  // 直近5件のキャンペーン
  const recentCampaigns = await prisma.campaign.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { template: { select: { name: true } } },
  });

  const stats = [
    { label: 'キャンペーン', value: campaigns, color: 'bg-blue-50 text-blue-700' },
    { label: 'テンプレート', value: templates, color: 'bg-green-50 text-green-700' },
    { label: '配信リスト', value: lists, color: 'bg-purple-50 text-purple-700' },
    { label: '連絡先', value: contacts, color: 'bg-yellow-50 text-yellow-700' },
  ];

  const statusLabel: Record<string, string> = {
    draft: '下書き',
    scheduled: 'スケジュール済み',
    sending: '送信中',
    sent: '送信完了',
    cancelled: 'キャンセル',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-lg p-5 ${s.color}`}>
            <p className="text-sm font-medium">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* 直近のキャンペーン */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">直近のキャンペーン</h2>
        {recentCampaigns.length === 0 ? (
          <p className="text-sm text-gray-500">キャンペーンがまだありません</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">名前</th>
                <th className="pb-2">テンプレート</th>
                <th className="pb-2">ステータス</th>
                <th className="pb-2">作成日</th>
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.map((c) => (
                <tr key={c.id.toString()} className="border-b last:border-0">
                  <td className="py-2 font-medium">{c.name}</td>
                  <td className="py-2 text-gray-600">{c.template.name}</td>
                  <td className="py-2">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {statusLabel[c.status] ?? c.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">
                    {c.createdAt.toLocaleDateString('ja-JP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
