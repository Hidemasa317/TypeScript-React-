'use client';

// ✅🤖　ーーーーーーーーーーーーー商談を追加ページーーーーーーーーーーーーーーーー
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Values = {
  companyId: string;
  title: string;
  amount: string;
  status: string;
  expectedClosingDate: string;
  probability: string;
  description: string;
  note: string;
};

export default function DealsForm({
  mode,
  id,
  initial,
  companies, //
  deals,
}: {
  mode: 'create' | 'edit';
  id?: string;
  initial?: Partial<Values>;
  companies: { id: string; name: string }[]; //✅
}) {
  const router = useRouter();
  const [v, setV] = useState<Values>({
    companyid: initial?.companyId ?? '',
    title: initial?.title ?? '',
    amount: initial?.amount ?? '',
    status: initial?.status ?? '',
    expectedClosingDate: initial?.expectedClosingDate ?? '',
    probability: initial?.probability ?? '',
    description: initial?.description ?? '',
    note: initial?.note ?? '',
  });

  async function onSave() {
    const url = mode === 'edit' ? `/api/deals/${id}` : '/api/deals';

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
    router.push('/deals');
    router.refresh();
  }

  return (
    <section className="rounded-lg border bg-white p-6 space-y-4">
      {/* 🚨ここに会社選択欄を追加 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">会社</label>
        <select
          className="mt-2 w-full rounded-md border px-3 py-2"
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
      <div>
        <label className="block text-sm font-medium text-slate-700">
          連絡先
        </label>
        <select
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={v.contactId}
          onChange={(e) => setV({ ...v, contactId: e.target.value })}
        >
          <option value="">連絡先を選択</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <Field
        label="タイトル"
        value={v.title}
        onChange={(x) => setV({ ...v, title: x })}
      />
      <Field
        label="金額"
        value={v.amount}
        onChange={(x) => setV({ ...v, amount: x })}
      />
      <Field
        label="ステータス"
        value={v.status}
        onChange={(x) => setV({ ...v, status: x })}
      />
      <Field
        label="見込み制約日"
        value={v.expectedClosingDate}
        onChange={(x) => setV({ ...v, expectedClosingDate: x })}
      />
       {/* ✅🆕 */}
      <Field
        label="確率"
        value={v.expectedClosingDate}
        onChange={(x) => setV({ ...v, expectedClosingDate: x })}
      />

      /* ✅🆕 */}
      <Field
        label="説明"
        value={v.expectedClosingDate}
        onChange={(x) => setV({ ...v, expectedClosingDate: x })}
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
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={onSave}
        >
          保存
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {textarea ? (
        <textarea
          className="mt-2 w-full rounded-md border px-3 py-2"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
