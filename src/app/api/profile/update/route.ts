import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const body = await req.json();
    const { 
      firstName, lastName, phone, city,
      notifyNewMessages, notifyApplications, notifyEmails, notifyCampaigns 
    } = body;

    // E-posta güncellemesini güvenlik nedeniyle şimdilik bu rotada devre dışı bırakıyoruz (Veya izin verebiliriz)
    
    // Only update fields that are provided
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (city !== undefined) updateData.city = city;
    
    if (notifyNewMessages !== undefined) updateData.notifyNewMessages = notifyNewMessages;
    if (notifyApplications !== undefined) updateData.notifyApplications = notifyApplications;
    if (notifyEmails !== undefined) updateData.notifyEmails = notifyEmails;
    if (notifyCampaigns !== undefined) updateData.notifyCampaigns = notifyCampaigns;

    const updatedUser = await db.user.update({
      where: { id: decoded.userId },
      data: updateData
    });

    return NextResponse.json({ success: true, message: 'Bilgiler başarıyla güncellendi', user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Sunucu hatası veya geçersiz token' }, { status: 500 });
  }
}
