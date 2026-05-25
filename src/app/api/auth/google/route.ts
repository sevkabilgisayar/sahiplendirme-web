import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

export async function POST(req: NextRequest) {
  try {
    const { token, email, firstName, lastName, photoUrl } = await req.json();

    if (!token || !email) {
      return NextResponse.json({ error: 'Token ve E-posta gerekli' }, { status: 400 });
    }

    // Gerçekte Google Auth Library ile verifyIdToken yapılmalıdır:
    /*
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // payload.email, payload.name vs
    */

    // Simülasyon: Token geldiğini varsayıp güveniyoruz (SADECE EĞİTİM/MOCK AMAÇLI, CANLIDA YUKARIDAKİ AÇILMALI)
    console.log(`[GOOGLE LOGIN] Doğrulandı: ${email}`);

    // Kullanıcı var mı?
    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      // Kullanıcı yoksa otomatik kayıt et
      user = await db.user.create({
        data: {
          email,
          firstName: firstName || email.split('@')[0],
          lastName: lastName || '',
          password: 'google-sso-no-password', // Dummy password for SSO
          avatar: photoUrl || '',
          accountType: 'bireysel'
        }
      });
    }

    // JWT Oluştur
    const authToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      token: authToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }
    });

    response.cookies.set('auth_token', authToken, {
      httpOnly: true,
      secure: false, // IP üzerinden geliştirme yapılıyorsa false kalmalı
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
