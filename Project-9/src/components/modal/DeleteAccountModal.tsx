'use client';

import { useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function DeleteAccountModal({ onClose }: Props) {
  const [password, setPassword] = useState('');

  async function onDelete() {
    const res = await fetch('/api/profile', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      alert('削除に失敗しました');
      return;
    }
    // 成功でログイン画面へ。
    window.location.href = '/login';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">
          Are you sure you want to delete your account?
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Please enter your password to confirm.
        </p>

        <input
          type="password"
          placeholder="Password"
          className="mt-4 w-full rounded-md border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm"
          >
            CANCEL
          </button>

          <button
            onClick={onDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white"
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}
