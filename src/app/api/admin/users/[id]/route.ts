import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | any }
) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Yalnızca adminler banlayabilir
    if (decoded.role !== 'admin' && decoded.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const body = await req.json();

    if (body.action === 'approve') {
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { status: 'active' }
      });
      await db.adminLog.create({
        data: {
          actionType: 'SUCCESS',
          message: `${updatedUser.firstName} adlı barınak kullanıcısı onaylandı.`,
          adminEmail: decoded.email || 'admin'
        }
      });

      import('@/lib/email').then(({ sendEmail }) => {
        sendEmail({
          to: updatedUser.email,
          subject: 'Kurumsal Hesabınız Onaylandı! 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #22c55e; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Hesabınız Onaylandı!</h1>
              </div>
              <div style="padding: 20px;">
                <p>Merhaba <strong>${updatedUser.firstName}</strong>,</p>
                <p>Sahiplendirme.com üzerindeki Kurumsal (Barınak/Vakıf) hesabınız adminlerimiz tarafından incelendi ve <strong>onaylandı</strong>.</p>
                <p>Artık satıcı panelinize giriş yapıp ilan vermeye ve platformu özgürce kullanmaya başlayabilirsiniz.</p>
              </div>
            </div>
          `
        }).catch(console.error);
      });

      return NextResponse.json({ success: true, user: updatedUser });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { 
        isBanned: true, 
        banReason: body.reason || 'Admin tarafından engellendi.' 
      }
    });

    // Log the action
    await db.adminLog.create({
      data: {
        actionType: 'WARNING',
        message: `${updatedUser.firstName} adlı kullanıcı engellendi. Sebep: ${body.reason || 'Belirtilmedi'}`,
        adminEmail: decoded.email || 'admin'
      }
    });

    import('@/lib/email').then(({ sendEmail }) => {
      sendEmail({
        to: updatedUser.email,
        subject: 'Hesabınız Engellendi ⚠️',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #ef4444; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Hesabınız Engellendi</h1>
            </div>
            <div style="padding: 20px;">
              <p>Merhaba <strong>${updatedUser.firstName}</strong>,</p>
              <p>Hesabınız site kurallarını ihlal ettiği gerekçesiyle yönetici tarafından engellenmiştir.</p>
              <p><strong>Sebep:</strong> ${body.reason || 'Belirtilmedi'}</p>
              <p>Eğer bunun bir hata olduğunu düşünüyorsanız, lütfen iletişime geçin.</p>
            </div>
          </div>
        `
      }).catch(console.error);
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
