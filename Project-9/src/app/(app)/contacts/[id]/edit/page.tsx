import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import ContactsForm from '../../contacts-form';

// ✅　連絡先編集ページ　ーーーーーーーーーーーーーーーーーーーー
export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div className="p-6">Invalid ID</div>;
  }

  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) return <div className="p-6">ログインしてください</div>;

  const userId = BigInt(uid);

  const contact = await prisma.contact.findFirst({
    where: { id: BigInt(id), userId },
  });

  if (!contact) return <div className="p-6">Not Found</div>;

  // ✅🚨
  const companies = await prisma.company.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">連絡先を編集</h1>
      <ContactsForm
        mode="edit"
        id={id}
        companies={companies.map((c) => ({
          id: c.id.toString(),
          name: c.name,
        }))}
        initial={{
          companyId: contact.companyId.toString(),
          firstName: contact.firstName ?? '',
          lastName: contact.lastName ?? '',
          position: contact.position ?? '',
          email: contact.email ?? '',
          phone: contact.phone ?? '',
          mobile: contact.mobile ?? '',
          note: contact.note ?? '',
        }}
      />
    </div>
  );
}
