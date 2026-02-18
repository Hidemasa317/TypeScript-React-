'use client';

import { useState } from 'react';

export default function App() {
  //✅📦id取得
  const [zip, setZip] = useState<string>('');
  const [addr, setAddr] = useState<string>('-');
  const [msg, setMsg] = useState<string>('');

  // ✅🤖入力値受け取り部、論理演算子でnullなどの際に空文字に。
  // /\D/g, ''でより整形している。
  function normalizeZip(zipValue: string) {
    return (zipValue || '').replace(/\D/g, '');
  }

  //✅🤖api通信部
  async function apiConnect(zipcode: string): Promise<string> {
    const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${encodeURIComponent(zipcode)}`;
    const res = await fetch(url);
    const data = await res.json(); //✅Jsonで受け取る。

    const result = data.results[0]; //✅配列の一件目取得
    return `${result.address1}${result.address2}${result.address3}`; //✅結合して返す。
  }

  //✅🤖イベント登録部、エラー表示、　　addEventListener => handleClick
  // クリック時に何が起きるかを設定。
  const handleClick = async () => {
    setMsg(''); //  📦msg.textContent = '';
    setAddr('-'); // 📦addr.textContent = '-';

    // 🚨エラー部
    const normalizedZip = normalizeZip(zip);
    if (normalizedZip.length !== 7) {
      setMsg('7桁で入力（ハイフン可）');
      return; //✅7文字でなければエラー表示。
    }

    const address = await apiConnect(normalizedZip);
    setAddr(address);
  };

  //   <label
  //     ><input id="zip" inputmode="numeric" placeholder="郵便番号を入力してください。" />
  //     <button id="btn">住所変換ボタン</button> </label
  //   ><!-- 郵便番号入力欄 -->
  //   <br />

  //   <br />
  //   <div class="box">
  //     <div>住所: <span id="addr">-</span></div>
  //     <div id="msg"></div>
  //   </div>
  // </div>
  return (
    <div
      id="container"
      style={{
        width: 400,
        margin: '0 auto',
        border: '15px ridge rgb(240,1,1)',
        padding: '11px',
        alignContent: 'baseline',
      }}
    >
      <h1> Address </h1>
      <label>
        <input
          value={zip}
          onChange={(i) => setZip(i.target.value)}
          inputMode="numeric"
          placeholder="郵便番号を入力してください"
        />
        <button onClick={handleClick}>住所変換ボタン</button>
      </label>
      <br />
      <br />

      <div
        className="box"
        style={{
          marginTop: 12,
          padding: 10,
          border: '1px solid #ccc',
          borderRadius: 6,
        }}
      >
        <div>
          <span>: 住所 {addr}</span>
        </div>
        <div>
          {msg}
          <div />
        </div>
      </div>
    </div>
  );
}
