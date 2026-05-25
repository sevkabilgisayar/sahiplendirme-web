import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const blogs = await db.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Note: Admin authentication middleware would normally apply here.
    const body = await req.json();
    
    // Auto-generate slug from title if not provided
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const blog = await db.blogPost.create({
      data: {
        title: body.title,
        slug: slug,
        excerpt: body.summary || body.excerpt || '',
        content: body.content,
        image: body.imageUrl || body.image || null,
        category: body.category || 'genel',
        readTime: '5 dk',
        author: 'Admin',
        featured: false
      }
    });

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Blog create error:', error);
    return NextResponse.json({ error: 'Blog eklenemedi' }, { status: 500 });
  }
}
