const todovalue = document.getElementById('todo');
const datevalue = document.getElementById('date');
const submitvalue = document.getElementById('submit');
const listvalue = document.getElementById('list');

const todos = []; // ← Todoの一覧（データ格納用の[]配列を作成）🎵

function render() {
  //リストの描画プロパティ
  // 項目の作成時のため、リストを空に。
  listvalue.innerHTML = ''; //文法：オブジェクトのプロパティに値を代入している。

  for (const tempitem of todos) {
    //初めてここでtempitemが定義されている。
    //繰り返しtempitemが払い出される。🎵
    const li = document.createElement('li'); //①liというhtmlからの概念を作成。
    li.textContent = `${tempitem.todo}（${tempitem.date}）`; //②概念に、txtデータのtodoとdateの入力値（文字列）中身を埋め込む。

    //削除ボタン
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除'; //ボタンに削除の文字を追加。
    deleteBtn.addEventListener('click', () => {
      todos.splice(todos.indexOf(tempitem), 1); //(開始index, 削除数)
      render(); //リストを再描画。
    });

    // todo編集ボタン
    const editTodoBtn = document.createElement('button');
    editTodoBtn.textContent = 'Todoの編集を行う';
    editTodoBtn.addEventListener('click', () => {
      const newTodo = prompt('Todoを編集', tempitem.todo);
      if (newTodo !== null) {
        todos.splice(todos.indexOf(tempitem.todo), 1, {
          todo: newTodo,
          date: tempitem.date,
        });
        render();
      }
    });

    // 期日編集ボタン
    const editDateBtn = document.createElement('button');
    editDateBtn.textContent = '期日の編集を行う';
    editDateBtn.addEventListener('click', () => {
      const newdate = prompt('期日を編集', tempitem.date);
      if (newdate !== null) {
        todos.splice(todos.indexOf(tempitem.date), 1, {
          date: newdate,
          todo: tempitem.todo,
        });
        render();
      }
    });

    listvalue.appendChild(li); //listの要素に、liを追加していく。
    listvalue.appendChild(editTodoBtn); //リストにTodo編集ボタンを追加。
    listvalue.appendChild(editDateBtn); //リストに期日編集ボタンを追加。
    listvalue.appendChild(deleteBtn); //リストに削除ボタンを追加。
  }
}

// Submitボタン機能
submitvalue.addEventListener('click', () => {
  const item = {};
  item.todo = todovalue.value; //入力値取得、idで拾ってきた内容を入れ込んで概念を作成。
  item.date = datevalue.value; //入力値取得、idで拾ってきた内容を入れ込んで概念を作成。
  // 入力に不足があった際の挙動設定。
  if (!item.todo) return window.alert('Todoを入力してください。'); //Todoが未入力時の表示
  if (!item.date) return window.alert('期日を入力してください。'); //期限が未入力時の表示

  todos.push(item); // データに追加
  render(); // 画面に反映🌟

  // 入力欄をクリア（要らないかも）
  // todovalue.value = '';
  // datevalue.value = '';
});
