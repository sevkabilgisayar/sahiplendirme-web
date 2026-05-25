import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('auth_token')?.value;
    const bearerToken = req.headers.get('Authorization')?.split(' ')[1];
    const token = cookieToken || bearerToken;

    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string, id?: string };
    const userId = decoded.userId || decoded.id;

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        listing: { select: { id: true, name: true, breed: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by other user to form conversations
    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const isSender = msg.senderId === decoded.userId;
      const otherUser = isSender ? msg.receiver : msg.sender;
      const otherUserId = otherUser.id;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          id: otherUserId, // Using other user ID as conversation ID
          name: `${otherUser.firstName} ${otherUser.lastName}`,
          avatar: otherUser.avatar || otherUser.firstName.charAt(0),
          lastMsg: msg.content,
          time: msg.createdAt,
          listingName: msg.listing ? `${msg.listing.name} - ${msg.listing.breed}` : '',
          unread: (!isSender && !msg.isRead) ? 1 : 0,
          online: false, // Could implement real-time online status later
        });
      } else {
        if (!isSender && !msg.isRead) {
          const conv = conversationsMap.get(otherUserId);
          conv.unread += 1;
        }
      }
    });

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('auth_token')?.value;
    const bearerToken = req.headers.get('Authorization')?.split(' ')[1];
    const token = cookieToken || bearerToken;

    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string, id?: string };
    const userId = decoded.userId || decoded.id;
    
    const body = await req.json();
    const { receiverId, content, listingId } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        content,
        senderId: userId as string,
        receiverId,
        listingId
      }
    });

    // Send notification to receiver
    await db.notification.create({
      data: {
        userId: receiverId,
        type: 'new_message',
        content: `Yeni bir mesajınız var.`,
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
