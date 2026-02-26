import { prisma } from '@/lib/prisma';
import ContactsForm from '../contacts-form';
import { cookies } from 'next/headers';

export default async function NewContactPage() {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) return null;

  const userId = BigInt(uid);

  const companies = await prisma.company.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">連絡先を追加</h1>
      <ContactsForm
        mode="create"
        companies={companies.map((c) => ({
          id: c.id.toString(),
          name: c.name,
        }))}
      />
    </div>
  );
}

// import ContactsForm from '../contacts-form';

// export default function NewContactsPage() {
//   return (
//     <div className="space-y-4">
//       <h1 className="text-xl font-semibold">連絡先を追加</h1>
//       <ContactsForm mode="create" />
//     </div>
//   );
// }
