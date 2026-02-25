import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import CompanyForm from '../../company-form';

export default async function EditCompanyPage({
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

  const company = await prisma.company.findFirst({
    where: { id: BigInt(id), userId },
  });

  if (!company) return <div className="p-6">Not Found</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">会社を編集</h1>
      <CompanyForm
        mode="edit"
        id={id}
        initial={{
          name: company.name,
          industry: company.industry ?? '',
          address: company.address ?? '',
          phone: company.phone ?? '',
          website: company.website ?? '',
          note: company.note ?? '',
        }}
      />
    </div>
  );
}
