import { prisma } from '@/lib/prisma';
import DealsForm from '../deals-form';
import { cookies } from 'next/headers';

export default async function NewDealPage() {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) return null;

  const userId = BigInt(uid);

  const companies = await prisma.company.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">商談を追加</h1>
      <DealsForm
        mode="create"
        // ✅会社情報📝
        companies={companies.map((c) => ({
          id: c.id.toString(),
          name: c.name,
        }))}
        // ✅連絡先情報
        contacts={contacts.map((c) => ({
          id: c.id.toString(),
          firstName: c.firstName,
          lastName: c.lastName,
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
