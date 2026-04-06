import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/templates/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;
  const template = await prisma.emailTemplate.findFirst({
    where: { id: BigInt(id), userId },
  });

  if (!template) return NextResponse.json({ error: '見つかりません' }, { status: 404 });

  return NextResponse.json({ ...template, id: template.id.toString(), userId: template.userId.toString() });
}

// PUT /api/templates/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  const template = await prisma.emailTemplate.updateMany({
    where: { id: BigInt(id), userId },
    data: {
      name: data.name,
      subject: data.subject,
      bodyHtml: data.bodyHtml,
      bodyText: data.bodyText,
      description: data.description,
    },
  });

  if (template.count === 0) return NextResponse.json({ error: '更新できませんでした' }, { status: 404 });

  return NextResponse.json({ ok: true });
}

// DELETE /api/templates/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { id } = await params;

  await prisma.emailTemplate.deleteMany({
    where: { id: BigInt(id), userId },
  });

  return NextResponse.json({ ok: true });
}
