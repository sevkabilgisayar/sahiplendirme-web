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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const userId = getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
    }

    const resolvedParams = await params;
    
    const notification = await db.notification.updateMany({
      where: { 
        id: resolvedParams.id,
        userId: userId 
      },
      data: { isRead: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification mark read error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
