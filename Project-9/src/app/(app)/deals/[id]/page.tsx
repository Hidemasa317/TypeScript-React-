import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DeleteButton from './delete-button';

//---✅商談詳細ページ---

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DealDeDealPage({ params }: Props) {
  const { id } = await params;
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <div className="p-6">ログインしてください</div>;
  }

  const userId = BigInt(uid);
  const dealId = BigInt(id);

  //🔵🔵　商談ページへの画面遷移に使用する。✅🚨　contact.conpanyId.toString()~
  const deal = await prisma.deal.findFirst({
    where: { id: dealId, userId },
    include: { company: true, contact: true }, //✅🚨
  });

  if (!deal) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{deal.title}</h1>

        <div className="flex gap-3">
          <Link
            href={`/deals/${deal.id}/edit`}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            編集
          </Link>

          <DeleteButton id={deal.id.toString()} />
        </div>
      </div>

      {/* 商談情報カード */}
      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">商談</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {/* ✅🚨　会社情報へ遷移するリンク作成 */}
            <p className="text-sm text-gray-500">会社</p>

            <Link
              href={`/companies/${deal.companyId.toString()}`}
              className="text-indigo-600 hover:underline"
            >
              {/* ✅🔵ここのcompanyはrelationフィールドのcompany。 // */}
              {/* contactはincludeを書いた変数、includeでテーブルをまたぎ、companyの（視点が変わる）、nameを参照できる。 */}
              {deal.company?.name ?? '-'}
            </Link>
          </div>
          {/* ここに連絡先情報埋め込み。 */}

          <div>
            {/* ✅🚨　連絡先へ遷移するリンク作成 */}
            <p className="text-sm text-gray-500">連絡先</p>
            {deal.contact && (
              <Link
                href={`/contacts/${deal.contactId?.toString()}`}
                className="text-indigo-600 hover:underline"
              >
                {/* ✅🔵ここのcompanyはrelationフィールドのcompany。 // */}
                {/* contactはincludeを書いた変数、includeでテーブルをまたぎ、companyの（視点が変わる）、nameを参照できる。 */}
                {deal.contact.firstName} {deal.contact.lastName}
              </Link>
            )}
          </div>

          {/* companyId: deal.companyId.toString(), contactId:
          deal.contactId?.toString() ?? '', title: deal.title ?? '', 
          expectedClosingDate: deal.expectedClosingDate ?
          ,
          probability: , description:
          deal.description ?? '', note: deal.note ?? '', */}
          <div>
            <p className="text-sm text-gray-500">金額</p>
            <p>{deal.amount ? deal.amount.toString() : ''}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">ステータス</p>
            <p> {deal.status ?? ''}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">見込み制約日</p>
            <p>
              {deal.expectedClosingDate
                ? deal.expectedClosingDate.toISOString().split('T')[0]
                : ''}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">確率</p>
            <p>{deal.probability?.toString() ?? ''}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">備考</p>
            <p>{deal.note ?? '-'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
