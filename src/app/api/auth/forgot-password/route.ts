import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'E-posta adresi gerekli' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Güvenlik: Kullanıcı bulunamasa bile "Gönderildi" demek iyidir (Enumration saldırısını önler) ama burada şimdilik hata dönüyoruz.
      return NextResponse.json({ error: 'Bu e-posta adresine ait kullanıcı bulunamadı.' }, { status: 404 });
    }

    // Şifre sıfırlama için 15 dakikalık özel bir token üretiyoruz
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `${APP_URL}/sifre-sifirla?token=${resetToken}`;

    // GERÇEK E-POSTA GÖNDERİMİ
    await sendEmail({
      to: user.email,
      subject: 'Şifre Sıfırlama İsteği - Sahiplendirme.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Şifre Sıfırlama</h1>
          </div>
          <div style="padding: 20px;">
            <p>Merhaba <strong>${user.firstName}</strong>,</p>
            <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın. Bu bağlantı 15 dakika geçerlidir.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Şifremi Sıfırla</a>
            </div>
            <p style="font-size: 12px; color: #6b7280; text-align: center;">Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
