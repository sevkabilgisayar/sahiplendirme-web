import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { cookies } = req;
    const token = cookies.get('auth_token')?.value || req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as any;
    } catch {
      return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
    }

    const { rating, text } = await req.json();

    if (!rating || !text) {
      return NextResponse.json({ error: 'Puan ve yorum alanı zorunludur' }, { status: 400 });
    }

    const review = await db.productReview.create({
      data: {
        rating: parseInt(rating, 10),
        text,
        userId: payload.id || payload.userId,
        productId: params.id,
      },
    });

    // Ürünün ortalama puanını güncelle
    const allReviews = await db.productReview.findMany({
      where: { productId: params.id }
    });
    
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    
    await db.product.update({
      where: { id: params.id },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({ error: 'Yorum oluşturulamadı' }, { status: 500 });
  }
}
