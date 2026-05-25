import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

function parseXMLProducts(xmlText: string): any[] {
  const products: any[] = [];

  // Her <product> bloğunu bul
  const productMatches = xmlText.match(/<product[\s\S]*?<\/product>/gi);
  if (!productMatches) return products;

  for (const block of productMatches) {
    const get = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      return m ? m[1].trim().replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim() : '';
    };

    const name = get('name') || get('title') || get('baslik');
    const price = parseFloat(get('price') || get('fiyat') || '0');
    const stock = parseInt(get('stock') || get('stok') || get('quantity') || '1', 10);
    const description = get('description') || get('aciklama') || get('desc') || '';
    const brand = get('brand') || get('marka') || '';
    const category = get('category') || get('kategori') || 'Genel';
    const image = get('image') || get('resim') || get('img') || '';

    if (!name || isNaN(price) || price <= 0) continue;

    products.push({ name, price, stock: isNaN(stock) ? 1 : stock, description, brand, category, image });
  }

  return products;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const sellerId = decoded.userId;

    // Kullanıcı kontrolü
    const user = await db.user.findUnique({ where: { id: sellerId } });
    if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });

    const contentType = req.headers.get('content-type') || '';
    let xmlText = '';

    if (contentType.includes('text/xml') || contentType.includes('application/xml')) {
      xmlText = await req.text();
    } else {
      // multipart/form-data
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) return NextResponse.json({ error: 'XML dosyası bulunamadı' }, { status: 400 });
      xmlText = await file.text();
    }

    if (!xmlText.trim()) {
      return NextResponse.json({ error: 'XML içeriği boş' }, { status: 400 });
    }

    const parsedProducts = parseXMLProducts(xmlText);

    if (parsedProducts.length === 0) {
      return NextResponse.json({
        error: 'XML\'den hiç ürün ayrıştırılamadı. Lütfen format örneğini kontrol edin.',
        hint: 'Her ürün <product> etiketi içinde olmalı ve en az <name> ile <price> alanları bulunmalı.'
      }, { status: 422 });
    }

    // Toplu ekleme
    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const p of parsedProducts) {
      try {
        await db.product.create({
          data: {
            name: p.name,
            brand: p.brand || null,
            category: p.category,
            price: p.price,
            stock: p.stock,
            description: p.description || null,
            image: p.image || null,
            sellerId,
          }
        });
        imported++;
      } catch (e: any) {
        failed++;
        errors.push(`"${p.name}": ${e.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      failed,
      total: parsedProducts.length,
      message: `${imported} ürün başarıyla içe aktarıldı.${failed > 0 ? ` ${failed} ürün eklenemedi.` : ''}`,
      errors: errors.slice(0, 5)
    });

  } catch (error: any) {
    console.error('XML Import Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 });
  }
}
