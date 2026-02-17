import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const todos = await prisma.todo.findMany({
    where: { isDeleted: false },
  });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const { text, date } = await req.json();
  const created = await prisma.todo.create({
    data: { text, date },
  });
  return NextResponse.json(created);
}
