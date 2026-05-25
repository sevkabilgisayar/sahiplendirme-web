import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('auth_token')?.value;
    const bearerToken = req.headers.get('Authorization')?.split(' ')[1];
    const token = cookieToken || bearerToken;

    if (!token) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId || decoded.id; // Support both just in case

    const body = await req.json();
    const { serviceId, date, time } = body;

    if (!serviceId || !date || !time) {
      return NextResponse.json({ error: 'Tüm alanları doldurun.' }, { status: 400 });
    }

    const booking = await db.booking.create({
      data: {
        serviceId,
        userId,
        date,
        time,
        status: 'bekliyor'
      }
    });

    // Hizmet sağlayıcıya bildirim gönderelim (şimdilik simüle edelim veya db.notification)
    const service = await db.service.findUnique({ where: { id: serviceId } });
    if (service && service.userId) {
      await db.notification.create({
        data: {
          type: 'system',
          content: `${service.name} hizmetiniz için yeni bir randevu talebi alındı. (${date} ${time})`,
          userId: service.userId
        }
      });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
