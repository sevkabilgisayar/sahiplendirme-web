import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const banners = await db.banner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, banners });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
