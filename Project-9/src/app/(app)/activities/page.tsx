import Link from 'next/link';

export default function ActivitiesPage() {
  return (
    <section className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h1 className="text-sm font-semibold">活動</h1>

        <Link
          href="/activities/new"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
        >
          活動を追加
        </Link>
      </div>
    </section>
  );
}
