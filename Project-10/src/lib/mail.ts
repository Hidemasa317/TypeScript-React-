import nodemailer from 'nodemailer';

// Nodemailerトランスポートの設定
// 開発: MailHog (docker-compose で起動) → http://localhost:8025 で確認
// 本番: .env の SMTP_* を本番SMTPに変更
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: process.env.SMTP_SECURE === 'true', // TLS
    auth:
      process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });
}

// メール送信オプション型
export type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

// メールを1通送信
export async function sendMail(options: SendMailOptions) {
  const transporter = createTransport();

  const info = await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME ?? 'Email Delivery App'}" <${
      process.env.MAIL_FROM_ADDRESS ?? 'noreply@example.com'
    }>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  return info;
}

// ===== テンプレート変数の置換 =====
// 例: "こんにちは、{{firstName}}さん" → "こんにちは、田中さん"
export function renderTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? '');
}

// ===== 配信停止リンクの生成 =====
export function buildUnsubscribeUrl(trackingId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `${base}/unsubscribe?t=${trackingId}`;
}

// ===== 開封トラッキングピクセルURLの生成 =====
export function buildTrackingPixelUrl(trackingId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `${base}/api/track/open?t=${trackingId}`;
}

// ===== HTMLメールにトラッキング要素を埋め込む =====
export function injectTracking(html: string, trackingId: string): string {
  const pixelUrl = buildTrackingPixelUrl(trackingId);
  const unsubscribeUrl = buildUnsubscribeUrl(trackingId);

  // 開封追跡ピクセル（1x1 透明GIF）
  const trackingPixel = `<img src="${pixelUrl}" width="1" height="1" style="display:none" alt="" />`;

  // 配信停止リンクをフッターに追加
  const footer = `
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center;">
      <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">配信停止はこちら</a>
    </div>
  `;

  // bodyタグの直前にピクセルとフッターを挿入
  if (html.includes('</body>')) {
    return html.replace('</body>', `${trackingPixel}${footer}</body>`);
  }
  return html + trackingPixel + footer;
}
