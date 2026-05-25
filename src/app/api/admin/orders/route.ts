import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await db.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: {
          include: { product: { select: { name: true } } }
        }
      }
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
