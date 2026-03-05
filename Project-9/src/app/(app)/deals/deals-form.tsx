'use client';

// ✅🤖　ーーーーーーーーーーーーー商談を追加ページーーーーーーーーーーーーーーーー
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Values = {
  companyId: string;
  contactId: string;
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
  contacts,
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
}) {
  const router = useRouter();
  const [v, setV] = useState<Values>({
    companyId: initial?.companyId ?? '',
    contactId: initial?.contactId ?? '',
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
          onChange={(e) =>
            setV({ ...v, companyId: e.target.value, contactId: '' })
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
          {contacts
            .filter((c) => c.companyId === v.companyId)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {/* ✅　連絡先取得なので、　firstName と、lastName取得。 */}
                {c.firstName} {c.lastName}
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
      {/* ✅ ステータス　プルダウン式で選択 */}
      {/* 🆕　select と、　option で。🤖 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          ステータス
        </label>
        <select
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={v.status}
          onChange={(e) => setV({ ...v, status: e.target.value })}
        >
          <option value="">選択</option>
          <option value="prospecting">新規開拓</option>
          <option value="qualification">ヒアリング</option>
          <option value="needs_analysis">課題分析</option>
          <option value="proposal">提案</option>
          <option value="negotiation">交渉</option>
          <option value="closed_won">受注</option>
          <option value="closed_lost">失注</option>
        </select>
      </div>

      {/* ✅　見込み制約日　日付選択肢式 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          見込み制約日
        </label>
        <input
          className="mt-2 w-full rounded-md border px-3 py-2"
          type="date"
          value={v.expectedClosingDate}
          onChange={(e) => setV({ ...v, expectedClosingDate: e.target.value })}
        />
      </div>

      {/* ✅　確率部も数値に変換 */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          確率.%
        </label>
        <input
          className="mt-2 w-full rounded-md border px-3 py-2"
          type="number"
          value={v.probability}
          onChange={(e) => setV({ ...v, probability: e.target.value })}
        />
      </div>

      <Field
        label="説明"
        value={v.description}
        onChange={(x) => setV({ ...v, description: x })}
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
          onClick={() => router.push('/deals')}
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
