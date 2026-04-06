import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/contacts
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      company: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json(contacts.map((c) => ({ ...c, id: c.id.toString() })));
}

// POST /api/contacts - 連絡先作成（オプションでリストに追加）
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { email, firstName, lastName, company, listId } = await req.json();

  if (!email) return NextResponse.json({ error: 'email は必須です' }, { status: 400 });

  // upsert: 既存のメールアドレスなら更新
  const contact = await prisma.contact.upsert({
    where: { email },
    update: { firstName, lastName, company },
    create: { email, firstName, lastName, company },
  });

  // リストIDが指定されていればメンバーシップを作成
  if (listId) {
    await prisma.contactListMembership.upsert({
      where: {
        contactId_contactListId: {
          contactId: contact.id,
          contactListId: BigInt(listId),
        },
      },
      update: {},
      create: { contactId: contact.id, contactListId: BigInt(listId) },
    });
  }

  return NextResponse.json({ ...contact, id: contact.id.toString() }, { status: 201 });
}
