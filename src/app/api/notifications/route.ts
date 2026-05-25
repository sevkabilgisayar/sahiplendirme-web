import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

function getUserFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET /api/notifications  → kullanıcının bildirimlerini getir
export async function GET(req: NextRequest) {
  try {
    const userId = getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// PATCH /api/notifications  → tümünü okundu işaretle
export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
    }

    await db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notifications PATCH error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
