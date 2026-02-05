import { useState } from 'react';

//// ①まず箱を作る。②JSXは箱内の、return（戻り値）の中にかく。

function Counter() {
  const [count, setCount] = useState(0); //useStateの初期値を0にしている。
  return (
    <>
      <div>
        <h1>カウンターアプリ</h1>
        <p>現在のカウント→{count}</p>
        <button onClick={() => setCount(count + 1)}>
          カウントアップボタン
        </button>
      </div>
    </>
  );
}
