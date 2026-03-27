'use client';
import { useState } from 'react';
import SearchDealModal from './modal/SearchDealModal';

type DealItem = {
  id: string;
  title: string;
  status: string;
  expectedClosingDate: string;
};

type Props = {
  deals: DealItem[];
};

export default function SearchDealButton({ deals }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center">
      {/* <button
        onClick={() => setOpen(true)}
        className="w-full max-w-xl border border-gray-300 rounded-md px-3 py-2 text-sm "
      >
        🔍検索
      </button> */}
      <button
        onClick={() => setOpen(true)}
        className="w-full max-w-xl flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-500"
      >
        🔍 商談を検索...
      </button>
      {open && <SearchDealModal deals={deals} onClose={() => setOpen(false)} />}
    </div>
  );
}
