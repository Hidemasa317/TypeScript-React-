//真偽値を使ったif else ifelse文//

let hako = true;

let hone = true;

if (hako) {
  //trueであったら実行
  console.log('mouryou');
} else if (hone) {
  console.log('tukimono');
} else {
  //falseであったら実行
  console.log('otosizumi');
}

//⚠️重要⚠️elseif は必ず直前がfalseであった時でないと、評価されない。
//つまり、if (hako) と書いただけならば、自動的にtrueならば進行する。と指示していることになる。

// 演算子 //

mouryou = 1 === 1; //二つの値を比べて同じであったらtrue  🌟

mouryou = 1 == 1; //これは数値と文字列で同じ値が入力されてもtrueになってしまうため、推奨されない。

ok = 1 !== 1; //否定 『違かったらTrue』. 🌟
//////////////////////////////////////////////////

const sekiguchi = { name: otoko };
const chuzenji = { name: otoko };
hito = sekiguchi === chuzenji;
console.log(hito); /////⚠️この時はfalseとなる。
////////////////////////////////////////////////////
const sekiguchi = { name: otoko };
const chuzenji = { name: otoko };
const kubo = sekiguchi;
hito = sekiguchi === kubo;
console.log(hito); /////⚠️この時はtrueとなる。⭕️
