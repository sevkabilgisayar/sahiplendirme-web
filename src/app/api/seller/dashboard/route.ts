import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    // Fetch user from DB to get the most up-to-date accountType and role
    const user = await db.user.findUnique({ 
      where: { id: userId }, 
      select: { 
        status: true, accountType: true, role: true,
        firstName: true, lastName: true, phone: true,
        city: true, district: true, address: true,
        storeDescription: true, avatar: true
      } 
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    if (user.accountType !== 'profesyonel' && user.accountType !== 'barinak' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Bu alana sadece satıcılar/profesyoneller erişebilir.' }, { status: 403 });
    }

    // Fetch products
    const products = await db.product.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch services
    const services = await db.service.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });

    // (user state has already been fetched above)

    // Fetch order items for seller's products
    const orderItems = await db.orderItem.findMany({
      where: {
        product: {
          sellerId: userId
        }
      },
      include: {
        product: true,
        order: {
          include: { user: true }
        }
      },
      orderBy: {
        order: { createdAt: 'desc' }
      }
    });

    // We can group orderItems by Order if we want, or just return them
    return NextResponse.json({
      success: true,
      status: user?.status,
      accountType: user?.accountType,
      user,
      products,
      services,
      orderItems
    });

  } catch (error) {
    console.error('Seller Dashboard API Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
