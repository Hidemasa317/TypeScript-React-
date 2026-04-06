import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const statusLabel: Record<string, { label: string; color: string }> = {
  draft:     { label: '下書き',        color: 'bg-gray-100 text-gray-700' },
  scheduled: { label: 'スケジュール済', color: 'bg-blue-100 text-blue-700' },
  sending:   { label: '送信中',        color: 'bg-yellow-100 text-yellow-700' },
  sent:      { label: '送信完了',      color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'キャンセル',    color: 'bg-red-100 text-red-700' },
};

export default async function CampaignsPage() {
  const userId = await getUserId();
  if (!userId) return null;

  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      template: { select: { name: true } },
      contactList: { select: { name: true } },
      _count: { select: { sends: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">キャンペーン</h1>
        <Link
          href="/campaigns/new"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          + 新規作成
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500 text-sm">
          キャンペーンがまだありません
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">名前</th>
                <th className="text-left px-4 py-3 font-medium">テンプレート</th>
                <th className="text-left px-4 py-3 font-medium">配信リスト</th>
                <th className="text-left px-4 py-3 font-medium">ステータス</th>
                <th className="text-left px-4 py-3 font-medium">送信数</th>
                <th className="text-left px-4 py-3 font-medium">作成日</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const s = statusLabel[c.status] ?? { label: c.status, color: 'bg-gray-100 text-gray-700' };
                return (
                  <tr key={c.id.toString()} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/campaigns/${c.id}`} className="font-medium text-blue-600 hover:underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.template.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.contactList.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c._count.sends}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {c.createdAt.toLocaleDateString('ja-JP')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
