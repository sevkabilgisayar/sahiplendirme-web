import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const { cookies } = req;
    const token = cookies.get('auth_token')?.value || req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as any;
    } catch {
      return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, reason, detail } = body;

    if (!listingId || !reason) {
      return NextResponse.json({ error: 'İlan ID ve sebep gerekli' }, { status: 400 });
    }

    const report = await db.report.create({
      data: {
        listingId,
        reason,
        detail,
        reporterId: payload.userId,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Report creation error:', error);
    return NextResponse.json({ error: 'Şikayet oluşturulamadı' }, { status: 500 });
  }
}
