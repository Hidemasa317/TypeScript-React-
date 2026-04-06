import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/templates - テンプレート一覧
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const templates = await prisma.emailTemplate.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, subject: true, description: true, createdAt: true },
  });

  return NextResponse.json(
    templates.map((t) => ({ ...t, id: t.id.toString() }))
  );
}

// POST /api/templates - テンプレート作成
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { name, subject, bodyHtml, bodyText, description } = await req.json();

  if (!name || !subject || !bodyHtml) {
    return NextResponse.json({ error: 'name, subject, bodyHtml は必須です' }, { status: 400 });
  }

  const template = await prisma.emailTemplate.create({
    data: { userId, name, subject, bodyHtml, bodyText, description },
  });

  return NextResponse.json({ ...template, id: template.id.toString(), userId: template.userId.toString() }, { status: 201 });
}
