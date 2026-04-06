import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const statusLabel: Record<string, { label: string; color: string }> = {
  active:       { label: '有効',       color: 'bg-green-100 text-green-700' },
  unsubscribed: { label: '配信停止',   color: 'bg-gray-100 text-gray-600' },
  bounced:      { label: 'バウンス',   color: 'bg-red-100 text-red-700' },
};

export default async function ContactsPage() {
  const userId = await getUserId();
  if (!userId) return null;

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      company: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">連絡先</h1>
        <Link
          href="/contacts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          + 追加
        </Link>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500 text-sm">
          連絡先がまだありません
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">メールアドレス</th>
                <th className="text-left px-4 py-3 font-medium">名前</th>
                <th className="text-left px-4 py-3 font-medium">会社</th>
                <th className="text-left px-4 py-3 font-medium">ステータス</th>
                <th className="text-left px-4 py-3 font-medium">登録日</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => {
                const s = statusLabel[c.status] ?? { label: c.status, color: 'bg-gray-100' };
                return (
                  <tr key={c.id.toString()} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{c.email}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {[c.lastName, c.firstName].filter(Boolean).join(' ') || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.company ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.color}`}>{s.label}</span>
                    </td>
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
