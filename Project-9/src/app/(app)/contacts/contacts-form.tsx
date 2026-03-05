'use client';

// ✅🤖　ーーーーーーーーーーーーー連絡先を追加ページーーーーーーーーーーーーーーーー
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Values = {
  companyId: string; //✅会社をプルダウンで表示する準備。
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  note: string;
};

export default function ContactsForm({
  mode,
  id,
  initial,
  companies, //✅
}: {
  mode: 'create' | 'edit';
  id?: string;
  initial?: Partial<Values>;
  companies: { id: string; name: string }[]; //✅
}) {
  const router = useRouter();
  const [v, setV] = useState<Values>({
    companyId: initial?.companyId ?? '',
    firstName: initial?.firstName ?? '',
    lastName: initial?.lastName ?? '',
    position: initial?.position ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    mobile: initial?.mobile ?? '',
    note: initial?.note ?? '',
  });

  async function onSave() {
    const url = mode === 'edit' ? `/api/contacts/${id}` : '/api/contacts';

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
    router.push('/contacts');
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
      {/* 🚨ここに会社選択欄を追加 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">会社</label>
        <select
          className="mt-2 w-full rounded-md border px-3 py-2"
          required
          value={v.companyId}
          onChange={(e) => setV({ ...v, companyId: e.target.value })}
        >
          <option value="">会社を選択</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* ✅⬇️🤖 各フィールド部 */}
      <Field
        label="名"
        required
        value={v.firstName}
        onChange={(x) => setV({ ...v, firstName: x })}
      />
      <Field
        required
        label="姓"
        value={v.lastName}
        onChange={(x) => setV({ ...v, lastName: x })}
      />
      <Field
        label="役職"
        value={v.position}
        onChange={(x) => setV({ ...v, position: x })}
      />
      <Field
        label="メール"
        value={v.email}
        onChange={(x) => setV({ ...v, email: x })}
      />
      <Field
        label="電話番号"
        value={v.phone}
        onChange={(x) => setV({ ...v, phone: x })}
      />
      <Field
        label="携帯番号"
        value={v.phone}
        onChange={(x) => setV({ ...v, phone: x })}
      />
      <Field
        label="備考"
        value={v.note}
        onChange={(x) => setV({ ...v, note: x })}
        textarea
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          className="rounded-md border px-4 py-2 text-sm"
          onClick={() => router.push('/contacts')}
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
