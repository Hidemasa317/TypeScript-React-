import CompanyForm from '../company-form';

export default function NewCompanyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">会社を追加</h1>
      <CompanyForm mode="create" />
    </div>
  );
}
