import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | any }
) {
  try {
    const resolvedParams = await params;
    
    const product = await db.product.findUnique({
      where: { id: resolvedParams.id },
      include: {
        reviews: {
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    const relatedProducts = await db.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id }
      },
      take: 4
    });

    return NextResponse.json({ success: true, product, relatedProducts });
  } catch (error) {
    console.error('Product details error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
