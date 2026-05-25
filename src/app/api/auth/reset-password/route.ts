import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token ve yeni şifre gerekli' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır' }, { status: 400 });
    }

    try {
      // Token doğrulama (süre veya imza yanlışsa hata fırlatır)
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, purpose: string };

      if (decoded.purpose !== 'password_reset') {
        return NextResponse.json({ error: 'Geçersiz token tipi' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword }
      });

      return NextResponse.json({ success: true, message: 'Şifreniz başarıyla güncellendi.' });
    } catch (jwtError) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bağlantı.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
