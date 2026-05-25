import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const cycle = searchParams.get('cycle');
    const servicesParam = searchParams.get('services');

    const orderId = searchParams.get('orderId');

    if (!userId || !servicesParam) {
      return NextResponse.redirect(new URL('/profil?payment=error', req.url));
    }

    const services = servicesParam.split(',');
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.redirect(new URL('/profil?payment=error', req.url));
    }

    const now = new Date();
    const endsAt = new Date(now);
    if (cycle === 'yearly') {
      endsAt.setFullYear(endsAt.getFullYear() + 1);
    } else {
      endsAt.setMonth(endsAt.getMonth() + 1);
    }

    // 1. Kullanıcıyı güncelle
    await db.user.update({
      where: { id: user.id },
      data: {
        accountType: 'profesyonel',
        subscriptionEndsAt: endsAt,
        allowedServices: servicesParam
      }
    });

    // Siparişi tamamlandı olarak işaretle
    if (orderId) {
      try {
        await db.order.update({
          where: { id: orderId },
          data: { status: 'tamamlandi' }
        });
      } catch (e) {
        console.error("Order status update failed:", e);
      }
    }

    // 2. Satın alınan her kategori için boş bir hizmet ilanı aç
    for (const srv of services) {
      // Eğer kullanıcının zaten bu kategoride bir ilanı yoksa oluştur
      const existing = await db.service.findFirst({
        where: { userId: user.id, category: srv }
      });

      if (!existing) {
        await db.service.create({
          data: {
            name: `${user.firstName} ${user.lastName}`,
            category: srv,
            about: "Profesyonel hizmet veren profilim.",
            city: user.city || "İstanbul",
            district: "Merkez",
            address: "Adres belirtilmemiş",
            phone: user.phone || "Telefon belirtilmemiş",
            price: "İletişime Geçin",
            services: "[\"Genel\"]",
            tags: "[\"profesyonel\"]",
            userId: user.id
          }
        });
      }
    }

    // Ödeme başarılı, profile yönlendir
    return NextResponse.redirect(new URL('/profil?payment=success', req.url), { status: 302 });

  } catch (error) {
    console.error('Payment Success Callback Error:', error);
    return NextResponse.redirect(new URL('/profil?payment=error', req.url), { status: 302 });
  }
}
