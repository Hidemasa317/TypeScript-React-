'use client';

import { useState } from 'react';

function CountButton({ onClick }: { onClick: () => void }) {
  // ステートは親コンポーネントに集約する。子で定義しても、『state』は別になる。

  return (
    <div>
      <button onClick={onClick}>カウントアップボタン</button>
    </div>
  );
}

function CountDownButton({ onClick }: { onClick: () => void }) {
  return (
    <div>
      {/* 関数の引数にonClickを渡す */}
      <button onClick={onClick}>カウントダウンボタン</button>
    </div>
  );
}

export default function DashboardPage() {
  const [count, setCount] = useState(0);
  return (
    <section className=" min-h-screen flex flex-col gap-4 rounded-lg bg-white shadow-sm justify-center items-center p-4">
      <h1 className="text-2xl font-semibold ">現在のカウント：{count}</h1>

      <CountButton onClick={() => setCount(count + 1)} />
      <br></br>
      <CountDownButton onClick={() => setCount(count - 1)} />

      {/* <button
        className="rounded-lg bg-white shadow-sm hover:bg-gray-100"
        onClick={(e) => setCount(count + 1)}
      >
        カウントアップボタン
      </button>
      <br />
      <button
        className="rounded-lg bg-white shadow-sm hover:bg-gray-100"
        onClick={() => setCount(count - 1)}
      >
        カウントダウンボタン
      </button> */}
    </section>
  );
}
