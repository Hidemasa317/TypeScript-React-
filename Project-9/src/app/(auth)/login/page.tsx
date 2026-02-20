// src/app/(auth)/login/page.tsx
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* ロゴ（仮） */}
        <div className="flex justify-center mb-6">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-white shadow-sm border text-slate-700 font-bold">
            CRM
          </div>
        </div>

        {/* カード */}
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <form className="space-y-4">
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

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>

            {/* 下部：リンク＋ボタン */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/forgot"
                className="text-sm text-slate-600 underline hover:text-slate-900"
              >
                Forgot your password?
              </Link>

              <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                LOG IN
              </button>
            </div>
          </form>

          {/* 登録導線 */}
          <div className="mt-6 text-center text-sm text-slate-600">
            Already registered?{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
