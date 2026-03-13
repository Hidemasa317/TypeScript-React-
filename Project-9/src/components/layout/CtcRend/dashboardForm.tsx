'use client';
import Link from 'next/link';
import { useState } from 'react';

type Contact = {
  id: bigint;

  firstName: string;
  lastName: string;
};

export default function CtcRend({ contact }: { contact: Contact[] }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Pagination部

  // ページ最大表示数
  const pageSize = 3;

  // start 各ページの最初に表示する配列番号数を算出する。
  const start = (page - 1) * pageSize;

  // end 各ページの表示の最大件数。
  const end = start + pageSize;

  // slice
  const paginatedCtc = contact.slice(start, end);

  // totalPage
  const totalPages = Math.ceil(contact.length / pageSize);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className="text-indigo-600 font-semibold text-sm hover:underline"
      >
        登録済み連絡先
      </button>

      {open && (
        <div className="absolute mt-2 w-30 rounded-md shadow-lg bg-white">
          {paginatedCtc.map((c) => (
            <Link
              className="block px-4 py-2 w-30 text-sm hover:bg-gray-100 shadow-sm"
              key={String(c.id)}
              href={`/contacts/${c.id}`}
            >
              {c.lastName}
              {c.firstName}
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
