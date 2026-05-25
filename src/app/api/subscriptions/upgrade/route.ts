import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await req.json();
    const services = body.services || [];
    const allowedServicesString = Array.isArray(services) ? services.join(',') : '';

    const user = await db.user.update({
      where: { id: decoded.userId },
      data: {
        accountType: 'profesyonel',
        allowedServices: allowedServicesString,
        subscriptionEndsAt: new Date(new Date().setMonth(new Date().getMonth() + 1))
      }
    });

    import('@/lib/email').then(({ sendEmail }) => {
      sendEmail({
        to: user.email,
        subject: 'Hesabınız Profesyonel Pakete Yükseltildi! 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f97316; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Tebrikler!</h1>
            </div>
            <div style="padding: 20px;">
              <p>Merhaba <strong>${user.firstName}</strong>,</p>
              <p>Hesabınız başarıyla <strong>Profesyonel</strong> pakete yükseltildi. Satın aldığınız hizmetler hesabınıza tanımlanmıştır.</p>
              <p>Artık satıcı panelinize giriş yaparak ilanlarınızı yönetmeye, hizmet profilinizi doldurmaya veya e-ticaret mağazanızı açmaya başlayabilirsiniz.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://sahiplendirme.com'}/satici/dashboard" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Satıcı Paneline Git</a>
              </div>
            </div>
          </div>
        `
      }).catch(console.error);
    });

    return NextResponse.json({ success: true, message: 'Hesap yükseltildi' });
  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
