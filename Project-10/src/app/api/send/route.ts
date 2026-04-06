import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';
import { sendMail, renderTemplate, injectTracking } from '@/lib/mail';

// POST /api/send - キャンペーンのメール送信を実行
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { campaignId } = await req.json();
  if (!campaignId) return NextResponse.json({ error: 'campaignId は必須です' }, { status: 400 });

  // キャンペーンを取得（送信者本人のものだけ）
  const campaign = await prisma.campaign.findFirst({
    where: { id: BigInt(campaignId), userId },
    include: {
      template: true,
      contactList: {
        include: {
          memberships: {
            include: { contact: true },
          },
        },
      },
    },
  });

  if (!campaign) return NextResponse.json({ error: 'キャンペーンが見つかりません' }, { status: 404 });
  if (campaign.status === 'sent') return NextResponse.json({ error: '既に送信済みです' }, { status: 400 });

  // ステータスを「送信中」に変更
  await prisma.campaign.update({
    where: { id: campaign.id },
    data: { status: 'sending' },
  });

  const contacts = campaign.contactList.memberships.map((m) => m.contact);
  // 配信停止・バウンスの連絡先は除外
  const activeContacts = contacts.filter((c) => c.status === 'active');

  let sentCount = 0;
  let failCount = 0;

  for (const contact of activeContacts) {
    // CampaignSendレコードを作成または取得（重複送信防止）
    const send = await prisma.campaignSend.upsert({
      where: { campaignId_contactId: { campaignId: campaign.id, contactId: contact.id } },
      update: {},
      create: { campaignId: campaign.id, contactId: contact.id, status: 'pending' },
    });

    // テンプレート変数を置換
    const variables: Record<string, string> = {
      firstName: contact.firstName ?? '',
      lastName: contact.lastName ?? '',
      email: contact.email,
      company: contact.company ?? '',
    };

    const subject = renderTemplate(campaign.template.subject, variables);
    let html = renderTemplate(campaign.template.bodyHtml, variables);
    const text = campaign.template.bodyText
      ? renderTemplate(campaign.template.bodyText, variables)
      : undefined;

    // トラッキングピクセル・配信停止リンクを埋め込む
    html = injectTracking(html, send.trackingId);

    try {
      await sendMail({ to: contact.email, subject, html, text });

      await prisma.campaignSend.update({
        where: { id: send.id },
        data: { status: 'sent', sentAt: new Date() },
      });

      sentCount++;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      await prisma.campaignSend.update({
        where: { id: send.id },
        data: { status: 'failed', errorMessage },
      });
      failCount++;
    }
  }

  // キャンペーンを「送信完了」に更新
  await prisma.campaign.update({
    where: { id: campaign.id },
    data: { status: 'sent', sentAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    sentCount,
    failCount,
    total: activeContacts.length,
  });
}
