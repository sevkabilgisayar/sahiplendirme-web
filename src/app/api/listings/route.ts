import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('kategori');
    
    let whereClause: any = { 
      status: { in: ['approved', 'active'] } 
    };
    
    if (category && category !== 'tum-ilanlar') {
      whereClause.type = category;
    }

    const listings = await db.listing.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { firstName: true, lastName: true, avatar: true }
        }
      }
    });

    return NextResponse.json({ success: true, listings });
  } catch (error) {
    console.error("Listings API Error:", error);
    return NextResponse.json({ error: 'Sunucu hatası', details: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const body = await req.json();
    
    const newListing = await db.listing.create({
      data: {
        type: body.type,
        animal: body.animal,
        title: body.title,
        name: body.name,
        breed: body.breed,
        age: body.age,
        gender: body.gender,
        description: body.description,
        city: body.city,
        district: body.district,
        neighborhood: body.neighborhood,
        locationPrivacy: body.locationPrivacy,
        photos: JSON.stringify(body.photos || []),
        userId: decoded.userId,
        status: 'pending'
      }
    });

    return NextResponse.json({ success: true, listing: newListing });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası veya geçersiz oturum' }, { status: 500 });
  }
}
