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

//
// 🔵 PUT /api/activities/:id
//
export async function PUT(req: Request, context: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = BigInt(context.params.id);
  const body = await req.json();

  const existing = await prisma.activity.findFirst({
    where: { id, userId },
  });

  if (!existing)
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });

  const activity = await prisma.activity.update({
    where: { id },
    data: {
      company: body.companyId
        ? { connect: { id: BigInt(body.companyId) } }
        : { disconnect: true },

      contact: body.contactId
        ? { connect: { id: BigInt(body.contactId) } }
        : { disconnect: true },

      deal: body.dealsId
        ? { connect: { id: BigInt(body.dealsId) } }
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

  return NextResponse.json({ activity }, { status: 200 });
}

//
// 🔵 DELETE /api/activities/:id
//
export async function DELETE(_: Request, context: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = BigInt(context.params.id);

  const existing = await prisma.activity.findFirst({
    where: { id, userId },
  });

  if (!existing)
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });

  await prisma.activity.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
