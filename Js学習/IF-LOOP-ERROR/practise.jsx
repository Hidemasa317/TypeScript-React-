import { useState } from 'react';

function prac() {
  ruturn(
    <>
      <div>
        <h1>カウンターアプリ</h1>
        <p>現在のカウント→{count}</p>
        <button onClick={() => setCount(count + 1)}>
          カウントアップボタン
        </button>
      </div>
    </>,
  );
}
