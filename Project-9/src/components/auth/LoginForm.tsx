'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? 'ログインに失敗しました');
      return;
    }

    router.push('/dashboard');
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Remember me（今は未使用：後でcookie期限などに使える） */}
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          name="remember"
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        Remember me
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? 'LOGGING IN...' : 'LOG IN'}
        </button>
      </div>
    </form>
  );
}
