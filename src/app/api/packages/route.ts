import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/packages
export async function GET() {
  try {
    const packages = await db.package.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    
    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Packages GET error:', error);
    return NextResponse.json({ error: 'Paketler alınamadı' }, { status: 500 });
  }
}
