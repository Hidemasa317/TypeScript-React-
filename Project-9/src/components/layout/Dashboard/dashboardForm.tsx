'use client';
import { useState } from 'react';
import Link from 'next/link';

type Company = {
  id: bigint;
  name: string;
};

export default function CmpRend({ company }: { company: Company[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className="text-indigo-600 font-semibold text-sm hover:underline"
      >
        会社を閲覧
      </button>

      {open && (
        <div className="absolute mt-2 w-48 rounded-md shadow-sm bg-white">
          {company.map((c) => (
            <Link
              className="block px-4 py-2 text-sm hover:bg-gray-100 shadow-sm"
              key={String(c.id)}
              href={`/companies/${c.id}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
