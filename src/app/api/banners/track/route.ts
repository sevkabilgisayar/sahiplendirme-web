import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bannerId, type } = body;

    if (!bannerId || !type) {
      return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Find the banner first to ensure it exists
    const banner = await db.banner.findUnique({ where: { id: bannerId } });
    if (!banner) {
      return NextResponse.json({ error: 'Banner bulunamadı' }, { status: 404 });
    }

    // Upsert daily stat
    await db.bannerDailyStat.upsert({
      where: {
        bannerId_date: {
          bannerId,
          date: today,
        }
      },
      update: {
        impressions: type === 'impression' ? { increment: 1 } : undefined,
        clicks: type === 'click' ? { increment: 1 } : undefined,
      },
      create: {
        bannerId,
        date: today,
        impressions: type === 'impression' ? 1 : 0,
        clicks: type === 'click' ? 1 : 0,
      }
    });

    // Also update total clicks if it's a click
    if (type === 'click') {
      await db.banner.update({
        where: { id: bannerId },
        data: { clicks: { increment: 1 } }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Banner track error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
