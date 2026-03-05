import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import RowActivityActions from './row-actions';

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

export default async function ActivitiesPage({
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

  const total = await prisma.company.count();
  const totalPages = Math.ceil(total / pageSize);

  // 表示開始番号
  const start = skip + 1;
  // 表示終了番号
  const end = Math.min(skip + pageSize, total);

  const activities = await prisma.activity.findMany({
    where: { userId },
    include: {
      company: true,
      contact: true,
      deal: true,
    },
    orderBy: { scheduledAt: 'desc' },
  });

  const statusLabel: Record<string, string> = {
    scheduled: '予定',
    completed: '完了',
    cancelled: 'キャンセル',
  };

  const typeLabel: Record<string, string> = {
    tel: '電話',
    mail: 'メール',
    meeting: '会議',
    task: 'タスク',
    memo: 'メモ',
  };

  return (
    <section className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h1 className="text-sm font-semibold">活動</h1>

        <Link
          href="/activities/new"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
        >
          活動を追加
        </Link>
      </div>

      <div className="p-6 space-y-8">
        {activities.map((a) => {
          const statusColor =
            a.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : a.status === 'cancelled'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700';

          return (
            <div key={String(a.id)} className="flex gap-4">
              {/* 左の縦ライン */}
              <div className="mt-1 w-1 rounded bg-indigo-500" />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/activities/${a.id}`}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      {a.title}
                    </Link>

                    {/* 🔵 ステータス色分け */}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
                    >
                      {statusLabel[a.status] ?? a.status}
                    </span>
                  </div>

                  {/* 🔵作成日時表示部🔵 */}
                  <div className="text-sm text-gray-500">
                    {a.createdAt ? a.createdAt.toLocaleString('ja-JP') : '-'}
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  タイプ：{typeLabel[a.type] ?? a.type}
                </div>

                {a.company && (
                  <div className="text-sm">
                    会社：
                    <Link
                      href={`/companies/${a.companyId}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {a.company.name}
                    </Link>
                  </div>
                )}

                {a.contact && (
                  <div className="text-sm">
                    連絡先：
                    <Link
                      href={`/contacts/${a.contactId}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {a.contact.firstName} {a.contact.lastName}
                    </Link>
                  </div>
                )}

                {/* 予定日時追加 */}
                {a.scheduledAt && (
                  <div className="text-sm text-gray-600 mt-2">
                    予定日時: {a.scheduledAt.toLocaleString()}
                  </div>
                )}
                {a.description && (
                  <div className="text-sm text-gray-600 mt-2">
                    {a.description}
                  </div>
                )}

                <div className="flex gap-4 text-sm mt-2">
                  {/* ✅🤖　アクション 編集削除 部位 */}
                  <RowActivityActions id={String(a.id)} />
                </div>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <div className="text-sm text-gray-500">
            活動がまだ登録されていません。
          </div>
        )}

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
