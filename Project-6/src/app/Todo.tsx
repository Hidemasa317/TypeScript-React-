"use client";

import { useState, useEffect } from "react";

export default function Todo() {
  //------------------関数Todo定義------------------//

  //------🔹stateは『その状態』という概念、である。ひとまず概念を構築。
  //------🔹useStateは2つを返すので、[現在の値, 更新する値]の順で書く。🌟

  //🔹①関数内で必要なパーツとして定数を定義し、機能を代入。
  //🔹②JSX内の各部位内で定数要素を呼び出して、機能として具現化する。

  //型エイリアス　2/11

  type TodoType = {
    //このTodoTypeはオブジェクト型である。
    id: string;
    text: string;
    date: string;
  };

  const [todos, updateTodos] = useState<TodoType[]>([]); //オブジェクト型なので、TodoTypeを入れられる。
  const [text, updateText] = useState<string>("");
  const [date, updateDate] = useState<string>("");

  useEffect(() => {
    const loadTodo = async () => {
      try {
        const res = await fetch("/api/todos", { cache: "no-store" });

        if (!res.ok) {
          const raw = await res.text();
          alert(`GET /api/todos 失敗: ${res.status}\n${raw}`);
          return;
        }

        const ct = res.headers.get("content-type") ?? "";
        if (!ct.includes("application/json")) {
          const raw = await res.text();
          alert(`JSONじゃないものが返ってます: ${ct}\n${raw}`);
          return;
        }

        const data = (await res.json()) as TodoType[];
        updateTodos(data);
      } catch (e) {
        alert(`loadTodo例外: ${String(e)}`);
      }
    };
    // const loadTodo = async () => {
    //   const res = await fetch("/api/todos");
    //   const data: TodoType[] = await res.json();
    //   updateTodos(data);
    // };
    loadTodo();
  }, []);

  //------ = () =>. イコール、カッコ、イコール＞ --------------//

  //Todo追加部位🤖//

  const addTodo = async () => {
    //asyncで、awaitが使えるようになる。
    if (!text) return alert("Todoを入力してください");
    if (!date) return alert("期日を入力してください");

    // fetch("/api/todos");のみを書いたら、自動的にGETメソッドになる。

    //✅　➡️POSTでDBに送信
    const resBox = await fetch("/api/todos", {
      // fetch レスポンス　オブジェクト //fetchはResponceというオブジェクト。
      // 🟤　fetch("https://google.com")と同じ。🟤. 🟡Responceの匣📦🟡
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, date }),
    });
    //✅　⬅️DBから取り出す

    if (!resBox.ok) {
      alert(`POST /api/todos 失敗: ${resBox.status}\n${await resBox.text()}`);
      return;
    }

    const ct = resBox.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      alert(`JSONじゃないものが返ってます: ${ct}\n${await resBox.text()}`);
      return;
    }

    const saveTodo: TodoType = await resBox.json();

    // const saveTodo: TodoType = await resBox.json();
    //.jsonで、レスポンス本文をjsonで読むボタン🔘.textなら文字列で読むボタン🔘

    // updateTodos([...todos, saveTodo]); //updateTodosに配列を渡している。
    updateTodos((prev) => [...prev, saveTodo]); //✅prevで最新のものを保証してくれるReact機能。
    updateText(""); //🌟updateTextは更新値であった。それを空Text
    updateDate(""); //🌟updateDateは更新値であった。それを空にする。
  };

  //削除ボタン部位🤖
  const deleteTodo = async (id: string) => {
    const del = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    //()内に値を入れると、その値を受け取る機構(アロー関数）となる。
    // filter 条件に残すものだけ残す。

    //🔴消したいtodoのidを受け取り、『そのTodoを除いた配列を再構築することで、
    //実質的な削除ボタン機能としている。

    updateTodos((prev) => prev.filter((t) => t.id !== id));
  }; //✅prevで最新のものを保証。

  //Todo編集ボタン部位🤖
  const editTodoText = async (id: string, currentText: string) => {
    const newText = prompt("Todoを編集", currentText); //入力欄にTodoを表示し、
    if (newText === null) return; //入力されなかったら、更新しない。

    //✅New
    const patch = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });
    updateTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
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
          margin: "0 auto",
          padding: 16,
          border: 5,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
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
              placeholder="例:ABCD"
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
                border: "1px solid black",
                padding: 8,
                listStyle: "none", //リストの・を枠の内側に。
                borderRadius: 4,
              }}
            >
              <span>
                {t.text}（{t.date}）
              </span>

              <span style={{ display: "flex", gap: 8 }}>
                <button onClick={() => editTodoText(t.id, t.text)}>
                  Todo編集
                </button>{" "}
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
