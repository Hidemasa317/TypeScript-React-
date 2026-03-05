'use client';

// ✅🤖　ーーーーーーーーーーーーー活動を追加ページーーーーーーーーーーーーーーーー
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Values = {
  companyId: string;
  contactId: string;
  dealId: string;

  type: string;
  title: string;
  description: string;
  scheduledAt: string;
  completedAt: string;
  status: string;
  outcome: string;
};

export default function ActivitiesForm({
  mode,
  id,
  initial,
  companies,
  contacts,
  deals,
}: {
  mode: 'create' | 'edit';
  id?: string;
  initial?: Partial<Values>;
  companies: { id: string; name: string }[];
  contacts: {
    id: string;
    firstName: string;
    lastName: string;
    companyId: string;
  }[]; //✅props contactsを追加🚨
  deals: { id: string; title: string; contactId: string; companyId: string }[]; //✅props dealsを追加🚨
}) {
  const router = useRouter();
  const [v, setV] = useState<Values>({
    companyId: initial?.companyId ?? '',
    contactId: initial?.contactId ?? '',
    dealId: initial?.dealId ?? '',

    type: initial?.type ?? '',
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    scheduledAt: initial?.scheduledAt ?? '',
    completedAt: initial?.completedAt ?? '',
    status: initial?.status ?? '',
    outcome: initial?.outcome ?? '',
  });

  console.log(v);

  async function onSave() {
    const url = mode === 'edit' ? `/api/activities/${id}` : '/api/activities';

    const method = mode === 'edit' ? 'PUT' : 'POST';

    console.log('mode:', mode);
    console.log('url:', url);
    console.log('method:', method);

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v),
    });

    console.log('status:', res.status);

    const text = await res.text();
    console.log('response text:', text);

    if (!res.ok) {
      alert(`失敗: ${res.status}`);
      return;
    }
    // ✅URLを変えることは
    // ページを切り替えることと同義になる。
    // useRouter()はURLを変える。
    alert('成功');
    router.push('/activities');
    router.refresh();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="rounded-lg border bg-white p-6 space-y-4"
    >
      {/* ✅⬇️🤖 各フィールド部 */}

      {/* 📦会社選択欄 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">会社</label>
        <select
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={v.companyId}
          onChange={(e) =>
            setV({ ...v, companyId: e.target.value, contactId: '', dealId: '' })
          }
        >
          <option value="">会社を選択</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {/* ✅会社名取得なので、c.name */}
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 📦連絡先選択欄 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          連絡先
        </label>
        <select
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={v.contactId}
          onChange={(e) =>
            setV({ ...v, contactId: e.target.value, dealId: '' })
          }
        >
          <option value="">連絡先を選択</option>
          {contacts
            .filter((d) => String(d.companyId) === v.companyId)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {/* ✅　連絡先取得なので、　firstName と、lastName取得。 */}
                {c.firstName} {c.lastName}
              </option>
            ))}
        </select>
      </div>

      {/* 📦商談選択欄 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">商談</label>
        <select
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={v.dealId}
          onChange={(e) => setV({ ...v, dealId: e.target.value })}
        >
          <option value="">商談を選択</option>
          {deals
            .filter(
              (d) => d.companyId === v.companyId && d.contactId === v.contactId,
            )
            .map((c) => (
              <option key={c.id} value={c.id}>
                {/* ✅ 商談のタイトルを追加 */}
                {c.title}
              </option>
            ))}
        </select>
      </div>

      {/* ✅ タイプ　プルダウン式で選択 */}
      {/* 🆕　select と、　option で。🤖 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          タイプ
        </label>
        <select
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={v.type}
          onChange={(e) => setV({ ...v, type: e.target.value })}
        >
          <option value="">選択</option>
          <option value="call">電話</option>
          <option value="email">メール</option>
          <option value="meeting">会議</option>
          <option value="task">タスク</option>
          <option value="note">メモ</option>
        </select>
      </div>

      {/* ✅　タイトル　 */}
      <Field
        label="タイトル"
        required
        value={v.title}
        onChange={(x) => setV({ ...v, title: x })}
      />

      {/* ✅　説明 */}
      <Field
        label="説明"
        value={v.description}
        onChange={(x) => setV({ ...v, description: x })}
      />

      {/* ✅　予定日時 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          予定日時
        </label>
        <input
          className="mt-2 w-full rounded-md border px-3 py-2"
          type="date"
          value={v.scheduledAt}
          onChange={(e) => setV({ ...v, scheduledAt: e.target.value })}
        />
      </div>

      {/* ✅ ステータス　プルダウン式で選択 */}
      {/* 🆕　select と、　option で。🤖 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          ステータス
        </label>
        <select
          required
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={v.status}
          onChange={(e) => setV({ ...v, status: e.target.value })}
        >
          <option value="">選択</option>
          <option value="scheduled">予定</option>
          <option value="completed">完了</option>
          <option value="cancelled">キャンセル済み</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          className="rounded-md border px-4 py-2 text-sm"
          onClick={() => router.push('/activities')}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          保存
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {textarea ? (
        <textarea
          required={required}
          className="mt-2 w-full rounded-md border px-3 py-2"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          required={required}
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
