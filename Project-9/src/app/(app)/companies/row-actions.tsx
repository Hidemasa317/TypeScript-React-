'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RowActions({ id }: { id: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm('削除しますか？')) return;

    const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('削除に失敗しました');

    router.refresh();
  }

  return (
    <div className="flex gap-4">
      <Link
        className="text-indigo-600 hover:underline"
        href={`/companies/${id}/edit`}
      >
        編集
      </Link>
      <button className="text-red-600 hover:underline" onClick={onDelete}>
        削除
      </button>
    </div>
  );
}
