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
                <th className="px-5 py-3 text-left font-medium">
                  アクション
                </th>
              </tr>
            </thead>
            {/* <tbody className="divide-y">
              {deals.map((d, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-5 py-4 font-medium text-indigo-600">
                    {d.title}
                  </td>
                  <td className="px-5 py-4 text-indigo-600">{d.company}</td>
                  <td className="px-5 py-4">{d.amount}</td>
                  <td className="px-5 py-4">
                    <StatusPill text={d.status} />
                  </td>
                  <td className="px-5 py-4">{d.close}</td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </section>
     
  );
}
