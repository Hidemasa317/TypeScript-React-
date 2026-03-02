import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { ActivityStatus, ActivityType, Prisma } from '@prisma/client';

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

// 🔵GET /api/activities🔵
export async function GET() {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const deals = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    { activities: deals.map(toActivityJson) },
    { status: 200 },
  );
}

// 🔵POST /api/activities🔵
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

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

  // ✅🆕　タイトル確認を追加した。
  if (!body.title?.trim()) {
    return NextResponse.json(
      { message: 'タイトルは必須です' },
      { status: 400 },
    );
  }

  // ✅🆕 商談確認を追加。
  if (!body.dealId) {
    return NextResponse.json({ message: '商談は必須です' }, { status: 400 });
  }

  if (!body.contactId?.trim()) {
    return NextResponse.json({ message: '連絡先は必須です' }, { status: 400 });
  }

  if (!body.companyId) {
    return NextResponse.json({ message: '会社は必須です' }, { status: 400 });
  }

  // ✅activity.create📦
  const activity = await prisma.activity.create({
    data: {
      user: { connect: { id: userId } }, //🆗
      company: { connect: { id: BigInt(body.companyId) } }, //🆗
      contact: body.contactId
        ? { connect: { id: BigInt(body.contactId) } }
        : undefined,

      deal: body.dealId ? { connect: { id: BigInt(body.dealId) } } : undefined,

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
    { status: 201 },
  );
}
