'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ResetPage() {
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  async function submit() {
    await fetch('/api/auth/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
  }
  alert('パスワードをリセットしました。');

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">新しいパスワード</h1>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={submit}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        更新
      </button>
    </div>
  );
}
