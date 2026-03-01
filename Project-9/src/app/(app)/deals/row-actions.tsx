'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RowActions({ id }: { id: string }) {
  const router = useRouter();

  async function ondealDelete() {
    if (!confirm('本当に削除しますか？')) return;

    const res = await fetch(`/api/deals/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      alert('削除に失敗しました');
      return;
    }

    router.refresh(); // 一覧再取得
  }

  return (
    <div className="flex gap-4">
      <Link
        href={`/deals/${id}/edit`}
        className="text-indigo-600 hover:underline"
      >
        編集
      </Link>

      <button onClick={ondealDelete} className="text-red-600 hover:underline">
        削除
      </button>
    </div>
  );
}
