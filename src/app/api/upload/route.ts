import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/r2';

import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const files: File[] = data.getAll('file') as unknown as File[];
    const skipWatermark = data.get('skipWatermark') === 'true';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      let buffer = Buffer.from(bytes);

      let finalMime = file.type;
      let finalName = file.name;

      // Sadece resim dosyalarına watermark uygula
      if (file.type.startsWith('image/') && !skipWatermark) {
        try {
          const image = sharp(buffer);
          const metadata = await image.metadata();
          
          if (metadata.width && metadata.height) {
            // Sahibinden benzeri daha şeffaf ve kibar watermark
            const fontSize = Math.max(16, Math.floor(metadata.width * 0.04));
            const w = metadata.width;
            const h = metadata.height;
            const svgImage = `
              <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(${w * 0.5}, ${h * 0.5}) rotate(-25)">
                  <!-- Siyah kontur (outline) -->
                  <text x="0" y="0" 
                    font-family="Arial, sans-serif"
                    font-size="${fontSize}px" font-weight="bold"
                    fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="3px"
                    text-anchor="middle" dominant-baseline="middle">sahiplendirme.com</text>
                  <!-- Beyaz metin -->
                  <text x="0" y="0" 
                    font-family="Arial, sans-serif"
                    font-size="${fontSize}px" font-weight="bold"
                    fill="rgba(255,255,255,0.25)"
                    text-anchor="middle" dominant-baseline="middle">sahiplendirme.com</text>
                </g>
              </svg>
            `;
            
            buffer = await image
              .composite([{ input: Buffer.from(svgImage), gravity: 'center' }])
              .webp({ quality: 85 })
              .toBuffer();
              
            finalMime = 'image/webp';
            finalName = file.name.replace(/\.[^/.]+$/, ".webp");
          }
        } catch (imgError) {
          console.error("Watermark hatası (yine de orjinali yüklenecek):", imgError);
        }
      }
      
      const result = await uploadToR2(buffer, finalName, finalMime);
      uploadedUrls.push(result.url);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Dosya yükleme hatası' }, { status: 500 });
  }
}
