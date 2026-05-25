import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });

    const formData = await req.formData();
    
    const companyName = formData.get('companyName') as string;
    const taxNumber = formData.get('taxNumber') as string;
    const taxOffice = formData.get('taxOffice') as string;
    const companyType = formData.get('companyType') as string || 'Şahıs Şirketi';
    const city = formData.get('city') as string;
    const district = formData.get('district') as string;
    const address = formData.get('address') as string;
    const contactName = formData.get('contactName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const storeName = formData.get('storeName') as string;
    
    const vergiLevhasi = formData.get('vergiLevhasi');
    const imzaSirkusu = formData.get('imzaSirkusu');
    const markaTescil = formData.get('markaTescil');

    // MOCK FILE SAVING: In reality, you'd save these files to S3/Disk and get URLs.
    // For now we'll just save their names or a dummy string.
    const vergiLevhasiStr = vergiLevhasi ? 'uploaded-vergi-levhasi.pdf' : null;
    const imzaSirkusuStr = imzaSirkusu ? 'uploaded-imza-sirkusu.pdf' : null;
    const markaTescilStr = markaTescil ? 'uploaded-marka-tescil.pdf' : null;

    await db.storeApplication.create({
      data: {
        companyName,
        taxNumber,
        taxOffice,
        companyType,
        city,
        district,
        address,
        contactName,
        email,
        phone,
        storeName,
        vergiLevhasi: vergiLevhasiStr,
        imzaSirkusu: imzaSirkusuStr,
        markaTescil: markaTescilStr,
        userId: user.id,
      }
    });

    // Create an AdminLog so it appears in Admin Panel
    await db.adminLog.create({
      data: {
        actionType: 'STORE_APPLICATION',
        message: `Yeni Mağaza (Ürün) Başvurusu: ${companyName} (${user.email}). Vergi No: ${taxNumber}. Dosyalar: Vergi Levhası (${vergiLevhasi ? 'Var' : 'Yok'}), İmza Sirküsü (${imzaSirkusu ? 'Var' : 'Yok'}), Marka Tescili (${markaTescil ? 'Var' : 'Yok'})`,
        adminEmail: 'info@sahiplendirme.com'
      }
    });

    // Also send email
    try {
      const { sendEmail } = await import('@/lib/email');
      await sendEmail({
        to: 'info@sahiplendirme.com',
        subject: 'Yeni Kurumsal Mağaza Başvurusu',
        html: `
          <h3>Yeni Mağaza Başvurusu</h3>
          <p><strong>Firma:</strong> ${companyName}</p>
          <p><strong>Vergi No:</strong> ${taxNumber}</p>
          <p><strong>Vergi Dairesi:</strong> ${taxOffice}</p>
          <p><strong>Firma Adresi:</strong> ${city} - ${district} / ${address}</p>
          <p><strong>Yetkili:</strong> ${contactName}</p>
          <p><strong>E-Posta:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Mağaza Adı:</strong> ${storeName}</p>
          <hr/>
          <p><em>Belgeler sisteme yüklendi. Kontrol etmek için admin paneline giriniz.</em></p>
        `
      });
    } catch (e) {
      console.error('Failed to send admin email', e);
    }

    return NextResponse.json({ success: true, message: 'Başvurunuz başarıyla alındı ve yönetici onayına sunuldu.' });
  } catch (error) {
    console.error('Magaza Basvuru Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
