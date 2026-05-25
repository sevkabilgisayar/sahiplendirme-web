import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function GET(req: NextRequest) {
  try {
    const packages = await db.package.findMany({
      orderBy: { price: 'asc' }
    });
    return NextResponse.json({ success: true, packages });
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
    const pkg = await db.package.create({
      data: {
        name: body.name,
        price: parseFloat(body.price),
        features: JSON.stringify(body.features || []),
        maxListings: parseInt(body.maxListings || '0'),
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    });

    await db.adminLog.create({
      data: {
        actionType: 'INFO',
        message: `Yeni hizmet paketi eklendi: ${body.name} (₺${body.price})`,
        adminEmail: decoded.email || 'admin'
      }
    });

    return NextResponse.json({ success: true, package: pkg });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
