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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const listing = await db.listing.findUnique({
      where: { id: resolvedParams.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            accountType: true,
            city: true,
            createdAt: true,
          }
        }
      }
    });

    if (!listing) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error('GET Listing error:', error);
    return NextResponse.json({ error: 'Sunucu hatası', details: String(error) }, { status: 500 });
  }
}

export async function PATCH(
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
      return NextResponse.json({ error: 'Bu ilanı düzenleme yetkiniz yok' }, { status: 403 });
    }

    const body = await req.json();
    const allowedFields = ['title', 'name', 'breed', 'age', 'gender', 'description', 'city', 'district', 'photos', 'lossTime', 'hasReward', 'rewardAmount'];
    
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (updateData.photos && Array.isArray(updateData.photos)) {
      updateData.photos = JSON.stringify(updateData.photos);
    }

    const updated = await db.listing.update({
      where: { id: resolvedParams.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (error) {
    console.error('PATCH Listing error:', error);
    return NextResponse.json({ error: 'Güncelleme başarısız', details: String(error) }, { status: 500 });
  }
}
