import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch { return null; }
}

// GET /api/favorites  → Kullanıcının tüm favorilerini getir
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

  try {
    const favorites = await db.favorite.findMany({
      where: { userId },
      include: {
        listing: {
          include: { user: { select: { firstName: true, lastName: true, accountType: true } } }
        },
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const listings = favorites.filter(f => f.listing).map(f => f.listing);
    const products = favorites.filter(f => f.product).map(f => f.product);

    return NextResponse.json({ success: true, listings, products });
  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST /api/favorites  → Ekle / Çıkar (toggle)
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

  try {
    const { listingId, productId } = await req.json();

    if (!listingId && !productId) {
      return NextResponse.json({ error: 'listingId veya productId gerekli' }, { status: 400 });
    }

    if (listingId) {
      const existing = await db.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });
      if (existing) {
        await db.favorite.delete({ where: { id: existing.id } });
        return NextResponse.json({ success: true, action: 'removed' });
      } else {
        await db.favorite.create({ data: { userId, listingId } });
        return NextResponse.json({ success: true, action: 'added' });
      }
    }

    if (productId) {
      const existing = await db.favorite.findUnique({ where: { userId_productId: { userId, productId } } });
      if (existing) {
        await db.favorite.delete({ where: { id: existing.id } });
        return NextResponse.json({ success: true, action: 'removed' });
      } else {
        await db.favorite.create({ data: { userId, productId } });
        return NextResponse.json({ success: true, action: 'added' });
      }
    }
  } catch (error) {
    console.error('Favorites POST error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
