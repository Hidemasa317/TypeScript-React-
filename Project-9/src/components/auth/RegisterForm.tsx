'use client';
import type { SyntheticEvent } from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '');
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const confirmPassword = String(form.get('confirmPassword') ?? '');

    // TODO: ここにパスワード強度チェック等を足す
    if (password !== confirmPassword) {
      setLoading(false);
      setError('Confirm Password が一致しません');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? '登録に失敗しました');
      return;
    }

    // いったんログインへ（次にログイン実装するので）
    router.push('/login');
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          name="name"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          name="email"
          type="email"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          name="password"
          type="password"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'REGISTERING...' : 'REGISTER'}
        </button>
      </div>
    </form>
  );
}
