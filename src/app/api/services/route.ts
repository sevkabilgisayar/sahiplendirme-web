import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

const mockServices = [
  {
    id: "s1",
    name: "PetLife Veteriner Kliniği",
    category: "veteriner",
    about: "7/24 Acil Müdahale ve Tam Donanımlı Klinik",
    city: "İstanbul",
    district: "Kadıköy",
    phone: "0216 555 1234",
    price: "Muayene 350₺",
    rating: 4.9,
    reviews: 128,
    verified: true,
    featured: true,
    services: ["Acil Müdahale", "Aşı", "Röntgen", "Cerrahi"],
    tags: ["7/24 Açık", "Otopark Var", "Kedi/Köpek Özel"]
  },
  {
    id: "s2",
    name: "Happy Paws Pet Kuaför",
    category: "kuafor",
    about: "Anestezisiz Pet Kuaför ve Spa Merkezi",
    city: "İzmir",
    district: "Karşıyaka",
    phone: "0232 555 9876",
    price: "Traş 450₺'den",
    rating: 4.8,
    reviews: 86,
    verified: true,
    featured: false,
    services: ["Makine Traşı", "Makas Traşı", "Banyo", "Tırnak Kesimi"],
    tags: ["Anestezisiz", "Randevulu", "Organik Ürünler"]
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    // Auto seed kaldırıldı
    let whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }

    const servicesRaw = await db.service.findMany({
      where: whereClause,
      orderBy: { rating: 'desc' }
    });

    const services = servicesRaw.map(s => ({
      ...s,
      services: JSON.parse(s.services),
      tags: JSON.parse(s.tags),
      // Restore visual data based on category
      emoji: s.category === 'veteriner' ? '🩺' : 
             s.category === 'kuafor' ? '✂️' :
             s.category === 'egitmen' ? '🎓' :
             s.category === 'pet-otel' ? '🏨' : '🦨',
      color: s.category === 'veteriner' ? 'from-blue-400 to-cyan-500 text-white' :
             s.category === 'kuafor' ? 'from-pink-400 to-rose-500 text-white' :
             s.category === 'egitmen' ? 'from-emerald-400 to-teal-500 text-white' :
             s.category === 'pet-otel' ? 'from-purple-400 to-indigo-500 text-white' :
             'from-amber-400 to-orange-500 text-white'
    }));

    return NextResponse.json({ success: true, services });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, accountType: string };
    
    if (decoded.accountType !== 'profesyonel' && decoded.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Sadece Profesyonel hesaplar hizmet ilanı verebilir' }, { status: 403 });
    }
    
    const body = await req.json();
    
    const newService = await db.service.create({
      data: {
        name: body.name,
        category: body.category,
        about: body.about,
        city: body.city,
        district: body.district,
        address: body.address || 'Adres belirtilmemiş',
        phone: body.phone,
        price: body.price,
        services: JSON.stringify(body.services || []),
        tags: JSON.stringify(body.tags || []),
        image: body.image,
        userId: decoded.userId,
        verified: false,
        featured: false,
      }
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sunucu hatası veya geçersiz oturum' }, { status: 500 });
  }
}
