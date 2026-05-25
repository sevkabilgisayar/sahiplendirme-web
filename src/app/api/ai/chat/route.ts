import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Sen Sahiplendirme.com'un yapay zeka asistanısın. Türkiye'nin en büyük evcil hayvan sahiplendirme platformu için çalışıyorsun.

Görevlerin:
- Evcil hayvan bakımı, beslenmesi ve sağlığı hakkında Türkçe bilgi vermek
- Irk özellikleri ve ırk seçimi konusunda yardımcı olmak
- Kullanıcı eğer sahiplendirme, kayıp veya çiftleştirme ilanı arıyorsa "search_listings" fonksiyonunu kullanarak veritabanından GÜNCEL İLANLARI çekip ona sunmak.
- İlan önerirken mutlaka ilanın başlığını, cinsini, yaşını, şehrini ve ID'sini belirterek kullanıcıyı /ilan/[id] linkine yönlendirmek. Örn: [Max - Golden Retriever](/ilan/123)

Platform hakkında:
- Sahiplendirme, Kayıp, Çiftleştirme ilanları verilebilir
- Profesyonel hizmet verenler (veteriner, kuaför, eğitmen) kayıt olabilir

Önemli kurallar:
- Sadece Sahiplendirme.com ilanlarına ve özelliklerine yönlendir
- Acil sağlık durumlarında mutlaka "Hemen veterinere gidin!" de
- Samimi, kısa ve net bir dil kullan.`;

export async function POST(req: NextRequest) {
  try {
    const { message, mode, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 });
    }

    // Mod bazlı ek talimatlar
    const modeInstructions: Record<string, string> = {
      irk: 'Kullanıcı ırk tespiti veya ırk önerileri istiyor. Detaylı ırk bilgisi ver.',
      saglik: 'Kullanıcı sağlık konusunda soru soruyor. Semptomları değerlendir ama kesinlikle teşhis koyma, veterinere yönlendir.',
      eslestir: 'Kullanıcının yaşam koşullarını sorarak en uygun evcil hayvanı bul ve Sahiplendirme.com\'daki sahiplendirme ilanlarında arama yap.',
      genel: '',
    };

    const modeExtra = modeInstructions[mode] || '';

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + (modeExtra ? `\n\nŞu anki mod: ${modeExtra}` : ''),
      },
      // Konuşma geçmişi
      ...conversationHistory.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content || '',
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    const tools: OpenAI.ChatCompletionTool[] = [
      {
        type: "function",
        function: {
          name: "search_listings",
          description: "Kullanıcının aradığı kriterlere göre veritabanındaki aktif ilanları arar.",
          parameters: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "İlan kategorisi: 'sahiplendirme', 'kayip' veya 'ciftlestirme'."
              },
              animalType: {
                type: "string",
                description: "Hayvan türü: 'kopek', 'kedi' veya 'kus'."
              },
              city: {
                type: "string",
                description: "Şehir adı. Örneğin 'İstanbul', 'Ankara'."
              }
            }
          }
        }
      }
    ];

    let completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages,
      tools: tools,
      tool_choice: "auto",
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Tool çağrısı var mı kontrol et
    const responseMessage = completion.choices[0].message;
    
    if (responseMessage.tool_calls) {
      messages.push(responseMessage); // AI'ın tool çağırma niyetini geçmişe ekle
      
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === "search_listings") {
          const args = JSON.parse(toolCall.function.arguments);
          
          // Veritabanında arama yap
          const whereClause: any = { status: 'active' };
          if (args.category) whereClause.category = args.category;
          if (args.animalType) whereClause.animalType = args.animalType;
          if (args.city) whereClause.city = { contains: args.city, mode: 'insensitive' };
          
          const listings = await db.listing.findMany({
            where: whereClause,
            take: 5,
            select: {
              id: true,
              title: true,
              category: true,
              animalType: true,
              breed: true,
              age: true,
              city: true,
              price: true
            },
            orderBy: { createdAt: 'desc' }
          });
          
          // Sonuçları mesaja ekle
          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            content: JSON.stringify(listings.length > 0 ? listings : { error: "Kriterlere uygun ilan bulunamadı." }),
          });
        }
      }
      
      // AI'ı sonuçlarla tekrar çağır
      completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });
    }

    const finalResponse = completion.choices[0]?.message?.content;

    if (!finalResponse) {
      return NextResponse.json({ error: 'Yanıt alınamadı' }, { status: 500 });
    }

    return NextResponse.json({ response: finalResponse });
  } catch (error: unknown) {
    console.error('AI Chat Error:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json({ error: 'AI servisine çok fazla istek gönderildi.' }, { status: 429 });
      }
    }

    return NextResponse.json({ error: 'Bir hata oluştu. Lütfen tekrar deneyin.' }, { status: 500 });
  }
}
