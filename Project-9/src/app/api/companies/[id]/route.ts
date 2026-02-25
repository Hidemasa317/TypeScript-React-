import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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
  const uid = store.get("uid")?.value;
  if (!uid) return null;
  return BigInt(uid);
}

type Params = { params: { id: string } };

// PUT /api/companies/:id
export async function PUT(req: Request, { params }: Params) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const id = BigInt(params.id);

  const body = (await req.json()) as {
    name?: string;
    industry?: string;
    address?: string;
    phone?: string;
    website?: string;
    note?: string;
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ message: "会社名は必須です" }, { status: 400 });
  }

  // 自分のデータだけ更新（要件のアクセス制御）
  const existing = await prisma.company.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ message: "Not Found" }, { status: 404 });

  const company = await prisma.company.update({
    where: { id },
    data: {
      name: body.name.trim(),
      industry: body.industry?.trim() || null,
      address: body.address?.trim() || null,
      phone: body.phone?.trim() || null,
      website: body.website?.trim() || null,
      note: body.note?.trim() || null,
    },
  });

  return NextResponse.json({ company: toCompanyJson(company) }, { status: 200 });
}

// DELETE /api/companies/:id
export async function DELETE(_: Request, { params }: Params) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const id = BigInt(params.id);

  const existing = await prisma.company.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ message: "Not Found" }, { status: 404 });

  await prisma.company.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}