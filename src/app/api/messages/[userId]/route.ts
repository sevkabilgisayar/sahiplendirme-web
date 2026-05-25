import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const cookieToken = req.cookies.get('auth_token')?.value;
    const bearerToken = req.headers.get('Authorization')?.split(' ')[1];
    const token = cookieToken || bearerToken;

    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string, id?: string };
    const currentUserId = decoded.userId || decoded.id;
    
    // next 15 expects params to be awaited
    const resolvedParams = await params;
    const otherUserId = resolvedParams.userId;

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark as read
    const unreadMessages = messages.filter(m => m.receiverId === currentUserId && !m.isRead);
    if (unreadMessages.length > 0) {
      await db.message.updateMany({
        where: {
          receiverId: currentUserId as string,
          senderId: otherUserId,
          isRead: false
        },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
