let tomatoCount7;
let トマトカウント;
let additionResult = 2 + 5;
let result = 5;
//www.udemy.com/course/javascript-complete/learn/lecture/32337054#overview
https: result = result + 1;

result += 1; //これはresult + 1と同じ意味合いになる。

result++; //これはresult = result + 1と同じ意味合いになる。
++result; //これはresult = result + 1と同じ意味合いになる。

console.log(++result); // 先に++なら8。result++ならば7になる。

result--; //これはresult = result - 1と同じ意味合いになる。

//result
//++ と書いた場合、result++と認識されず、一旦result;と自動で変換・認識される。

// 変な改行は使わない。できる限り+=1;を使用する。
let nember = 10;
nember = -4;
number = 32.42; //小数点はフロートと呼ばれる。

//let string = 'Hello, World!';  //動的、dinamic 静的、static

let string = 'Hello' + 'koji';

const userName = 'nyako';
string = `string ${userName}`; //Jsを埋め込むことができる。

string = "'``"; //実際の文字列の中にクオートを入れたい場合は、入れたいクオート以外のクオートで囲うことで可能。

string = ' \!`'; //というように、珍しい文字列を入れたい場合は、バックスラッシュをその文字列の前に入れる。
// バッククオートのみ様々な機能がある。　シングルクオーとの方が良いであろう。

const userInput = '10'; //文字列の10。

calcResult = Number(userInput) + 10; //文字列の10を、数値に変換してから、2を足す。
calcResult = parseInt(userInput) + 10; //これも同様に変換される。

calcResult = parseFloat(userInput) + 10;
calcResult = +userInput + 10; //このように＋っを定数の前につけただけでも、数値に変換される。

//userInputが10.9などであった場合、parseIclntのみ、小数点が出ずに、20と表示される。

const tenNumber = 10;

calcResult = '10' + String(tenNumber); //数値の10を文字列に変換してから、連結する。
calcResult = '10' + tenNumber.toString(); //これも同様に変換される。

let boolean = true; //booleanば真偽値である。
boolean = false; //trueかfalseのどちらかしか入らない。

let array = ['koji', 'nyaa', 'piyo'];
console.log(array[0]); //配列の1番目の要素を取得。 0スタートである。

array = []; //一旦配列内を空に。
array.push('koji'); //配列に要素を追加。
console.log(array); //配列を出力。

////////////////オブジェクト//////////////////////

const coffee = {
  name: 'Chocokate Mocha',
  size: 350, //このキーと値二つで、プロパティと呼ばれる。
  isHot: true, //プロパティ名はキャメルケースで書くのが一般的。
  toppings: ['Cinnamon', 'Caramel'],
  nutritions: {
    calaries: 430,
    sugars: 53, //optionn⬆️で順番を移動おできる。
  },
};
console.log(coffee.size); //オブジェクトのプロパティを取得する方法。オブジェクト内の、sizeプロパティを取得。

coffee.isHot = false; //オブジェクトのプロパティを変更。

coffee.barista = 'enokizu';

let userInfo = null; //nullがundifinedの二つの種類が存在する。
userInfo = undefined; //null➡️[予定通り何もない。]　undifined➡️何かが未定義である。

////// typeof演算子//////////

typeof 3; //'number'と表示される。
typeof true; //'boolean'と表示される。
typeof { name: 'hide' }; //'object'と表示される。
tyoeif[(1, 2, 3)]; //'object'と表示される。配列もオブジェクトの一種であるため。
typeof undefined; //'undifined'と表示される。
typeof null; //'object'と表示される。

/////////////////関数の宣言//////////////////////

function add() {
  console.log(1 + 1);
} //関数の宣言。
add();
add(); //何回も呼び出し可能。

///////////////汎用的な関数の利用例）

const newValue = 'hello';

function add(num1, num2) {
  //numの事を、仮引数。パラメータと呼ぶ。
  console.log(num1 + num2);
  return num1 + num2; //関数の戻り値。これより下の処理は無視される。（addの値に飛ばされる。）
  return; //何も返さない場合。undifinedが返されるだけだが、使われる事はある。
}
const returnedValue = add(2, 3); //5と表示される。returnで返された値が、returnedValueに代入される。

//.             add(2, 3); //5と表示される。numに値を代入している。この値を引数である。

//関数とオブジェクトは全くの別物。
//関数は定義を後に記述しても、エンジンで読み込まれる際に巻き上げられるため、問題なく動作する。

//🌟関数の中で定義された変数や定数を定義した場合、、その変数や定数は関数の外からは参照できない。
//🌟関数の外で定義された変数や定数は、関数の中から参照できる。

document.addEventListener('DOMContentLoaded', () => {
  console.log('HTMLが読み込まれました！'); // ボタンとタイトル要素を取得

  const button = document.getElementById('change-text'); // ボタン要素を取得
  const title = document.getElementById('title'); // ボタンがクリックされたときにタイトルを変更

  button.addEventListener('click', () => {
    title.textContent = '文字が変更されました！';
  });
});
