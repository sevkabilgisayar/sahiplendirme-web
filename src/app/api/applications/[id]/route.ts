import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const body = await req.json();
    const { status } = body;

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Geçersiz statü' }, { status: 400 });
    }

    const application = await db.application.findUnique({
      where: { id: params.id },
      include: { listing: true }
    });

    if (!application) {
      return NextResponse.json({ error: 'Başvuru bulunamadı' }, { status: 404 });
    }

    // Only listing owner can approve/reject
    if (application.listing.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Yetkisiz işlem' }, { status: 403 });
    }

    const updated = await db.application.update({
      where: { id: params.id },
      data: { status }
    });

    // Notify applicant
    await db.notification.create({
      data: {
        userId: application.applicantId,
        type: 'application_update',
        content: `Başvurunuz ${status === 'approved' ? 'onaylandı' : 'reddedildi'}.`,
      }
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
