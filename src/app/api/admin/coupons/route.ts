import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

async function getAdminFromRequest(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value || req.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'admin')) return null;
    return payload;
  } catch {
    return null;
  }
}

// GET /api/admin/coupons
export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: 'Kuponlar alınamadı' }, { status: 500 });
  }
}

// POST /api/admin/coupons
export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const { code, discount, type, validUntilDays } = await req.json();

    if (!code || !discount || !type || !validUntilDays) {
      return NextResponse.json({ error: 'Tüm alanları doldurun' }, { status: 400 });
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + parseInt(validUntilDays));

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount: parseFloat(discount),
        type, // 'percentage' or 'fixed'
        validUntil
      }
    });

    return NextResponse.json({ coupon });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu kupon kodu zaten var' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Kupon oluşturulamadı' }, { status: 500 });
  }
}
