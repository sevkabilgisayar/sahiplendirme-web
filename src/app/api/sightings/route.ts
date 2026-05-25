import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

// GET /api/sightings?listingId=xxx  → ilanın ihbarlarını getir
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json({ error: 'listingId gerekli' }, { status: 400 });
    }

    const sightings = await db.sighting.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: { firstName: true, lastName: true, avatar: true }
        }
      }
    });

    return NextResponse.json({ success: true, sightings });
  } catch (error) {
    console.error('Sightings GET error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST /api/sightings  → yeni ihbar kaydet + ilan sahibine bildirim gönder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, note, location, seenAt, contactInfo } = body;

    if (!listingId || !note || !location || !seenAt) {
      return NextResponse.json({ error: 'listingId, note, location ve seenAt zorunludur' }, { status: 400 });
    }

    // Oturum açık mı? (opsiyonel – anonim ihbar da kabul edilir)
    let reporterId: string | null = null;
    const token = req.cookies.get('auth_token')?.value;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        reporterId = decoded.userId;
      } catch {
        // Token geçersiz, anonim olarak devam et
      }
    }

    // İhbarı kaydet
    const sighting = await db.sighting.create({
      data: {
        listingId,
        note,
        location,
        seenAt,
        contactInfo: contactInfo || null,
        reporterId: reporterId || null,
      },
      include: {
        reporter: { select: { firstName: true, lastName: true } },
        listing: { select: { userId: true, name: true } },
      }
    });

    // İlan sahibine bildirim gönder
    await db.notification.create({
      data: {
        userId: sighting.listing.userId,
        type: 'sighting',
        content: `"${sighting.listing.name}" adlı kayıp hayvanınız için yeni bir ihbar geldi: ${location}`,
        isRead: false,
      }
    });

    return NextResponse.json({ success: true, sighting });
  } catch (error) {
    console.error('Sightings POST error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
