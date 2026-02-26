import ContactsForm from '../contacts-form';

export default function NewContactsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">連絡先を追加</h1>
      <ContactsForm mode="create" />
    </div>
  );
}
