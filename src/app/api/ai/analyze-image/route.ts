import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Görsel gerekli' }, { status: 400 });
    }

    // Dosyayı base64'e çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: `Bu fotoğraftaki hayvanı analiz et ve şu bilgileri JSON formatında ver:
{
  "hayvanTuru": "Kedi/Köpek/Kuş/Diğer",
  "anaIrk": "En olası ırk adı (Türkçe)",
  "guvenSkor": 0-100 arası sayı,
  "alternatifIrklar": [
    {"irk": "İsim", "oran": 0-100},
    {"irk": "İsim", "oran": 0-100}
  ],
  "ozellikler": ["Kısa tüy", "Mavi göz", "vb."],
  "genelBilgi": "Bu ırk hakkında 2 cümle kısa bilgi.",
  "sahiplendirmeBilgisi": "Bu ırk için yaşam koşulları ve bakım ipucu (1-2 cümle)."
}

Sadece JSON döndür, başka açıklama ekleme.`,
            },
          ],
        },
      ],
      max_tokens: 600,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'Analiz yapılamadı' }, { status: 500 });
    }

    // JSON parse et
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Analiz sonucu işlenemedi' }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('Image Analysis Error:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: 'Görsel analizi yapılamadı. Lütfen daha net bir fotoğraf deneyin.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
