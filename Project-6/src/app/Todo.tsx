'use client';

import { useEffect, useState } from 'react';

type TodoType = {
  id: string;
  text: string;
  date: string;
};

const STORAGE_KEY = 'project6_todos';

export default function Todo() {
  //------------------関数Todo定義------------------//

  //------🔹stateは『その状態』という概念、である。ひとまず概念を構築。
  //------🔹useStateは2つを返すので、[現在の値, 更新する値]の順で書く。🌟

  //🔹①関数内で必要なパーツとして定数を定義し、機能を代入。
  //🔹②JSX内の各部位内で定数要素を呼び出して、機能として具現化する。

  const [todos, updateTodos] = useState<TodoType[]>(() => {
    if (typeof window === 'undefined') return [];

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as TodoType[];
    } catch {
      // 既存コメントを残す方針のため、ここは簡潔に安全側へ。
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }); //配列と更新値を取得。
  const [text, updateText] = useState(''); //テキスト(todoへの入力値)と、更新値を取得。
  const [date, updateDate] = useState(''); //dateと更新値を取得。

  // todosが変わるたび保存。リロードしても編集内容が戻らないようにする。
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  //------ = () =>. イコール、カッコ、イコール＞ --------------//

  //Todo追加部位🤖//

  const addTodo = () => {
    //アロー関数、関数内の内容を、定数or変数に代入。
    if (!text.trim()) return alert('Todoを入力してください'); //アラート
    if (!date) return alert('期日を入力してください'); //アラート

    const newTodo: TodoType = {
      id: crypto.randomUUID(), //簡易的なものでも良いが、ランダムにidを吐くこちらの方法で一応試行する。
      //後々DBなどから拾う際に役立つかも。
      text: text.trim(), //'あいうえお'等々
      date, //日付
    };

    updateTodos((prev) => [...prev, newTodo]); //...ABC で、今までの配列のコピーという意味。そこに一つ上のオブジェクトで定義したnewTodoでTodoを追加する。
    updateText(''); //🌟updateTextは更新値であった。それを空Text
    updateDate(''); //🌟updateDateは更新値であった。それを空にする。
  };

  //削除ボタン部位🤖
  const deleteTodo = (id: string) => {
    //()内に値を入れると、その値を受け取る機構(アロー関数）となる。
    // filter 条件に残すものだけ残す。

    //🔴消したいtodoのidを受け取り、『そのTodoを除いた配列を再構築することで、
    //実質的な削除ボタン機能としている。

    updateTodos((prev) => prev.filter((t) => t.id !== id));
  };

  //Todo編集ボタン部位🤖
  const editTodoText = (id: string, currentText: string) => {
    const newText = prompt('Todoを編集', currentText); //入力欄にTodoを表示し、
    if (newText === null) return; //入力されなかったら、更新しない。

    const trimmed = newText.trim();
    if (!trimmed) return alert('Todoを入力してください');

    updateTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)),
    );
    //🟢map で、()内の要素を見て、新しい配列を返す。
    //id一致時　＝＝＝　の時、三項演算子が発動する。 一致の時、id 左（新しいtxtに置き換え。、否（false）の時、右（t)（変更しない）を返す。
  }; //⚫️t は、この時点で『定義』している。

  //🟤アロー関数、　const arrow (⚠️受け取る値⚠️) 　=> {}

  //-------------JSX ⬇️ -----------------//

  // ⚫️ return (); ⚫️ <div style{{margin:0 auto , padding :0;}}></div>と書く。
  // ⚫️ JSX内に書ける、3要素。①HTML属性②style（CSS）③イベント属性（React特有）

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
        <h1> Todo Maker </h1>

        <div>
          <label>
            Todo :
            <input
              value={text}
              onChange={(e) => updateText(e.target.value)}
              // 🔹イベントハンドラ属性　onChange{}の形である。
              // 🔹(e)(イベント属性)=>(アロー関数)updatetext(e.target.value(今変更された文字列))
              placeholder="例：会議"
            />
          </label>

          <label>
            期日 :
            <input
              value={date}
              type="date"
              onChange={(e) => updateDate(e.target.value)}
            />
          </label>
          <button onClick={addTodo}>Todoを追加する</button>
        </div>

        <ul>
          {todos.map((t) => (
            <li
              key={t.id}
              style={{
                marginTop: 16,
                border: '1px solid black',
                padding: 8,
                listStyle: 'none', //リストの・を枠の内側に。
                borderRadius: 4,
              }}
            >
              <span>
                {t.text}（{t.date}）
              </span>

              <span style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => editTodoText(t.id, t.text)}>
                  Todo編集
                </button>{' '}
                {/** Todo編集ボタン*/}
                <button onClick={() => deleteTodo(t.id)}>削除</button>
                {/** 削除ボタン */}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
