import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

function toContactJson(c: any) {
  return {
    ...c,
    id: c.id.toString(),
    userId: c.userId.toString(),
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

// GET /api/contacts
export async function GET() {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    { contacts: contacts.map(toContactJson) },
    { status: 200 },
  );
}

// POST /api/contacts
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as {
    //  firstName String
    // // lastName String
    // // position String?
    // //email String?
    // // phone String?
    // mobile String?
    // / note String?
    companyId?: string; //✅🚨追加忘れ。
    firstName?: string;
    lastName?: string;
    position?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    note?: string;
  };

  if (!body.lastName?.trim()) {
    return NextResponse.json({ message: '姓は必須です' }, { status: 400 });
  }

  if (!body.firstName?.trim()) {
    return NextResponse.json({ message: '名は必須です' }, { status: 400 });
  }

  if (!body.companyId) {
    return NextResponse.json({ message: '会社は必須です' }, { status: 400 });
  }

  const contact = await prisma.contact.create({
    data: {
      user: { connect: { id: userId } },
      company: { connect: { id: BigInt(body.companyId) } },
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      position: body.position?.trim() || null,
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      mobile: body.mobile?.trim() || null,
      note: body.note?.trim() || null,
    },
  });

  // const contact = await prisma.contact.create({
  //   data: {
  //     // userId直入れで型エラーが出る環境があるので、connect方式（確実）
  //     user: { connect: { id: userId } },
  //     company: { connect: { id: BigInt(body.companyId) } },
  //     firstName: body.firstName?.trim() || '',
  //     lastName: body.lastName?.trim() || '',
  //     position: body.position?.trim() || null,
  //     email: body.email?.trim() || null,
  //     phone: body.phone?.trim() || null,
  //     mobile: body.mobile?.trim() || null,
  //     note: body.note?.trim() || null,
  //   },
  // });

  return NextResponse.json(
    { contact: toContactJson(contact) },
    { status: 201 },
  );
}
