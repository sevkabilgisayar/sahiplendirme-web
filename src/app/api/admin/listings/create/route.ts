import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-sahiplendirme-key') as { userId: string, role: string };
    
    // Check if admin
    const user = await db.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Sadece yetkili adminler özel ilan ekleyebilir' }, { status: 403 });
    }

    const body = await req.json();
    const { 
      type, animal, title, breed, age, gender, description, 
      city, district, contactName, contactPhone, photos 
    } = body;

    if (!type || !animal || !title || !description || !city) {
      return NextResponse.json({ error: 'Zorunlu alanları doldurun' }, { status: 400 });
    }

    const newListing = await db.listing.create({
      data: {
        type,
        animal,
        title,
        breed,
        age,
        gender,
        description,
        city,
        district,
        photos: JSON.stringify(photos || []),
        status: 'approved', // Direct approval for admin
        userId: user.id, // Assigned to admin
        contactName,
        contactPhone
      }
    });

    return NextResponse.json({ success: true, listing: newListing });
  } catch (error: any) {
    console.error('Admin create listing error:', error);
    return NextResponse.json({ error: 'İlan eklenirken bir hata oluştu' }, { status: 500 });
  }
}
