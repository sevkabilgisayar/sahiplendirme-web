import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        accountType: true,
        role: true,
        avatar: true,
        status: true,
        createdAt: true,
        subscriptionEndsAt: true,
        allowedServices: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Geçersiz oturum', details: String(error) }, { status: 401 });
  }
}
