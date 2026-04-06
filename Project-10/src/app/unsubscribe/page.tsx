import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

// /unsubscribe?t=<trackingId>
// メール本文の「配信停止はこちら」リンクからアクセス
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t: trackingId } = await searchParams;

  if (!trackingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
          <p className="text-red-600">無効なリンクです。</p>
        </div>
      </div>
    );
  }

  // trackingIdからContactを特定
  const send = await prisma.campaignSend.findUnique({
    where: { trackingId },
    include: { contact: true },
  });

  if (!send) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
          <p className="text-red-600">無効なリンクです。</p>
        </div>
      </div>
    );
  }

  // 配信停止処理
  await prisma.$transaction([
    prisma.contact.update({
      where: { id: send.contactId },
      data: { status: 'unsubscribed' },
    }),
    prisma.unsubscribeRecord.upsert({
      where: { contactId: send.contactId },
      update: {},
      create: { contactId: send.contactId },
    }),
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-bold mb-3">配信停止が完了しました</h1>
        <p className="text-gray-600 text-sm">
          <strong>{send.contact.email}</strong> への配信を停止しました。
        </p>
        <p className="text-gray-400 text-xs mt-4">
          今後このメールアドレスへの配信は行われません。
        </p>
      </div>
    </div>
  );
}
