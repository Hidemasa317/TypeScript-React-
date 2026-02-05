import { useState } from 'react';

//// ①まず箱を作る。②JSXは箱内の、return（戻り値）の中にかく。

function counterApp() {
  const [count, setCount] = useState(0); //useStateの初期値を0にしている。
  return (
    <>
      <h1>カウンターアプリ</h1>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>カウントアップ</button>
    </>
  );
}
