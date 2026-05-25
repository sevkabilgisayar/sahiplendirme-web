import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const sellerId = decoded.userId;

    const body = await req.json();
    const product = await db.product.create({
      data: {
        name: body.name,
        brand: body.brand,
        category: body.category,
        price: parseFloat(body.price),
        stock: parseInt(body.stock),
        description: body.description,
        image: body.image,
        images: body.images ? JSON.stringify(body.images) : null,
        sellerId: sellerId
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Product Create API Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
