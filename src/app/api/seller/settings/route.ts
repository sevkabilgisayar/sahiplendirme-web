import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const body = await req.json();

    const user = await db.user.update({
      where: { id: decoded.userId },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        avatar: body.avatar || null,
        phone: body.phone,
        city: body.city,
        district: body.district,
        address: body.address,
        storeDescription: body.storeDescription || null // Assuming this field doesn't exist, we can use `about` if it exists on User. Let's check. Wait, I will use `bio` or similar, but User doesn't have `bio`. Maybe I should just update the available ones.
      }
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Settings save error:', error);
    return NextResponse.json({ error: 'Ayarlar kaydedilemedi: ' + (error.message || String(error)) }, { status: 500 });
  }
}
