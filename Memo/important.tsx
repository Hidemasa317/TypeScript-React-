//プリミティブ型
//string型、　number型、bigint型、boolean型、undefined型、null型、symbol型（一意で普遍の型）

//オブジェクト
const person = {
  name: '榎木津', //プロパティ
  age: 30, //プロパティ　　　　　　　　　　　　　　　　　{}内はオブジェクトリテラル
  gender: 'man', //プロパティ
};

console.log(person.name); //プロパティアクセス

//スプレッド構文　　...fruit 等々

const fruit = {
  apple: 100,
  orange: 200,
};

const food = {
  rice: 300,
  ...fruit, //定数 fruit の内容をそのオブジェクトからコピーして来られる。
};

console.log(food);

//型エイリアス.   type と　interface（オブジェクトのみ）の2種類

type Score = {
  // type 型名　で、型に名前をつけている。
  math: number;
  science: number;
};

const test: Score = {
  //math.scienceの型が何を表すのか明確になり、可読性が向上する。
  math: 70,
  science: 80,
};
console.log(test);

//関数型

//type 型名　= (引数名:引数型) => 戻り値の型; 型名を命名。
type add = (num1: number, num2: number) => number;

//定数resultに、addという先ほどの型名を指定。num1 + num2 をresultに割り当て。
const result: add = (num1, num2) => num1 + num2;

console.log(result(1, 1));

//ジェネリスク型

//通常版　文字列と数値の関数を別々に定義。
// function getArrayString(items: string[]): string[] {
//     return new Array().concat(items);
// }

// function getArrayNumber(items: number[]): number[] {
//     return new Array().concat(items);
// }

// let stringArray = getArrayString(["apple", "banana"]);
// let numberArray = getArrayNumber([1, 2, 3]);

//ジェネリスク版

function getArray<T>(items: T[]): T[] {
  return new Array().concat(items);
}

let stringArray = getArray(['apple', 'banana']); // string型の配列
let numberArray = getArray([1, 2, 3]); // number型の配列

//Prisma関連

//①migaration.sql DBの変更履歴
//②SQLファイルの作成　dev.db これが実際のデータ保存ファイル
//DBにTodoテーブルが作成された。

// ✅2・１８
//✅🤖api通信部
// これは　async関数である。『必ず、後で❤️Promiseを返す』

// Jsでは通信、通信、。。の繰り返しなので、awaitでPromise（処理結果）が入るのを一旦待って、通信できる。

async function apiConnect(zipcode: string): Promise<string> {
  const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${encodeURIComponent(zipcode)}`;
  const res = await fetch(url);
  const data = await res.json(); //✅Jsonで受け取る。

  const result = data.results[0]; //✅配列の一件目取得
  return `${result.address1}${result.address2}${result.address3}`; //✅結合して返す。
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getUserId(): Promise<bigint | null> {
  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) return null;
  return BigInt(uid);
}

// PUT（編集）

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = BigInt(idParam);

  const existing = await prisma.company.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  }

  const body = await req.json();

  const updated = await prisma.company.update({
    where: { id },
    data: {
      name: body.name,
      industry: body.industry,
      phone: body.phone,
      address: body.address,
      website: body.website,
      note: body.note,
    },
  });

  return NextResponse.json(updated);
}

// DELETE（削除）
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = BigInt(idParam);

  const existing = await prisma.company.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  }

  await prisma.company.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
