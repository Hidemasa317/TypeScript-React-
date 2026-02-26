import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import RowActions from './row-actions';

export default async function ContactsPage() {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) {
    return <div className="p-6">ログインしてください</div>;
  }

  const userId = BigInt(uid);

  // ✅prismaで　companyテーブルから取得し、格納。
  const contacts = await prisma.contact.findMany({
    where: { userId },
    include: { company: true }, //✅🚨
    orderBy: { createdAt: 'desc' },
  });

  return (
    <section className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h1 className="text-sm font-semibold">連絡先</h1>
        {/* Linkはサーバコンポーネントで使用できる。 */}
        <Link
          href="/contacts/new"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
        >
          連絡先を追加
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              <th className="px-5 py-3 text-left">名前</th>
              <th className="px-5 py-3 text-left">会社</th>
              <th className="px-5 py-3 text-left">役職</th>
              <th className="px-5 py-3 text-left">メール</th>
              <th className="px-5 py-3 text-left">電話番号</th>
              <th className="px-5 py-3 text-left">アクション</th>
              {/* // firstName String 
              // // lastName String 
              // // position String? 
              // //email String? 
              // // phone String? 
              // mobile String? 
              // / note String? */}
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* ✅map で、格納された定数から取り出す。 */}
            {contacts.map((c) => (
              <tr key={String(c.id)}>
                {/* ✅　❶氏名　*/}
                <td className="px-5 py-4">
                  <Link
                    href={`/contacts/${c.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {c.firstName}
                    {c.lastName}
                  </Link>
                </td>
                {/* ✅　❷会社　ここに❶を移行 */}
                <td className="px-5 py-4">
                  {c.company ? (
                    <Link
                      href={`/companies/${c.companyId}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {c.company.name}
                    </Link>
                  ) : (
                    '-'
                  )}
                </td>
                {/* ✅ ❸役職 リンクは必要ない　*/}
                <td className="px-5 py-4">{c.position ?? '-'}</td>
                {/* ✅　❹メール リンクは必要ない。 */}
                <td className="px-5 py-4">{c.email ?? '-'}</td>
                {/* ✅　❺電話番号　リンクは必要ない */}
                <td className="px-5 py-4">{c.phone ?? '-'}</td>

                <td className="px-5 py-4">
                  {/* ✅🤖　❻アクション 編集削除 部位 */}
                  <RowActions id={String(c.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
