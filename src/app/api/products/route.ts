import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mockStoreProducts } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('kategori');

    // Auto-seed kaldırıldı
    let whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }

    const products = await db.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: 'Sunucu hatası', details: String(error) }, { status: 500 });
  }
}
