import { useState } from 'react';

export default function Todo() {
  //------------------関数Todo定義------------------//

  //------🔹stateは『その状態』という概念、である。ひとまず概念を構築。
  //------🔹useStateは2つを返すので、[現在の値, 更新する値]の順で書く。🌟

  //🔹①関数内で必要なパーツとして定数を定義し、機能を代入。
  //🔹②JSX内の各部位内で定数要素を呼び出して、機能として具現化する。

  const [todos, updateTodos] = useState(0); //配列と更新値を取得。
  const [text, updateText] = useState(0); //テキスト(todoへの入力値)と、更新値を取得。
  const [date, updateDate] = useState(0); //dateと更新値を取得。

  //------ = () =>. イコール、カッコ、イコール＞ --------------//

  //Todo追加部位🤖//

  const addTodo = () => {
    //アロー関数、関数内の内容を、定数or変数に代入。
    if (!text) return alert('Todoを入力してください');//アラート
    if (!date) return alert('期日を入力してください');//アラート

    const newTodo = {
      id: crypto.rundomUUID(), //簡易的なものでも良いが、ランダムにidを吐くこちらの方法で一応試行する。
      //後々DBなどから拾う際に役立つかも。
      text, //'あいうえお'等々
      date, //日付
    };

    updateTodos([...todos, newTodo]); //...ABC で、今までの配列のコピーという意味。そこに一つ上のオブジェクトで定義したnewTodoでTodoを追加する。
    updateText(''); //🌟updateTextは更新値であった。それを空Text
    updateDate(''); //🌟updateDateは更新値であった。それを空にする。
  };

  //削除ボタン部位🤖
  const deleteTodo = (id){

  };

  //-------------JSX ⬇️ -----------------//

  // ⚫️ return (); ⚫️ <div style{{margin:0 auto , padding :0;}}></div>と書く。

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
          allignitems: 'center',
        }}
      >
        <h1> Todo Maker </h1>

        <div>
          <label>
            Todo :
            <input value={text} />
          </label>
          <label>
            期日 :
            <input value={date} type="date" />
          </label>
          <button onClick={addTodo}>Todoを追加する</button>
        </div>
      </div>
    </>
  );
}
