import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import RowActions from './row-actions';

export default async function CompaniesPage() {
  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) return <div className="p-6">ログインしてください</div>;

  const userId = BigInt(uid);

  const companies = await prisma.company.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <section className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h1 className="text-sm font-semibold">会社</h1>
        <Link
          href="/companies/new"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          会社を追加
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              <th className="px-5 py-3 text-left font-medium">名前</th>
              <th className="px-5 py-3 text-left font-medium">業界</th>
              <th className="px-5 py-3 text-left font-medium">電話番号</th>
              <th className="px-5 py-3 text-left font-medium">ウェブサイト</th>
              <th className="px-5 py-3 text-left font-medium">アクション</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {companies.map((c) => (
              <tr key={String(c.id)}>
                <td className="px-5 py-4 font-medium">{c.name}</td>
                <td className="px-5 py-4">{c.industry ?? '-'}</td>
                <td className="px-5 py-4">{c.phone ?? '-'}</td>
                <td className="px-5 py-4">{c.website ?? '-'}</td>
                <td className="px-5 py-4">
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

// export default function CompaniesPage() {
//   return (
//     <section className="rounded-lg border bg-white">
//       <div className="flex items-center justify-between border-b px-5 py-4">
//         <h1 className="text-sm font-semibold">会社</h1>
//         <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
//           会社を追加
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="px-5 py-3 text-left font-medium">名前</th>
//               <th className="px-5 py-3 text-left font-medium">業界</th>
//               <th className="px-5 py-3 text-left font-medium">電話番号</th>
//               <th className="px-5 py-3 text-left font-medium">ウェブサイト</th>
//               <th className="px-5 py-3 text-left font-medium">アクション</th>
//             </tr>
//           </thead>
//         </table>
//       </div>
//     </section>
//   );
// }
