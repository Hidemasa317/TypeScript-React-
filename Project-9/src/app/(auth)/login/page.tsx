// src/app/(auth)/login/page.tsx
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-white shadow-sm border text-slate-700 font-bold">
            CRM
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm p-6">
          <LoginForm />
          {/* ✅<関数名/>と記述すれば、別ファイルのUIが呼び出される。 */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <Link
              href="/forgot"
              className="text-sm text-slate-600 underline hover:text-slate-900"
            >
              Forgot your password?
            </Link>
          </div>

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
