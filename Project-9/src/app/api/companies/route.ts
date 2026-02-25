import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

function toCompanyJson(c: any) {
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

// GET /api/companies
export async function GET() {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const companies = await prisma.company.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    { companies: companies.map(toCompanyJson) },
    { status: 200 },
  );
}

// POST /api/companies
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as {
    name?: string;
    industry?: string;
    address?: string;
    phone?: string;
    website?: string;
    note?: string;
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ message: '会社名は必須です' }, { status: 400 });
  }

  const company = await prisma.company.create({
    data: {
      // userId直入れで型エラーが出る環境があるので、connect方式（確実）
      user: { connect: { id: userId } },
      name: body.name.trim(),
      industry: body.industry?.trim() || null,
      address: body.address?.trim() || null,
      phone: body.phone?.trim() || null,
      website: body.website?.trim() || null,
      note: body.note?.trim() || null,
    },
  });

  return NextResponse.json(
    { company: toCompanyJson(company) },
    { status: 201 },
  );
}
