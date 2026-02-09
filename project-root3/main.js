const todo = document.getElementById('todo');
const date = document.getElementById('date');
const submit = document.getElementById('submit');

submit.addEventListener('click', () => {
  //Todo登録ボタン

  const item = {}; //格納オブジェクト

  item.todo = todo.value;
  item.priority = priority.value;
  item.deadline = deadline.value;
  item.done = false; // 完了はひとまずBoolean値で設定

  // フォームをリセット
  todo.value = '';
  priority.value = '普';
  deadline.value = '';

  const tr = document.createElement('tr'); // tr要素を生成

  // オブジェクトの繰り返しはfor-in文
  for (const prop in item) {
    const td = document.createElement('td'); // td要素を生成
    td.textContent = item[prop]; // ブラケット記法
    tr.appendChild(td); // 生成したtd要素をtr要素に追加
  }

  table.append(tr); // trエレメントをtable要素に追加

  if (deadline.value != '') {
    item.deadline = deadline.value;
  } else {
    window.alert('期日を入力してください');
    return;
  }
});

const today = new Date();
console.log(today); // → 詳しい日時表記

const today = new Date();
console.log(today.toLocaleDateString()); // → yyyy/mm/dd

const date = new Date();
item.deadline = date.toLocaleDateString().replace(/\//g, '-');
//
