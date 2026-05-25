import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const blogs = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
