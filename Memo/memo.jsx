import { useState } from 'react';

export default function Todo() {
  //-----------------⬇️関数Todoの定義⬇️----------------//

  //①関数内で必要なパーツとして定数を定義し、機能を代入。
  //②JSX内の各部位内で定数要素を呼び出して、機能として具現化する。

  const [todos, setTodos] = useState([]); //配列　📦
  const [text, setText] = useState('');
  const [date, setDate] = useState('');

  const addTodo = () => {
    if (!text) return alert('Todoを入力してください'); //テキストが無いときの表示
    if (!date) return alert('期日を入力してください'); //期日が無いときの表示

    const newTodo = {
      id: crypto.randomUUID(), //
      text,
      date,
    };

    setTodos([...todos, newTodo]);
    setText('');
    setDate('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const editTodoText = (id, currentText) => {
    const newText = prompt('Todoを編集', currentText);
    if (newText === null) return;

    setTodos(todos.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  ///JSX部分⬇️
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <h1>Todoリスト</h1>

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <label>
          Todo:{' '}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="例：買い物"
          />
        </label>

        <label>
          期日:{' '}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <button onClick={addTodo}>追加</button>
      </div>

      <ul
        style={{
          marginTop: 16,
          border: '1px solid black',
          padding: 8,
          listStyle: 'none',
          borderRadius: 4,
        }}
      >
        {todos.map((t) => (
          <li
            key={t.id}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid #ddd',
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
        {todos.length === 0 && (
          <li style={{ color: '#666' }}>まだTodoはありません</li>
        )}
      </ul>
    </div>
  );
}

// ✅　website要素部分🤖
<td className="px-5 py-4">
  {c.website ? (
    <a href={c.website} target="_blank" className="text-indigo-600">
      {c.website}
    </a>
  ) : (
    '-'
  )}
</td>;
