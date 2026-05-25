import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const blog = await db.blogPost.update({
      where: { slug: params.slug },
      data: { viewCount: { increment: 1 } }
    });
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
