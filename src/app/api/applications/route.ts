import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const body = await req.json();
    const { listingId, message } = body;

    if (!listingId || !message) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    // Check if listing exists
    const listing = await db.listing.findUnique({ where: { id: listingId } });
    if (!listing) return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });

    // Check if user already applied
    const existing = await db.application.findFirst({
      where: {
        applicantId: decoded.userId,
        listingId: listingId
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Bu ilana zaten başvuru yaptınız' }, { status: 400 });
    }

    const application = await db.application.create({
      data: {
        message,
        listingId,
        applicantId: decoded.userId,
        status: 'pending'
      }
    });

    // Create a notification for the listing owner
    await db.notification.create({
      data: {
        userId: listing.userId,
        type: 'application',
        content: `İlanınıza yeni bir başvuru var.`,
      }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası veya geçersiz oturum' }, { status: 500 });
  }
}
