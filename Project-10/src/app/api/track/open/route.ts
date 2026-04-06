import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/track/open?t=<trackingId>
// HTMLメールに埋め込まれた1x1ピクセル画像で開封を検知
export async function GET(req: NextRequest) {
  const trackingId = req.nextUrl.searchParams.get('t');

  if (trackingId) {
    // 初回開封のみ記録（openedAt が null のものだけ更新）
    await prisma.campaignSend.updateMany({
      where: { trackingId, openedAt: null },
      data: { openedAt: new Date(), status: 'opened' },
    });
  }

  // 1x1 透明GIFを返す
  const gif = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );

  return new NextResponse(gif, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
