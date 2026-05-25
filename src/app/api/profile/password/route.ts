import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Mevcut şifre ve yeni şifre gerekli' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Google ile kayıt olanlar veya şifresi olmayanların durumu
    if (!user.password || user.password === 'google-sso-no-password') {
      return NextResponse.json({ error: 'Google ile giriş yaptığınız için şifre değiştiremezsiniz' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Mevcut şifreniz yanlış' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Yeni şifreniz en az 6 karakter olmalıdır' }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: decoded.userId },
      data: { password: hashedNewPassword }
    });

    return NextResponse.json({ success: true, message: 'Şifreniz başarıyla değiştirildi' });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json({ error: 'Sunucu hatası veya geçersiz token' }, { status: 500 });
  }
}
