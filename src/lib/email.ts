import nodemailer from "nodemailer";
import { formatEURFromCents } from "@/lib/money";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;
  return { host, port, auth: { user, pass } };
}

export async function sendEmail(params: SendEmailParams) {
  const cfg = getSmtpConfig();
  const from = process.env.EMAIL_FROM || "no-reply@localhost";

  // If SMTP isn't configured, do not crash in dev: log to console.
  if (!cfg) {
    console.log("[email:dev] to=", params.to, "subject=", params.subject);
    console.log(params.text ?? params.html);
    return;
  }

  const transporter = nodemailer.createTransport(cfg);
  await transporter.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
}

export function renderOrderEmail(params: {
  title: string;
  orderId: string;
  items: Array<{ name: string; qty: number; lineTotalCents: number }>;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}) {
  const rows = params.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0; color:#ddd;">${escapeHtml(it.name)} × ${it.qty}</td>
        <td style="padding:8px 0; color:#ddd; text-align:right;">${formatEURFromCents(it.lineTotalCents)}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; background:#0b0b0c; color:#d2d2d2; padding:24px;">
    <div style="max-width:640px; margin:0 auto; border:1px solid rgba(255,255,255,0.10); border-radius:16px; overflow:hidden;">
      <div style="padding:18px 20px; background:#151517;">
        <div style="letter-spacing:0.2em; text-transform:uppercase; font-size:12px; color:#aaa;">V2 · ITALY CENTRAL</div>
        <div style="font-size:18px; margin-top:6px; color:#fff;"><strong>${escapeHtml(params.title)}</strong></div>
        <div style="margin-top:6px; font-size:12px; color:#aaa;">Ordine: ${escapeHtml(params.orderId)}</div>
      </div>
      <div style="padding:20px;">
        <table style="width:100%; border-collapse:collapse;">
          ${rows}
          <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.10); padding-top:12px;"></td></tr>
          <tr>
            <td style="padding:6px 0; color:#aaa;">Subtotale</td>
            <td style="padding:6px 0; text-align:right; color:#aaa;">${formatEURFromCents(params.subtotalCents)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#aaa;">Spedizione</td>
            <td style="padding:6px 0; text-align:right; color:#aaa;">${formatEURFromCents(params.shippingCents)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; color:#fff;"><strong>Totale</strong></td>
            <td style="padding:10px 0; text-align:right; color:#fff;"><strong>${formatEURFromCents(params.totalCents)}</strong></td>
          </tr>
        </table>

        <p style="margin-top:18px; font-size:12px; color:#888;">
          Se hai domande rispondi a questa email o scrivi a ${escapeHtml(process.env.EMAIL_SUPPORT ?? "support@yourdomain.it")}.
        </p>
      </div>
    </div>
  </div>`;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
