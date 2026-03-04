'use client';

import { useState } from 'react';
import DeleteAccountModal from '@/components/modal/DeleteAccountModal';

type User = {
  name: string | null;
  role: string | null;
  email: string | null;
};

export default function ProfileForm({ user }: { user: User }) {
  // Profile📦
  const [name, setName] = useState(user.name ?? '');
  const [email, setEmail] = useState(user.email ?? '');

  async function onProfSave() {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    if (!res) {
      alert('プロフィールの更新に失敗しました');
      return;
    }
    alert('プロフィールを更新しました');
  }

  // パスワードアップデート📦
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function onPasswordSave() {
    if (newPassword !== confirmPassword) {
      alert('新しいパスワードと確認用パスワードが一致しません');
      return;
    }

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    if (!res.ok) {
      alert('パスワードの更新に失敗しました');
      return;
    }
    alert('パスワードを更新しました');

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  // 📦アカウント削除
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Profile</h1>

      {/* ✅🤖プロフィール情報カード　部 */}
      <section className="rounded-lg border bg-white p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Profile Information</h2>
          <p className="text-sm text-gray-500">
            Update your account's profile information and email address.
          </p>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border px-3 py-2"
            />
          </div>

          <button
            onClick={onProfSave}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            SAVE
          </button>
        </div>
      </section>

      {/* ✅🤖Update Password */}
      <section className="rounded-lg border bg-white p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Update Password</h2>
          <p className="text-sm text-gray-500">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              placeholder="現在のパスワードを入力してください"
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-2 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              placeholder="新しいパスワードを入力してください"
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="確認用パスワードを入力してください"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded-md border px-3 py-2"
            />
          </div>

          <button
            onClick={onPasswordSave}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            SAVE
          </button>
        </div>
      </section>

      {/* ✅🤖　role表示部　 */}
      <div className="text-sm text-gray-500">
        あなたの権限 Role: {user.role}
      </div>

      {/* 📦Delete Account */}
      <section className="rounded-lg border bg-white p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Delete Account</h2>
          <p className="text-sm text-gray-500">
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Before deleting your account, please download
            any data or information that you wish to retain.
          </p>
        </div>

        <button
          onClick={(e) => setShowDeleteModal(true)}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white"
        >
          DELETE ACCOUNT
        </button>

        {showDeleteModal && (
          <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
        )}
      </section>
    </div>
  );
}
