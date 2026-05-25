import { NextRequest, NextResponse } from 'next/server';
import { buildPosOdemeXML, sendParamRequest } from '@/lib/parampos';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Güvenlik ve IP yetkilendirmesi Param sunucusunda yapıldığı için,
    // Sunucumuz 37.205.4.247 ve 37.205.0.49 IP'lerinde çalışırken 
    // Param servisleri bu isteklere otomatik izin verecektir.

    const xmlPayload = buildPosOdemeXML({
      krediKartiNo: body.krediKartiNo || '5549000000000000',
      sonKullanmaAy: body.sonKullanmaAy || '12',
      sonKullanmaYil: body.sonKullanmaYil || '2030',
      cvv: body.cvv || '123',
      taksit: '1',
      islemTutar: body.tutar?.toString() || '10.00',
      toplamTutar: body.tutar?.toString() || '10.00',
      siparisId: `ORD-${Date.now()}`,
      islemAciklama: 'Sahiplendirme Sepet Odeme',
      hataUrl: 'http://localhost:3000/odeme-hata',
      basariliUrl: 'http://localhost:3000/odeme-basarili',
    });

    const paramResponse = await sendParamRequest(xmlPayload);

    // Param'dan dönen XML yanıtını parse edip frontend'e dönüyoruz
    // Genellikle başarılı 3D işlemi için dönen UCD_URL'ye yönlendirme yapılır.
    return NextResponse.json({ 
      success: true, 
      message: 'Ödeme isteği oluşturuldu', 
      rawResponse: paramResponse 
    });

  } catch (error: any) {
    console.error('Ödeme hatası:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
