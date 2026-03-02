import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { ActivityStatus } from '@prisma/client';
import { ActivityType } from '@prisma/client';
//----✅活動、保存、削除処理　api

function toActivityJson(activity: any) {
  return {
    companyId: activity.companyId?.toString(),
    contactId: activity.contactId?.toString() ?? '',
    dealId: activity.dealId?.toString() ?? '',
    type: activity.type,
    title: activity.title ?? '',
    description: activity.description ?? '',
    scheduledAt: activity.scheduledAt
      ? activity.scheduledAt.toISOString().slice(0, 10)
      : '',
    completedAt: activity.completedAt
      ? activity.completedAt.toISOString().slice(0, 10)
      : '',
    status: activity.status,
    outcome: activity.outcome ?? '',
  };
}

async function getUserId(): Promise<bigint | null> {
  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) return null;
  return BigInt(uid);
}

// 🔵PUT /api/activities/:id🔵
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;

  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = BigInt(idParam);

  const body = (await req.json()) as {
    companyId?: string; //✅🚨追加忘れ。
    contactId?: string;
    dealId?: string;

    type?: string;
    title?: string;
    description?: string;
    scheduledAt?: string;
    completedAt?: string;
    status?: string;
    outcome?: string;
    note?: string;
  };

  // ✅🆕
  if (!body.contactId?.trim()) {
    return NextResponse.json({ message: '連絡先は必須です' }, { status: 400 });
  }

  if (!body.companyId) {
    return NextResponse.json({ message: '会社は必須です' }, { status: 400 });
  }

  if (!body.dealId) {
    return NextResponse.json({ message: '商談は必須です' }, { status: 400 });
  }

  const existing = await prisma.activity.findFirst({
    where: { id, userId },
  });
  if (!existing)
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });

  const activity = await prisma.activity.update({
    where: { id },
    data: {
      company: { connect: { id: BigInt(body.companyId) } },

      contact: body.contactId
        ? { connect: { id: BigInt(body.contactId) } }
        : { disconnect: true },

      deal: body.dealId
        ? { connect: { id: BigInt(body.dealId) } }
        : { disconnect: true },

      type: body.type as ActivityType,
      title: body.title?.trim() ?? '',
      description: body.description?.trim() || null,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      completedAt: body.completedAt ? new Date(body.completedAt) : null,
      status: body.status as ActivityStatus,
      outcome: body.outcome?.trim() || null,
    },
  });
  return NextResponse.json(
    { activity: toActivityJson(activity) },
    { status: 200 },
  );
}

// 🔵DELETE /api/activities/:id🔵
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;

  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = BigInt(idParam);

  const existing = await prisma.activity.findFirst({
    where: { id, userId },
  });
  if (!existing)
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });

  await prisma.activity.delete({ where: { id } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
