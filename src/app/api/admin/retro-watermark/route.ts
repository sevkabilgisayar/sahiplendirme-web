import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadToR2 } from '@/lib/r2';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const listings = await db.listing.findMany({
      where: {
        photos: {
          not: '[]'
        }
      }
    });

    let processedCount = 0;
    let failedCount = 0;
    
    for (const listing of listings) {
      if (!listing.photos) continue;
      
      let parsedPhotos: string[] = [];
      try {
        if (typeof listing.photos === 'string') {
          parsedPhotos = JSON.parse(listing.photos);
          if (typeof parsedPhotos === 'string') {
            parsedPhotos = JSON.parse(parsedPhotos);
          }
        } else if (Array.isArray(listing.photos)) {
          parsedPhotos = listing.photos;
        }
      } catch (e) {
        continue;
      }
      
      if (!parsedPhotos || parsedPhotos.length === 0) continue;
      
      const newPhotos: string[] = [];
      let updated = false;

      for (const photoUrl of parsedPhotos) {
        // R2'de olmayan URL'leri atla
        if (!photoUrl.includes('pub-c5522d787fe246019366498cc80f3b2e.r2.dev')) {
          newPhotos.push(photoUrl);
          continue;
        }

        // Zaten retro-watermark işleminden geçmiş dosyaları atla (üst üste watermark önleme)
        const urlPath = new URL(photoUrl).pathname;
        const fileName = urlPath.split('/').pop() || '';
        if (fileName.startsWith('retro-') || fileName.startsWith('wm-')) {
          newPhotos.push(photoUrl);
          continue;
        }

        try {
          console.log(`Processing: ${photoUrl}`);
          const res = await fetch(photoUrl);
          if (!res.ok) {
            newPhotos.push(photoUrl);
            continue;
          }
          
          const arrayBuffer = await res.arrayBuffer();
          let buffer = Buffer.from(arrayBuffer);
          
          const image = sharp(buffer);
          const metadata = await image.metadata();
          
          if (metadata.width && metadata.height) {
            const fontSize = Math.max(20, Math.floor(metadata.width * 0.05));
            const w = metadata.width;
            const h = metadata.height;
            const svgImage = `
              <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(${w * 0.5}, ${h * 0.5}) rotate(-25)">
                  <text x="0" y="0" 
                    font-family="Liberation Sans, Open Sans, DejaVu Sans, sans-serif"
                    font-size="${fontSize}px" font-weight="bold"
                    fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="4px"
                    text-anchor="middle" dominant-baseline="middle">sahiplendirme.com</text>
                  <text x="0" y="0" 
                    font-family="Liberation Sans, Open Sans, DejaVu Sans, sans-serif"
                    font-size="${fontSize}px" font-weight="bold"
                    fill="rgba(255,255,255,0.7)"
                    text-anchor="middle" dominant-baseline="middle">sahiplendirme.com</text>
                </g>
              </svg>
            `;
            
            buffer = await image
              .composite([{ input: Buffer.from(svgImage), gravity: 'center' }])
              .webp({ quality: 85 })
              .toBuffer();
              
            const fileName = `retro-${listing.id}-${Date.now()}.webp`;
            const uploadResult = await uploadToR2(buffer, fileName, 'image/webp');
            newPhotos.push(uploadResult.url);
            updated = true;
            processedCount++;
          } else {
            newPhotos.push(photoUrl);
          }
        } catch (e) {
          console.error(`Error processing ${photoUrl}:`, e);
          newPhotos.push(photoUrl);
          failedCount++;
        }
      }
      
      if (updated) {
        await db.listing.update({
          where: { id: listing.id },
          data: { photos: JSON.stringify(newPhotos) }
        });
      }
    }

    return NextResponse.json({ success: true, processedCount, failedCount });
  } catch (error) {
    console.error("Retro watermark error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
