import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DeleteButton from './delete-button';

//. ✅ーーー会社詳細ページーーー

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CompanyDetailPage({ params }: Props) {
  const { id } = await params;
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <div className="p-6">ログインしてください</div>;
  }

  const userId = BigInt(uid);
  const companyId = BigInt(id);

  const company = await prisma.company.findFirst({
    where: { id: companyId, userId },
  });

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{company.name}</h1>

        <div className="flex gap-3">
          <Link
            href={`/companies/${company.id}/edit`}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            編集
          </Link>

          <DeleteButton id={company.id.toString()} />
        </div>
      </div>

      {/* 会社情報カード */}
      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">会社情報</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">業界</p>
            <p>{company.industry ?? '-'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">電話番号</p>
            <p>{company.phone ?? '-'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">ウェブサイト</p>
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600"
              >
                {company.website}
              </a>
            ) : (
              <p>-</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">住所</p>
            <p>{company.address ?? '-'}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">備考</p>
            <p>{company.note ?? '-'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
