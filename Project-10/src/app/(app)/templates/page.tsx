import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  const userId = await getUserId();
  if (!userId) return null;

  const templates = await prisma.emailTemplate.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">メールテンプレート</h1>
        <Link
          href="/templates/new"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          + 新規作成
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500 text-sm">
          テンプレートがまだありません
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div key={t.id.toString()} className="bg-white rounded-lg shadow p-5">
              <h2 className="font-semibold mb-1">{t.name}</h2>
              <p className="text-sm text-gray-500 mb-2">件名: {t.subject}</p>
              {t.description && (
                <p className="text-xs text-gray-400 mb-3">{t.description}</p>
              )}
              <div className="flex gap-2">
                <Link
                  href={`/templates/${t.id}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  編集
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
