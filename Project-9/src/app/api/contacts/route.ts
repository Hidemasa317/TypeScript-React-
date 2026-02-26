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
    { companies: contacts.map(toContactJson) },
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
    firstname?: string;
    lastname?: string;
    position?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    note?: string;
  };

  if (!body.lastname?.trim()) {
    return NextResponse.json({ message: '姓は必須です' }, { status: 400 });
  }

  const company = await prisma.contact.create({
    data: {
      // userId直入れで型エラーが出る環境があるので、connect方式（確実）
      user: { connect: { id: userId } },
      firstname: body.firstname.trim(),
      lastname: body.lastname?.trim() || '',
      position: body.position?.trim() || null,
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      mobile: body.mobile?.trim() || null,
      note: body.note?.trim() || null,
    },
  });

  return NextResponse.json(
    { company: toContactJson(company) },
    { status: 201 },
  );
}
