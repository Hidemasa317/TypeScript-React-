import { useState } from 'react';

export default function Time() {
  const [time, printTime] = useState(0);

  const showTime = () => {
    printTime(Date.now());
  };

  return (
    <>
      <h1> NOW TIME BOARD </h1>
      <p> 現在の時刻 : {time} </p>

      <button onClick={showTime}> 現在時刻を表示する。 </button>

      {/* <button onClick={printTime}> 現在時刻を表示する。 </button> */}
    </>
  );
}
