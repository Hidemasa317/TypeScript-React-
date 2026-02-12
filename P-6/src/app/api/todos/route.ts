import { prisma } from '@/lib/prisma';

export async function GET() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json(todos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { id, text, date } = body as { id: string; text: string; date: string };

  const todo = await prisma.todo.create({
    data: { id, text, date },
  });

  return Response.json(todo);
}
