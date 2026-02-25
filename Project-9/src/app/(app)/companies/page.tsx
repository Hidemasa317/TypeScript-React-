export default function CompaniesPage() {
  return (
    <section className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h1 className="text-sm font-semibold">会社</h1>
        <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          会社を追加
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-medium">名前</th>
              <th className="px-5 py-3 text-left font-medium">業界</th>
              <th className="px-5 py-3 text-left font-medium">電話番号</th>
              <th className="px-5 py-3 text-left font-medium">ウェブサイト</th>
              <th className="px-5 py-3 text-left font-medium">アクション</th>
            </tr>
          </thead>
        </table>
      </div>
    </section>
  );
}
