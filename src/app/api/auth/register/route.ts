import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, phone, city, accountType } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Gerekli alanları doldurun' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanılıyor' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const finalAccountType = accountType === 'profesyonel' ? 'bireysel' : (accountType || 'bireysel');
    const initialStatus = finalAccountType === 'barinak' ? 'pending' : 'active';

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        city,
        accountType: finalAccountType,
        status: initialStatus
      },
    });

    const authToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'super-secret-sahiplendirme-key',
      { expiresIn: '7d' }
    );

    // Hoşgeldin E-postası
    // Hata verse bile kullanıcı kaydını engellemesin diye fire-and-forget yapıyoruz (await yok).
    import('@/lib/email').then(({ sendEmail }) => {
      sendEmail({
        to: user.email,
        subject: "Sahiplendirme.com'a Hoş Geldiniz! 🐾",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f97316; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Hoş Geldiniz!</h1>
            </div>
            <div style="padding: 20px;">
              <p>Merhaba <strong>${user.firstName}</strong>,</p>
              <p>Türkiye'nin en büyük can dostu platformu Sahiplendirme.com'a hoş geldiniz!</p>
              <p>Platformumuzda can dostlarımızı sahiplenebilir, ilan verebilir ve onlara sıcak bir yuva bulabilirsiniz.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://sahiplendirme.com'}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Hemen Keşfet</a>
              </div>
            </div>
          </div>
        `
      }).catch(err => console.error("Welcome email error:", err));
    });

    const { password: _, ...userWithoutPassword } = user;
    const response = NextResponse.json({ success: true, token: authToken, user: userWithoutPassword });
    
    response.cookies.set('auth_token', authToken, {
      httpOnly: true,
      secure: false, // IP (HTTP) üzerinden çalışması için false yapıldı
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
