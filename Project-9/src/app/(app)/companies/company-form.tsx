'use client';

// ✅🤖　ーーーーーーーーーーーーー会社を追加ページーーーーーーーーーーーーーーーー
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Values = {
  name: string;
  industry: string;
  address: string;
  phone: string;
  website: string;
  note: string;
};

export default function CompanyForm({
  mode,
  id,
  initial,
}: {
  mode: 'create' | 'edit';
  id?: string;
  initial?: Partial<Values>;
}) {
  const router = useRouter();
  const [v, setV] = useState<Values>({
    name: initial?.name ?? '',
    industry: initial?.industry ?? '',
    address: initial?.address ?? '',
    phone: initial?.phone ?? '',
    website: initial?.website ?? '',
    note: initial?.note ?? '',
  });

  async function onSave() {
    const url = mode === 'edit' ? `/api/companies/${id}` : '/api/companies';

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
    router.push('/companies');
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave;
      }}
      className="rounded-lg border bg-white p-6 space-y-4"
    >
      <Field
        label="会社名（必須）"
        required
        value={v.name}
        onChange={(x) => setV({ ...v, name: x })}
      />
      <Field
        label="業界"
        value={v.industry}
        onChange={(x) => setV({ ...v, industry: x })}
      />
      <Field
        label="住所"
        value={v.address}
        onChange={(x) => setV({ ...v, address: x })}
      />
      <Field
        label="電話番号"
        value={v.phone}
        onChange={(x) => setV({ ...v, phone: x })}
      />
      <Field
        label="ウェブサイト"
        value={v.website}
        onChange={(x) => setV({ ...v, website: x })}
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
          onClick={() => router.push('/companies')}
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
