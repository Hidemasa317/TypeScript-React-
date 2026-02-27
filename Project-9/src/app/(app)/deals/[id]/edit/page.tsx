import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import ContactsForm from '../../deals-form';

// ✅　商談編集ページ　ーーーーーーーーーーーーーーーーーーーー
export default async function EditDealPage({
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

  //✅　DBから商談情報を取得
  const deal = await prisma.deal.findFirst({
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
      <h1 className="text-xl font-semibold">商談を編集 : {deal.title} </h1>
      <ContactsForm
        mode="edit"
        id={id}
        companies={companies.map((c) => ({
          id: c.id.toString(),
          name: c.name,
        }))}
        initial={{
          companyId: contact.companyId.toString(),
  contactId: contacgstring;
  title: string;
  amount: string;
  status: string;
  expectedClosingDate: string;
  probability: string;
  description: string;
  note: string;
        }}
      />
    </div>
  );
}
