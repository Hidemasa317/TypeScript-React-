'use client';
import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';

type Company = {
  id: bigint;
  name: string;
};

export default function CmpRend({ company }: { company: Company[] }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleClick = () => {
      setOpen(false);
    };

    if (open) {
      window.addEventListener('click', handleClick);
    }
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [open]);

  // 各ページの表示最大数。
  const pageSize = 3;

  // start　ページネーションの各ページにおいて、そのページの最初に表示する配列番号数を割り出す。
  // 例：2ページ目の時　(『2』−1 ) * 3 = 3 つまり、『4番目（3=4番目)』から。
  const start = (page - 1) * pageSize;

  // end 各ページの表示の最大件数。
  const end = start + pageSize;

  // slice paginated
  const paginatedCmp = company.slice(start, end);

  // Total Page  総件数 / 各ページの最大表示数
  const totalPages = Math.ceil(company.length / pageSize);

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="text-indigo-600 font-semibold text-sm hover:underline"
      >
        登録済み企業
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute mt-2 w-30 rounded-md shadow-lg bg-white"
        >
          {paginatedCmp.map((c) => (
            <Link
              className="block px-4 py-2 text-sm hover:bg-gray-100 shadow-sm"
              key={String(c.id)}
              href={`/companies/${c.id}`}
            >
              {c.name}
            </Link>
          ))}
          <div className="flex item-center px-2 py-2">
            <div className="flex item-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                &lt;
              </button>

              <span className="font-semibold">
                {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                &gt;
              </button>
            </div>

            <button
              className=" text-xs font-semibold ml-auto"
              onClick={() => setOpen(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
