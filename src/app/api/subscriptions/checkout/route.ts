import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await db.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const { services, cycle, amount, card, billing } = await req.json();

    if (!services || !services.length || !amount || !card || !billing) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    // Fatura bilgilerini JSON olarak kaydet
    const billingInfoStr = JSON.stringify(billing);

    // Siparişi veritabanına kaydet
    const order = await db.order.create({
      data: {
        totalAmount: amount,
        status: "bekliyor",
        billingInfo: billingInfoStr,
        userId: user.id
      }
    });

    // 1. Param POS API Entegrasyonu
    const CLIENT_CODE = process.env.PARAM_CLIENT_CODE || '';
    const CLIENT_USERNAME = process.env.PARAM_CLIENT_USERNAME || '';
    const CLIENT_PASSWORD = process.env.PARAM_CLIENT_PASSWORD || '';
    const GUID = process.env.PARAM_GUID || '';

    let paramHtmlOrStatus = '';
    
    // Yalnızca production'da veya GUID doluysa gerçek istek at
    if (GUID) {
      // Clean up data for Param POS
      const cleanCardNumber = card.number.replace(/\s+/g, '');
      const formattedAmount = Number(amount).toFixed(2).replace('.', ',');
      const crypto = require('crypto');
      const siparis_ID = order.id.replace(/-/g, '').substring(0, 20);
      
      const expMonth = card.expire.split('/')[0].trim();
      const expYearStr = card.expire.split('/')[1].trim();
      const expYear = expYearStr.length === 2 ? '20' + expYearStr : expYearStr;

      const errorUrl = 'https://sahiplendirme.com/api/payment/error';
      // Hash hesaplamasında orijinal URL, XML'de ise &amp; ile encode edilmiş URL kullanılır
      const rawSuccessUrl = `https://sahiplendirme.com/api/payment/success?userId=${user.id}&cycle=${cycle}&services=${services.join(',')}&orderId=${order.id}`;
      const xmlSuccessUrl = `https://sahiplendirme.com/api/payment/success?userId=${user.id}&amp;cycle=${cycle}&amp;services=${services.join(',')}&amp;orderId=${order.id}`;

      // CLIENT_CODE + GUID + Taksit + Islem_Tutar + Toplam_Tutar + Siparis_ID + Error_URL + Success_URL
      const securityString = CLIENT_CODE + GUID + '1' + formattedAmount + formattedAmount + siparis_ID + errorUrl + rawSuccessUrl;
      const hash = crypto.createHash('sha1').update(securityString).digest('base64');

      const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Pos_Odeme xmlns="https://turkpos.com.tr/">
      <G>
        <CLIENT_CODE>${CLIENT_CODE}</CLIENT_CODE>
        <CLIENT_USERNAME>${CLIENT_USERNAME}</CLIENT_USERNAME>
        <CLIENT_PASSWORD>${CLIENT_PASSWORD}</CLIENT_PASSWORD>
      </G>
      <GUID>${GUID}</GUID>
      <KK_Sahibi>${card.holder}</KK_Sahibi>
      <KK_No>${cleanCardNumber}</KK_No>
      <KK_SK_Ay>${expMonth}</KK_SK_Ay>
      <KK_SK_Yil>${expYear}</KK_SK_Yil>
      <KK_CVC>${card.cvc}</KK_CVC>
      <Error_URL>${errorUrl}</Error_URL>
      <Success_URL>${xmlSuccessUrl}</Success_URL>
      <Siparis_ID>${siparis_ID}</Siparis_ID>
      <Siparis_Aciklama>Sahiplendirme Abonelik Odeme</Siparis_Aciklama>
      <Taksit>1</Taksit>
      <Islem_Tutar>${formattedAmount}</Islem_Tutar>
      <Toplam_Tutar>${formattedAmount}</Toplam_Tutar>
      <Islem_Hash>${hash}</Islem_Hash>
      <Islem_Guvenlik_Tip>3D</Islem_Guvenlik_Tip>
      <IPAdr>127.0.0.1</IPAdr>
    </Pos_Odeme>
  </soap:Body>
</soap:Envelope>`;

      try {
        const URL = 'https://pos.param.com.tr/turkpos.ws/service_turkpos_prod.asmx';
        const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': 'https://turkpos.com.tr/Pos_Odeme'
          },
          body: xml
        });
        
        paramHtmlOrStatus = await response.text();
        console.log("PARAM POS YANITI:", paramHtmlOrStatus.substring(0, 300) + '...');
        
        // Basit kontrol: Hata döndüyse fırlat
        if (paramHtmlOrStatus.includes("<Sonuc>-1</Sonuc>")) {
          return NextResponse.json({ error: 'Kredi kartı reddedildi veya geçersiz.' }, { status: 400 });
        }

        // UCD_HTML tag'ini bul ve Base64'ten çöz
        const ucdMatch = paramHtmlOrStatus.match(/<UCD_HTML>(.*?)<\/UCD_HTML>/);
        if (ucdMatch && ucdMatch[1]) {
          const base64Html = ucdMatch[1];
          const decodedHtml = Buffer.from(base64Html, 'base64').toString('utf-8');
          
          return NextResponse.json({ 
            success: true, 
            message: '3D Secure yönlendirmesi',
            html: decodedHtml 
          });
        } else {
          return NextResponse.json({ error: 'Ödeme alınamadı, lütfen kart bilgilerinizi kontrol edin.' }, { status: 400 });
        }
      } catch (err) {
        console.error("Param POS Hatası:", err);
        return NextResponse.json({ error: 'Ödeme sistemi ile bağlantı kurulamadı.' }, { status: 500 });
      }
    } else {
       return NextResponse.json({ error: 'Sistem Hatası: Param POS kimlik bilgileri bulunamadı.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Subscription Checkout Error:', error);
    return NextResponse.json({ error: 'Ödeme işlemi sırasında bir hata oluştu' }, { status: 500 });
  }
}
