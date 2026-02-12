'use client';

import { useEffect, useState } from 'react';

// Todoの型定義（TypeScript）
type TodoItem = {
  id: string;
  text: string;
  date: string;
};

export default function Todo() {
  //------------------関数Todo定義------------------//

  //------🔹stateは『その状態』という概念、である。ひとまず概念を構築。
  //------🔹useStateは2つを返すので、[現在の値, 更新する値]の順で書く。🌟

  //🔹①関数内で必要なパーツとして定数を定義し、機能を代入。
  //🔹②JSX内の各部位内で定数要素を呼び出して、機能として具現化する。

  const [todos, updateTodos] = useState<TodoItem[]>([]); //配列と更新値を取得。
  const [text, updateText] = useState(''); //テキスト(todoへの入力値)と、更新値を取得。
  const [date, updateDate] = useState(''); //dateと更新値を取得。

  // 初回マウント時にDBからTodo取得
  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch('/api/todos');
      const data = await res.json();
      updateTodos(data);
    };

    fetchTodos();
  }, []);

  //------ = () =>. イコール、カッコ、イコール＞ --------------//

  //Todo追加部位🤖//

  const addTodo = async () => {
    //アロー関数、関数内の内容を、定数or変数に代入。
    if (!text) return alert('Todoを入力してください'); //アラート
    if (!date) return alert('期日を入力してください'); //アラート

    const newTodo = {
      id: crypto.randomUUID(),
      text,
      date,
    };

    // DBへ保存
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });

    const savedTodo = await res.json();

    updateTodos([savedTodo, ...todos]);
    updateText('');
    updateDate('');
  };

  //削除ボタン部位🤖
  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    updateTodos(todos.filter((t) => t.id !== id));
  };

  const editTodoText = async (id: string, currentText: string) => {
    const newText = prompt('Todoを編集', currentText);
    if (newText === null) return;

    await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    });

    updateTodos(todos.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  //-------------JSX ⬇️ -----------------//

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 16,
      }}
    >
      <h1>Todo Maker</h1>

      <div style={{ display: 'flex', gap: 8 }}>
        <label>
          Todo :
          <input
            value={text}
            onChange={(e) => updateText(e.target.value)}
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

      <ul style={{ marginTop: 20 }}>
        {todos.map((t) => (
          <li
            key={t.id}
            style={{
              marginBottom: 12,
              border: '1px solid black',
              padding: 8,
              borderRadius: 4,
              listStyle: 'none',
            }}
          >
            <span>
              {t.text}（{t.date}）
            </span>

            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button onClick={() => editTodoText(t.id, t.text)}>
                Todo編集
              </button>

              <button onClick={() => deleteTodo(t.id)}>削除</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
