import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Güvenlik: İsteğe bağlı olarak yetkilendirme eklenebilir. 
    // Ancak bu cron job VPS üzerinden tetikleneceği için curl ile localden çağrılabilir.

    const now = new Date();

    // Süresi dolmuş profesyonel ve barınak hesaplarını bul
    const expiredUsers = await db.user.findMany({
      where: {
        accountType: { not: 'bireysel' },
        subscriptionEndsAt: { lt: now }
      }
    });

    if (expiredUsers.length === 0) {
      return NextResponse.json({ success: true, message: 'Süresi dolan abonelik bulunamadı.', count: 0 });
    }

    // Kullanıcıları bireysele düşür
    const updateResult = await db.user.updateMany({
      where: {
        accountType: { not: 'bireysel' },
        subscriptionEndsAt: { lt: now }
      },
      data: {
        accountType: 'bireysel',
        subscriptionPlan: null,
      }
    });

    // İsteğe bağlı: Bu kullanıcıların ilanlarını pasife alma mantığı da eklenebilir.
    // Ancak şimdilik sadece hesap türünü düşürüyoruz.

    return NextResponse.json({ 
      success: true, 
      message: 'Abonelikler güncellendi.', 
      count: updateResult.count 
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
