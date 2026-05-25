import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const userId = await getSessionUser();
    if (!userId) {
      return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 });
    }

    const resolvedParams = await params;
    const listing = await db.listing.findUnique({ where: { id: resolvedParams.id } });
    
    if (!listing) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }
    if (listing.userId !== userId) {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
    }
    if (listing.status !== 'passive') {
      return NextResponse.json({ error: 'Bu ilan pasif durumda değil' }, { status: 400 });
    }

    const updated = await db.listing.update({
      where: { id: resolvedParams.id },
      data: {
        status: 'approved',
        updatedAt: new Date() // resets the 30-day clock automatically
      },
    });

    return NextResponse.json({ success: true, message: 'İlan başarıyla tekrar aktifleştirildi.', listing: updated });
  } catch (error) {
    console.error('Reactivate Listing error:', error);
    return NextResponse.json({ error: 'İşlem başarısız', details: String(error) }, { status: 500 });
  }
}
