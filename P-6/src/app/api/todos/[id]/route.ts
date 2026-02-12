import { prisma } from '@/lib/prisma';

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  await prisma.todo.delete({ where: { id: ctx.params.id } });
  return Response.json({ ok: true });
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const body = await req.json();
  const { text } = body as { text: string };

  const todo = await prisma.todo.update({
    where: { id: ctx.params.id },
    data: { text },
  });

  return Response.json(todo);
}
