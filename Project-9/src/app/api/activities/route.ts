import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
// import { Prisma } from '@prisma/client';
import { ActivityStatus, ActivityType } from '@prisma/client';

async function getUserId(): Promise<bigint | null> {
  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) return null;
  return BigInt(uid);
}

function toJson(a: any) {
  return {
    id: a.id.toString(),
    userId: a.userId.toString(),
    companyId: a.companyId?.toString() ?? null,
    contactId: a.contactId?.toString() ?? null,
    dealId: a.dealId?.toString() ?? null,
    type: a.type,
    title: a.title,
    description: a.description,
    scheduledAt: a.scheduledAt?.toISOString() ?? null,
    completedAt: a.completedAt?.toISOString() ?? null,
    status: a.status,
    outcome: a.outcome,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

//
// 🔵 GET /api/activities
//
export async function GET() {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const activities = await prisma.activity.findMany({
    where: { userId },
    orderBy: { scheduledAt: 'desc' },
  });

  return NextResponse.json(
    { activities: activities.map(toJson) },
    { status: 200 },
  );
}

//
// 🔵 POST /api/activities
//
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  if (!body.title?.trim()) {
    return NextResponse.json(
      { message: 'タイトルは必須です' },
      { status: 400 },
    );
  }

  if (!body.type) {
    return NextResponse.json({ message: 'タイプは必須です' }, { status: 400 });
  }

  if (!body.status) {
    return NextResponse.json(
      { message: 'ステータスは必須です' },
      { status: 400 },
    );
  }

  const activity = await prisma.activity.create({
    data: {
      user: { connect: { id: userId } },

      company: body.companyId
        ? { connect: { id: BigInt(body.companyId) } }
        : undefined,

      contact: body.contactId
        ? { connect: { id: BigInt(body.contactId) } }
        : undefined,

      deal: body.dealsId
        ? { connect: { id: BigInt(body.dealsId) } }
        : undefined,

      type: body.type as ActivityType,
      title: body.title.trim(),
      description: body.description?.trim() || null,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      completedAt: body.completedAt ? new Date(body.completedAt) : null,
      status: body.status as ActivityStatus,
      outcome: body.outcome?.trim() || null,
    },
  });

  return NextResponse.json({ activity: toJson(activity) }, { status: 201 });
}
