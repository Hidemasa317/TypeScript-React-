import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import DealsForm from '../../deals-form';

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

  //✅　DBから商談情報を取得
  const deal = await prisma.deal.findFirst({
    where: { id: BigInt(id), userId },
  });

  if (!deal) return <div className="p-6">Not Found</div>;

  // ✅📦companies
  const companies = await prisma.company.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  // ✅📦contacts
  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">商談を編集 : {deal.title} </h1>
      <DealsForm
        mode="edit"
        id={id}
        //✅📦
        companies={companies.map((c) => ({
          id: c.id.toString(),
          name: c.name,
        }))}
        // ✅📦🆕
        contacts={contacts.map((c) => ({
          id: c.id.toString(),
          firstName: c.firstName,
          lastName: c.lastName,
        }))}
        initial={{
          companyId: deal.companyId.toString(),
          contactId: deal.contactId?.toString() ?? '',
          title: deal.title ?? '',
          amount: deal.amount ? deal.amount.toString() : '',
          status: deal.status ?? '',
          expectedClosingDate: deal.expectedClosingDate
            ? deal.expectedClosingDate.toISOString().split('T')[0]
            : '',
          probability: deal.probability?.toString() ?? '',
          description: deal.description ?? '',
          note: deal.note ?? '',
        }}
      />
    </div>
  );
}
