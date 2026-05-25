import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

async function getAdminFromRequest(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value || req.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'admin')) return null;
    return payload;
  } catch {
    return null;
  }
}

// GET /api/admin/settings
export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const settings = await db.siteSetting.upsert({
      where: { id: 'singleton' },
      update: {},
      create: { id: 'singleton' },
    });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Ayarlar alınamadı' }, { status: 500 });
  }
}

// PUT /api/admin/settings
export async function PUT(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const body = await req.json();
    
    // smtpPort'u integer'a dönüştür
    if (body.smtpPort) body.smtpPort = parseInt(body.smtpPort, 10);
    
    // Güvenli olmayan alanları çıkar
    delete body.id;
    delete body.updatedAt;

    const settings = await db.siteSetting.upsert({
      where: { id: 'singleton' },
      update: body,
      create: { id: 'singleton', ...body },
    });

    return NextResponse.json({ settings, message: 'Ayarlar başarıyla kaydedildi.' });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 });
  }
}
