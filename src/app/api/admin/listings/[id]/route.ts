import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await db.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { status } = body;

    if (!['active', 'passive', 'pending', 'rejected', 'approved'].includes(status)) {
      return NextResponse.json({ error: 'Geçersiz statü' }, { status: 400 });
    }
    
    // Map 'approved' to 'active' for consistency if needed, but let's keep it flexible
    const finalStatus = status === 'approved' ? 'active' : status;

    const listing = await db.listing.update({
      where: { id: resolvedParams.id },
      data: { status: finalStatus }
    });

    // Notify user
    await db.notification.create({
      data: {
        userId: listing.userId,
        type: 'listing_update',
        content: `İlanınız moderatör tarafından güncellendi: ${finalStatus}.`,
      }
    });

    await db.adminLog.create({
      data: {
        adminEmail: user.email,
        actionType: finalStatus === 'active' ? 'INFO' : 'WARNING',
        message: `İlan durumu güncellendi (${finalStatus}): ${listing.title}`
      }
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await db.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const resolvedParams = await params;
    
    const listing = await db.listing.delete({
      where: { id: resolvedParams.id }
    });

    await db.adminLog.create({
      data: {
        adminEmail: user.email,
        actionType: 'DANGER',
        message: `İlan silindi: ${listing.title} (${listing.id})`
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Silme işlemi başarısız' }, { status: 500 });
  }
}
