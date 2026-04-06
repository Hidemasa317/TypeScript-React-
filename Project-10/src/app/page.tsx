import { redirect } from 'next/navigation';

// ルートはダッシュボードへリダイレクト
export default function Home() {
  redirect('/dashboard');
}
