import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DeleteButton from './delete-button';

//---✅活動詳細ページ---

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ActivityDetailPage({ params }: Props) {
  const { id } = await params;
  if (!id) {
    notFound();
  }

  const activityId = BigInt(id);

  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <div className="p-6">ログインしてください</div>;
  }

  // const userId = BigInt(uid);
  // const activityId = BigInt(id);

  //🔵🔵　活動ページへの画面遷移に使用する。✅🚨　contact.conpanyId.toString()~
  const activity = await prisma.activity.findFirst({
    where: { id: activityId },
    include: { company: true, contact: true, deal: true }, //✅🚨
  });

  if (!activity) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {' '}
          <p className="text-gray-700 text-sm">活動名:</p>
          {activity.title}
        </h1>

        <div className="flex gap-3">
          <Link
            href={`/activities/${activity.id}/edit`}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            編集
          </Link>

          <DeleteButton id={activity.id.toString()} />
        </div>
      </div>

      {/* N ここにステータスと、タイプを追加　🚨　*/}
      <section className="rounded-lg shadow-lg bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">活動</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {/* ✅🚨　会社情報へ遷移するリンク作成 */}
            <p className="text-sm text-gray-500">会社</p>

            <Link
              href={`/companies/${activity.companyId?.toString()}`}
              className="font-semibold text-indigo-600 hover:underline"
            >
              {/* ✅🔵ここのcompanyはrelationフィールドのcompany。 // */}
              {/* activityはincludeを書いた変数、includeでテーブルをまたぎ、companyの（視点が変わる）、nameを参照できる。 */}
              {activity.company?.name}
            </Link>
          </div>
          {/* ここに連絡先情報埋め込み。 */}

          <div>
            {/* ✅🚨　連絡先へ遷移するリンク作成 */}
            <p className="text-sm text-gray-500">連絡先</p>
            {activity.contact && (
              <Link
                href={`/contacts/${activity.contactId?.toString()}`}
                className="font-semibold text-indigo-600 hover:underline"
              >
                {/* ✅🔵ここのcompanyはrelationフィールドのcompany。 // */}
                {/* contactはincludeを書いた変数、includeでテーブルをまたぎ、companyの（視点が変わる）、nameを参照できる。 */}
                {activity.contact.lastName} {activity.contact.firstName}
              </Link>
            )}
          </div>

          <div className="font-semibold text-sm text-gray-600 mt-2">
            <p>
              予定日時:{' '}
              {activity.scheduledAt
                ? activity.scheduledAt.toLocaleString('ja-JP')
                : ''}
            </p>
          </div>

          {/* 🆕Admin設定追加後に、作成者　欄をここに追加。 */}

          <div>
            <p className="text-sm text-gray-500">説明</p>
            <p> {activity.description ?? ''}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
