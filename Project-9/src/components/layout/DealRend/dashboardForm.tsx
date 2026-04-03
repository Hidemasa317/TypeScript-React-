'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';

type Deal = {
  id: bigint;
  title: string;
};

export default function DealRend({ deal }: { deal: Deal[] }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleClick = () => {
      setOpen(!open);
    };

    if (open) {
      window.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [open]);

  const pageSize = 3;

  const start = (page - 1) * pageSize;

  const end = start + pageSize;

  const paginatedDeal = deal.slice(start, end);

  const totalPages = Math.ceil(deal.length / pageSize);

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="text-indigo-600 font-semibold text-sm hover:underline"
      >
        登録済み商談
      </button>

      {open && (
        <div className="absolute mt-2 w-30 rounded-md shadow-lg bg-white">
          {paginatedDeal.map((c) => (
            <Link
              className="block px-4 py-2 w-30 text-sm font-semibold hover:bg-gray-100 shadow-sm"
              key={String(c.id)}
              href={`/deals/${c.id}`}
            >
              {c.title}
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
