import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export default async function ActivitiesPage() {
  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) return null;

  const userId = BigInt(uid);

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

                  <div className="text-sm text-gray-500">
                    {a.scheduledAt ? a.scheduledAt.toLocaleString() : '-'}
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

                {a.description && (
                  <div className="text-sm text-gray-600 mt-2">
                    {a.description}
                  </div>
                )}

                <div className="flex gap-4 text-sm mt-2">
                  <Link
                    href={`/activities/${a.id}/edit`}
                    className="text-indigo-600 hover:underline"
                  >
                    編集
                  </Link>
                  <Link
                    href={`/activities/${a.id}/delete`}
                    className="text-red-600 hover:underline"
                  >
                    削除
                  </Link>
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
      </div>
    </section>
  );
}
