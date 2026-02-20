// src/app/(auth)/register/page.tsx
import Link from 'next/link';

export default function RegisterPage() {
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
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
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 下部：リンク＋ボタン */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/login"
                className="text-sm text-slate-600 underline hover:text-slate-900"
              >
                Already registered?
              </Link>

              <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                REGISTER
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
