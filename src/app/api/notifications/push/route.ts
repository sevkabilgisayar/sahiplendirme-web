import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';
const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY || ''; // Firebase console'dan alınır

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value || req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const body = await req.json();
    const { targetUserId, title, body: msgBody, data } = body;

    // Gerçek senaryoda kullanıcının FCM token'ını veritabanından çekmeniz gerekir:
    // const user = await db.user.findUnique({ where: { id: targetUserId }, select: { fcmToken: true } });
    const mockFcmToken = "ezM...fake-token-from-device";

    if (FCM_SERVER_KEY && mockFcmToken) {
      // Firebase Cloud Messaging REST API'sine istek atılır
      /*
      await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${FCM_SERVER_KEY}`
        },
        body: JSON.stringify({
          to: mockFcmToken,
          notification: {
            title: title,
            body: msgBody,
            sound: 'default'
          },
          data: data || {}
        })
      });
      */
    } else {
      console.log(`[FCM TEST] Push Notification Sent to ${targetUserId}: ${title} - ${msgBody}`);
    }

    return NextResponse.json({ success: true, message: "Push notification processed" });
  } catch (error) {
    console.error('Push Notification error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
