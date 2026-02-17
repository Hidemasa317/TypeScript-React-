import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.todo.update({
    where: { id: params.id },
    data: { isDeleted: true },
  });
  return NextResponse.json({ message: "deleted" });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { text } = await req.json();
  const updated = await prisma.todo.update({
    where: { id: params.id },
    data: { text },
  });
  return NextResponse.json(updated);
}
