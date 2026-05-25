import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function GET(req: NextRequest) {
  try {
    const banners = await db.banner.findMany({
      include: {
        stats: {
          orderBy: { date: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, banners });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin' && decoded.accountType !== 'ADMIN') return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });

    const body = await req.json();
    const banner = await db.banner.create({
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        position: body.position || 'home_middle',
        endDate: body.endDate ? new Date(body.endDate) : null,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    });

    await db.adminLog.create({
      data: {
        actionType: 'INFO',
        message: `Yeni reklam banner'ı eklendi: ${body.title}`,
        adminEmail: decoded.email || 'admin'
      }
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
