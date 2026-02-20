// src/app/(auth)/forgot/page.tsx
import Link from 'next/link';

export default function ForgotPage() {
  return (
    <div className="min-h-dvh bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* ロゴ（仮） */}
        <div className="flex justify-center mb-6">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-white shadow-sm border text-slate-700 font-bold">
            CRM
          </div>
        </div>

        {/* カード */}
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <p className="text-sm leading-6 text-slate-600">
            Forgot your password? No problem. Just let us know your email
            address and we will email you a password reset link that will allow
            you to choose a new one.
          </p>

          <form className="mt-5 space-y-4">
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

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                EMAIL PASSWORD RESET LINK
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            <Link href="/login" className="underline hover:text-slate-900">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
