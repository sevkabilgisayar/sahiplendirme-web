import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Sadece ücretsiz kategoriler: sahiplendirme, kayip, ciftlestirme
    const categoriesToDeactivate = ['sahiplendirme', 'kayip', 'ciftlestirme'];

    const expiredListings = await db.listing.findMany({
      where: {
        type: { in: categoriesToDeactivate },
        updatedAt: { lt: thirtyDaysAgo },
        status: { not: 'passive' } 
      }
    });

    if (expiredListings.length === 0) {
      return NextResponse.json({ success: true, message: '30 günü geçen ücretsiz ilan bulunamadı.', count: 0 });
    }

    const updateResult = await db.listing.updateMany({
      where: {
        type: { in: categoriesToDeactivate },
        updatedAt: { lt: thirtyDaysAgo },
        status: { not: 'passive' }
      },
      data: {
        status: 'passive'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Süresi dolan ücretsiz ilanlar pasife alındı.', 
      count: updateResult.count 
    });

  } catch (error) {
    console.error('Cron job listings error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
