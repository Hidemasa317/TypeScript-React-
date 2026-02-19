export default function ActivitiesPage() {
  return (
    <section className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h1 className="text-sm font-semibold">最近の活動</h1>
        <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          活動を追加
        </button>
      </div>
    </section>
  );
}
