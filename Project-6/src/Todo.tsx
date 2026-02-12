import { useState } from 'react';

export function Todo2() {


  const [todos, updateTodos] = useState([]); //配列と更新値を取得。
  const [text, updateText] = useState(''); //テキスト(todoへの入力値)と、更新値を取得。
  const [date, updateDate] = useState('');


  //Todo追加部🤖

  const addTodos = () => {

    const newTodo = {
      id: crypto.randomUUID(), 
      text, 
      date, 
    };
  }


  //Todo削除部🤖

  //Todo編集部🤖

  return (


    <>

    <h1> Todo Maker Tsx </h1>
    
    
    
    </>




  );



}
