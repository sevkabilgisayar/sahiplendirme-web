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

// DELETE /api/admin/coupons/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    await db.coupon.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Kupon silinemedi' }, { status: 500 });
  }
}
