import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | any }
) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin' && decoded.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const resolvedParams = await params;
    const packageId = resolvedParams.id;

    await db.package.delete({
      where: { id: packageId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | any }
) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin' && decoded.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const resolvedParams = await params;
    const packageId = resolvedParams.id;
    const body = await req.json();

    const updatedPackage = await db.package.update({
      where: { id: packageId },
      data: {
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        name: body.name !== undefined ? body.name : undefined
      }
    });

    return NextResponse.json({ success: true, package: updatedPackage });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
