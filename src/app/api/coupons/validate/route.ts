import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Kupon kodu gerekli' }, { status: 400 });
    }

    const coupon = await db.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Geçersiz kupon kodu' }, { status: 404 });
    }

    if (coupon.isUsed) {
      return NextResponse.json({ error: 'Bu kupon kodu daha önce kullanılmış' }, { status: 400 });
    }

    if (new Date(coupon.validUntil) < new Date()) {
      return NextResponse.json({ error: 'Bu kuponun süresi dolmuş' }, { status: 400 });
    }

    // İndirim hesapla
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (amount * coupon.discount) / 100;
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.discount;
    }

    // Toplam tutardan fazla indirim olamaz
    if (discountAmount > amount) {
      discountAmount = amount;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.type,
        discountValue: coupon.discount,
      },
      discountAmount,
      newTotal: amount - discountAmount
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ error: 'Kupon doğrulanırken bir hata oluştu' }, { status: 500 });
  }
}
