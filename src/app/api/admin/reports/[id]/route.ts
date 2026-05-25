import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
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
    
    const report = await db.report.update({
      where: { id: resolvedParams.id },
      data: { status: body.status || 'resolved' },
      include: { listing: { select: { title: true } } }
    });

    await db.adminLog.create({
      data: {
        adminEmail: user.email,
        actionType: 'INFO',
        message: `Şikayet durumu güncellendi (${body.status || 'resolved'}): ${report.listing.title}`
      }
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
