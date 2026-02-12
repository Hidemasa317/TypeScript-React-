import { useState, useEffect } from 'react';

export default function Time() {
  const [time, setTime] = useState<string>('');

  //useEffect部🤖
  // useEffect(() => {実行したい処理}, []);   ⚫️[]で、最初の一回のみ、という意味になる。

  useEffect(() => {
    const interval: number = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
  }, []);

  //[]で、最初の一回のみ。
  //🟤setInterval🟤は元からあるWeb API
  // 🟤setinterval (実行したい処理、ミリ秒);

  //showTime部も必要ないかも。統合できる。
  // const showTime = () => {
  //   setTime(new Date().toLocaleTimeString());
  // };

  return (
    <>
      <div
        style={{
          maxWidth: 600,
          margin: '0 auto',
          padding: 16,
          border: 5,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <li
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'space-between',

            padding: '50px',
            border: '1px solid #aaf51e',
          }}
        >
          <h1> NOW TIME BOARD </h1>
          <br />
          <h2>現在の時刻: {time}</h2>
          <br />
          {/* <button
            style={{ gap: 6, height: 100, color: 'green' }}
            onClick={showTime}
          >
            {' '}
            現在時刻に更新する。{' '}
          </button> */}
        </li>
      </div>
    </>
  );
}
