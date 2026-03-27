'use client';
import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';

type DealItem = {
  id: string;
  title: string;
  status: string;
  expectedClosingDate: string;
};

type Props = {
  onClose: () => void;
  deals: DealItem[];
};

export default function SearchDealModal({ onClose, deals }: Props) {
  const [keyword, setKeyword] = useState('');

  // const dummyDeals = [
  //   { id: 1, title: 'ヒアリング' },
  //   { id: 2, title: '提案' },
  //   { id: 3, title: '新規開拓' },
  // ];

  // titleにkeywordが含まれているものだけ残す。
  // 🆕includesは部分一致。提を打ったら、提案　がヒット。

  const filterDeals = deals.filter((e) => e.title.includes(keyword));
  const limitDeals = filterDeals.slice(0, 3);

  // 🆕ステータスカラー
  const statusLabels: Record<string, string> = {
    prospecting: '新規開拓',
    qualification: 'ヒアリング',
    needs_analysis: '課題分析',
    proposal: '提案',
    negotiation: '交渉',
    closed_won: '受注',
    closed_lost: '失注',
  };

  const getStatusColor = (status: string) => {
    if (status === 'closed_won') return 'bg-green-100 text-green-700';
    if (status === 'closed_lost') return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-xl rounded-lg shadow-xl p-4"
      >
        {/* 🔍検索バー */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="🔍 商談を検索"
        />

        {/* 受注済みの商談 */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">受注済みの商談</p>
          <p className="text-xs text-gray-700">入力値..『{keyword}』</p>
        </div>

        <div className="mt-4 space-y-2">
          {limitDeals.map((c) => (
            <Link
              href={`/deals/${c.id}`}
              key={c.id}
              className="px-3 py-2 bg-gray-100 rounded-md text-sm font-semibold shadow-sm"
            >
              {/* <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(c.status)}`}
                >
                  {statusLabels[c.status] ?? c.status}
                </span> */}
              "{c.title}"
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(c.status)}`}
              >
                Status：
                {statusLabels[c.status] ?? c.status}
              </span>
              {/* <p className='text-xs text-gray-100'>見込み制約日</p> */}
              {/* {c.expectedClosingDate
                ? new Date(c.expectedClosingDate).toLocaleDateString('ja-Jp')
                : '-'} */}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// onCloseの処理は、親（searchDealButton）で、定義されている。外から渡されている。
// export default function SearchDealModal({ onClose }: Props) {
//   useEffect(() => {
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.key === 'Meta') onClose();
//     };
//     // 🆕『登録』、イベント監視、キーが押された瞬間、に、handleKey関数を実行。
//     window.addEventListener('keydown', handleKey);
//     // 🆕『削除』 returnからは、後処理。 removeEventListener.
//     return () => {
//       window.removeEventListener('keydown', handleKey);
//     };
//   }, [onClose]);

//   return (
//     <div
//       onClick={(e)=>  e.stopPropagation()}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
//     >
//       <input
//         type="text"
//         className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         placeholder="🔍商談を検索"
//       ></input>
//     </div>
//   );
// }
