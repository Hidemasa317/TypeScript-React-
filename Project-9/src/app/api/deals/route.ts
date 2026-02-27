import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { Prisma } from '@prisma/client';

function toDealJson(c: any) {
  return {
    id: c.id.toString(),
    userId: c.userId.toString(),
    companyId: c.companyId.toString(), //✅🚨　BigIntをstingに変換。
    contactId: c.contactId?.toString() ?? null,
    title: c.title,
    amount: c.amount ? c.amount.toString() : null,
    status: c.status,
    expectedClosingDate: c.expectedClosingDate
      ? c.expectedClosingDate.toISOString()
      : null,
    probability: c.probability,
    description: c.description,
    note: c.note,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

async function getUserId(): Promise<bigint | null> {
  const store = await cookies();
  const uid = store.get('uid')?.value;
  if (!uid) return null;
  return BigInt(uid);
}

// 🔵GET /api/deals🔵
export async function GET() {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const deals = await prisma.deal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ deals: deals.map(toDealJson) }, { status: 200 });
}

// 🔵POST /api/deals🔵
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as {
    companyId?: string; //✅🚨追加忘れ。
    contactId?: string;
    title?: string;
    amount?: string;
    status?: string;
    expectedClosingDate?: string;
    probability?: string;
    description?: string;
    note?: string;
  };

  // ✅🆕　タイトル確認を追加した。
  if (!body.title?.trim()) {
    return NextResponse.json(
      { message: 'タイトルは必須です' },
      { status: 400 },
    );
  }

  if (!body.contactId?.trim()) {
    return NextResponse.json({ message: '連絡先は必須です' }, { status: 400 });
  }

  if (!body.companyId) {
    return NextResponse.json({ message: '会社は必須です' }, { status: 400 });
  }

  // ✅deal.create📦
  const deal = await prisma.deal.create({
    data: {
      user: { connect: { id: userId } }, //🆗
      company: { connect: { id: BigInt(body.companyId) } }, //🆗
      contact: body.contactId
        ? { connect: { id: BigInt(body.contactId) } }
        : undefined,
      title: body.title?.trim() ?? '', //🆗
      // Decimalは、　Number(), か、 new Prisma.Decimal()　に変換　🆗
      amount:
        body.amount && body.amount.trim() !== ''
          ? new Prisma.Decimal(body.amount)
          : null,
      status: body.status as any, //enum 🆗
      expectedClosingDate:
        body.expectedClosingDate && body.expectedClosingDate.trim() !== ''
          ? new Date(body.expectedClosingDate)
          : null,
      probability: body.probability ? Number(body.probability) : null,
      description: body.description?.trim() || null,
      note: body.note?.trim() || null,
    },
  });

  return NextResponse.json({ deal: toDealJson(deal) }, { status: 201 });
}
