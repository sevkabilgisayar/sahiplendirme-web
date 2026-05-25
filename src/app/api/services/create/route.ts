import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await db.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    if (user.accountType !== 'profesyonel' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Hizmet ilanı vermek için profesyonel aboneliğinizin olması gerekir.' }, { status: 403 });
    }

    // Abonelik süresi dolmuş mu kontrolü (admin değilse)
    if (user.role !== 'admin' && user.subscriptionEndsAt && new Date() > user.subscriptionEndsAt) {
      return NextResponse.json({ error: 'Abonelik süreniz dolmuş. Lütfen yenileyiniz.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, about, city, district, address, phone, price, servicesInput, tagsInput, image, latitude, longitude } = body;

    if (!name || !category || !city || !phone) {
      return NextResponse.json({ error: 'Gerekli alanları doldurunuz.' }, { status: 400 });
    }

    const servicesArr = servicesInput ? servicesInput.split(',').map((s: string) => s.trim()) : [];
    const tagsArr = tagsInput ? tagsInput.split(',').map((s: string) => s.trim()) : [];

    // Sadece satın aldığı kategorilerde ilan açabilmeli
    if (user.role !== 'admin' && user.accountType === 'profesyonel' && user.allowedServices) {
      const allowed = user.allowedServices.split(',');
      if (!allowed.includes(body.category)) {
        return NextResponse.json({ error: `Sadece satın aldığınız kategorilerde ilan verebilirsiniz: ${user.allowedServices}` }, { status: 403 });
      }
    }
    
    // Zaten bu kategoride bir ilanı varsa güncelle (Upsert mantığı)
    const existing = await db.service.findFirst({
      where: { userId: user.id, category: body.category }
    });

    let serviceRecord;
    if (existing) {
      serviceRecord = await db.service.update({
        where: { id: existing.id },
        data: {
          name,
          about: about || '',
          city,
          district: district || '',
          address: address || '',
          phone,
          price: price || '',
          services: JSON.stringify(servicesArr),
          tags: JSON.stringify(tagsArr),
          image: image || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null
        }
      });
    } else {
      serviceRecord = await db.service.create({
        data: {
          name,
          category,
          about: about || '',
          city,
          district: district || '',
          address: address || 'Adres belirtilmemiş',
          phone,
          price: price || 'İletişime Geçin',
          services: JSON.stringify(servicesArr),
          tags: JSON.stringify(tagsArr),
          image,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          userId: decoded.userId,
          verified: false,
          featured: false,
        }
      });
    }

    return NextResponse.json({ success: true, service: serviceRecord });
  } catch (error) {
    console.error('Service creation error:', error);
    return NextResponse.json({ error: 'İlan oluşturulurken sunucu hatası oluştu' }, { status: 500 });
  }
}
