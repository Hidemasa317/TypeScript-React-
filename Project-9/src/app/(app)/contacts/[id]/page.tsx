import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DeleteButton from './delete-button';

//---✅連絡先詳細ページ---

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContactDetailPage({ params }: Props) {
  const { id } = await params;
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <div className="p-6">ログインしてください</div>;
  }

  const userId = BigInt(uid);
  const contactId = BigInt(id);

  //🔵🔵　会社ページへの画面遷移に使用する。✅🚨　contact.conpanyId.toString()~
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, userId },
    include: { company: true }, //✅🚨
  });

  if (!contact) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {contact.firstName}
          {contact.lastName}
        </h1>

        <div className="flex gap-3">
          <Link
            href={`/contacts/${contact.id}/edit`}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            編集
          </Link>

          <DeleteButton id={contact.id.toString()} />
        </div>
      </div>

      {/* 連絡先情報カード */}
      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">連絡先情報</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {/* ✅🚨　会社情報へ遷移するリンク作成 */}
            <p className="text-sm text-gray-500">会社</p>

            <Link
              href={`/companies/${contact.companyId.toString()}`}
              className="text-indigo-600 hover:underline"
            >
              {/* ✅🔵ここのcompanyはrelationフィールドのcompany。 // */}
              {/* contactはincludeを書いた変数、includeでテーブルをまたぎ、companyの（視点が変わる）、nameを参照できる。 */}
              {contact.company.name}
            </Link>
          </div>

          <div>
            <p className="text-sm text-gray-500">役職</p>
            <p>{contact.position ?? '-'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">メール</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">電話番号</p>
            <p>{contact.phone ?? '-'}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">備考</p>
            <p>{contact.note ?? '-'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
