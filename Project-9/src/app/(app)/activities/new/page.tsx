import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import ActivitiesForm from '../activities-form';

export default async function NewActivityPage() {
  const store = await cookies();
  const uid = store.get('uid')?.value;

  if (!uid) return null;

  const userId = BigInt(uid);

  const companies = await prisma.company.findMany({
    // where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const deals = await prisma.deal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">活動を追加</h1>
      <ActivitiesForm
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
          companyId: c.companyId.toString(),
        }))}
        // ✅商談情報
        deals={deals.map((c) => ({
          id: c.id.toString(),
          title: c.title,
          companyId: c.companyId.toString() ?? '',
          contactId: c.contactId?.toString() ?? '',
        }))}
      />
    </div>
  );
}
