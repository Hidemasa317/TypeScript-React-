// ReactからuseStateを取り出す（状態管理で使う）
const { useState } = React;

// 画面に表示するカウンターコンポーネント
const CounterApp = () => {
  // count: 表示する数値 / setCount: 数値を更新する関数
  const [count, setCount] = useState(0);

  // ボタンが押されたときに1増やす処理
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  // React.createElementでJSXなしのUIを作る
  return React.createElement(
    'div',
    null,
    // 現在の数値を表示
    React.createElement('p', { 'aria-live': 'polite' }, String(count)),
    // クリックすると数値が1増えるボタン
    React.createElement(
      'button',
      { type: 'button', onClick: handleIncrement },
      '+1',
    ),
  );
};

// Reactの描画先（index.htmlの#root）を取得
const root = ReactDOM.createRoot(document.getElementById('root'));

// CounterAppを画面に描画する
root.render(React.createElement(CounterApp));
