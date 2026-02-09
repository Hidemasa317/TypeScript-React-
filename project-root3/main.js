// const todovalue = document.getElementById('todo'); //id取得
// const datevalue = document.getElementById('date'); //id取得
// const submitvalue = document.getElementById('submit'); //id取得

// submitvalue.addEventListener('click', () => {
//   //①クリックによって情報取得を登録 『定数に対し、イベントを追加している。』
//   //Todo登録ボタン
//   const item = {}; //格納オブジェクト
//   item.todo = todovalue.value; //②todoへの入力値を取得。箱の中に仕切りを作り、その一行・レコードに値を入れているイメージ。
//   item.date = datevalue.value; //③dateからの入力値を取得。同様。保存先＝取得元
// });

// //

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
    //
    const li = document.createElement('li'); //①liというhtmlからの概念を作成。
    li.textContent = `${tempitem.todo}（${tempitem.date}`; //②概念に、txtデータのtodoとdateの入力値（文字列）中身を埋め込む。

    //削除ボタン
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除'; //ボタンに削除の文字を追加。
    deleteBtn.addEventListener('click', () => {
      //⭕️ここから

      todos.splice(todos.indexOf(tempitem), 1); //ボタンが押されたら、該当のtodoを削除。
      render(); //リストを再描画。

      // li.remove(); //ボタンが押されたら、li要素を削除。
      // deleteBtn.remove(); //ボタン自身も削除。
    });

    listvalue.appendChild(li); //③listの要素に、liを追加していく。
    listvalue.appendChild(deleteBtn); //リストに削除ボタンを追加。

    // window.alert(' Success ! ✅ リストが追加されました。');
  }
}

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
