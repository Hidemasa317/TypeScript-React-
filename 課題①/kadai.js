const countEl = document.getElementById('count'); //カウント表示用の要素を取得。
const incrementButton = document.getElementById('incrementButton'); //カウントを増やすボタンの要素を取得。

if (!countEl || !incrementButton) {
  throw new Error('Required elements not found.'); //countElやincrementButtonが見つからない場合にエラーを投げる。
}

let count = 0;

const updateCount = () => {
  //表示を更新する関数.

  countEl.textContent = String(count); //数値を文字列に変換。
};

incrementButton.addEventListener('click', () => {
  //ボタンがクリックされた時の処理。
  count += 1;
  updateCount();
});

updateCount();
