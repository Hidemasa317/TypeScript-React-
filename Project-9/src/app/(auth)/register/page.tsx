// ✅Reactだけの場合。<a href="/login">Log in</a>
// ✅Next.jsでは、<Link href="/login">Log in</Link>を使う。
// ✅Linkの方がaより、高速であり、プリフェッチなどを行う。
// ✅LinkやRegisterFormはコンポーネント・UIを返す関数。❶先頭が大文字❷<ーー/>の形❸JSXを返す。
// ✅　➡️小文字・htmlタグ、大文字・コンポートネント
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-dvh bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-white shadow-sm border text-slate-700 font-bold">
            CRM
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm p-6">
          <RegisterForm />

          <div className="mt-6 text-center text-sm text-slate-600">
            Already registered?{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
