import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

async function getAdminFromRequest(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value || req.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'admin')) return null;
    return payload;
  } catch {
    return null;
  }
}

// POST /api/admin/settings/test-mail
export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const { toEmail } = await req.json();

    const settings = await db.siteSetting.findUnique({ where: { id: 'singleton' } });
    if (!settings?.smtpHost || !settings?.smtpUser) {
      return NextResponse.json({ error: 'SMTP ayarları henüz yapılandırılmamış.' }, { status: 400 });
    }

    // nodemailer ile test maili gönder
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpSecure,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"${settings.smtpFromName}" <${settings.smtpFromEmail}>`,
      to: toEmail,
      subject: `${settings.siteName} - Test Maili`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2>✅ SMTP Bağlantısı Başarılı!</h2>
          <p>Bu e-posta, <strong>${settings.siteName}</strong> admin panelinden gönderilmiştir.</p>
          <p>Mail sunucusu (<strong>${settings.smtpHost}:${settings.smtpPort}</strong>) düzgün çalışmaktadır.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="color:#999;font-size:12px;">Bu otomatik bir test mailidir.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: `Test maili ${toEmail} adresine başarıyla gönderildi.` });
  } catch (error: any) {
    console.error('Test mail error:', error);
    return NextResponse.json({ error: `Mail gönderilemedi: ${error.message}` }, { status: 500 });
  }
}
