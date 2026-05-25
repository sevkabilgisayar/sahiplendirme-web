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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';

    // Filtreleri oluştur
    const whereCondition: any = {};
    
    if (status) whereCondition.status = status;
    if (type) whereCondition.type = type;

    if (search) {
      whereCondition.OR = [
        { id: { contains: search } },
        { title: { contains: search } },
        { animalName: { contains: search } },
        { breed: { contains: search } },
        {
          user: {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
            ]
          }
        }
      ];
    }

    const listings = await db.listing.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      take: 500, // Performans için max 500
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        _count: { select: { reports: true, favorites: true, messages: true } }
      }
    });

    return NextResponse.json({ success: true, listings });
  } catch (error) {
    console.error('All listings fetch error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
