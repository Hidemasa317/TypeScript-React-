'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm('本当に削除しますか？');
    if (!ok) return;

    const res = await fetch(`/api/companies/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      alert('削除に失敗しました');
      return;
    }

    router.push('/companies');
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white"
    >
      削除
    </button>
  );
}
