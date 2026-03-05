import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import DealsForm from '../../activities-form';

// ✅　活動編集ページ　ーーーーーーーーーーーーーーーーーーーー
export default async function EditActivityPage({
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

  //✅　DBから活動情報を取得
  const activity = await prisma.activity.findFirst({
    where: { id: BigInt(id), userId },
  });

  if (!activity) return <div className="p-6">Not Found</div>;

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

  // ✅📦deals
  const deals = await prisma.deal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">活動を編集 : {activity.title} </h1>
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
          companyId: c.companyId.toString(),
        }))}
        // ✅📦🆕
        deals={deals.map((d) => ({
          id: d.id.toString(),
          title: d.title,
          companyId: d.companyId.toString(),
          contactId: d.contactId ? d.contactId.toString() : '',
        }))}
        initial={{
          companyId: activity.companyId?.toString() ?? '',
          contactId: activity.contactId?.toString() ?? '',
          dealId: activity.dealId?.toString() ?? '',

          type: activity.type,
          title: activity.title ?? '',
          description: activity.description ?? '',
          scheduledAt: activity.scheduledAt
            ? activity.scheduledAt.toISOString().slice(0, 10)
            : '',
          completedAt: activity.completedAt
            ? activity.completedAt.toISOString().slice(0, 10)
            : '',
          status: activity.status,
          outcome: activity.outcome ?? '',
        }}
      />
    </div>
  );
}
