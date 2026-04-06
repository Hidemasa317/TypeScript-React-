import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ListsPage() {
  const userId = await getUserId();
  if (!userId) return null;

  const lists = await prisma.contactList.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { memberships: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">配信リスト</h1>
        <Link
          href="/lists/new"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          + 新規作成
        </Link>
      </div>

      {lists.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500 text-sm">
          配信リストがまだありません
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((l) => (
            <Link key={l.id.toString()} href={`/lists/${l.id}`}>
              <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
                <h2 className="font-semibold mb-1">{l.name}</h2>
                {l.description && (
                  <p className="text-sm text-gray-500 mb-2">{l.description}</p>
                )}
                <p className="text-2xl font-bold text-blue-600 mt-2">{l._count.memberships}</p>
                <p className="text-xs text-gray-400">連絡先</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
