import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('auth_token')?.value;
    const bearerToken = req.headers.get('Authorization')?.split(' ')[1];
    const token = cookieToken || bearerToken;

    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string, id?: string };
    const userId = decoded.userId || decoded.id;
    
    const body = await req.json();
    const { items, totalAmount } = body;

    // ------------------------------------------------------------------
    // PARAM POS GERÇEK ÖDEME ENTEGRASYON YAPI İSKELETİ (DETAYLI)
    // ------------------------------------------------------------------
    const PARAM_CLIENT_CODE = process.env.PARAM_CLIENT_CODE || '';
    const PARAM_CLIENT_USERNAME = process.env.PARAM_CLIENT_USERNAME || '';
    const PARAM_CLIENT_PASSWORD = process.env.PARAM_CLIENT_PASSWORD || '';
    const PARAM_GUID = process.env.PARAM_GUID || '';

    let paramHtmlOrStatus = '';

    if (PARAM_CLIENT_CODE && PARAM_GUID) {
      const crypto = require('crypto');
      const siparis_ID = 'ORD-' + Date.now();
      const tutar = totalAmount.toFixed(2); // e.g. "10.00"
      
      const successUrl = process.env.NEXT_PUBLIC_APP_URL + '/magaza/odeme-basarili';
      const failUrl = process.env.NEXT_PUBLIC_APP_URL + '/magaza/odeme-hata';
      
      const securityString = PARAM_CLIENT_CODE + PARAM_GUID + '1' + tutar + tutar + siparis_ID + failUrl + successUrl;
      const hash = crypto.createHash('sha1').update(securityString).digest('base64');
      
      const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Pos_Odeme xmlns="https://turkpos.com.tr/">
      <G>
        <CLIENT_CODE>\${PARAM_CLIENT_CODE}</CLIENT_CODE>
        <CLIENT_USERNAME>\${PARAM_CLIENT_USERNAME}</CLIENT_USERNAME>
        <CLIENT_PASSWORD>\${PARAM_CLIENT_PASSWORD}</CLIENT_PASSWORD>
      </G>
      <GUID>\${PARAM_GUID}</GUID>
      <KK_Sahibi>\${body.cardHolder || 'Müşteri'}</KK_Sahibi>
      <KK_No>\${body.cardNumber || '5549000000000000'}</KK_No>
      <KK_SK_Ay>\${body.expMonth || '12'}</KK_SK_Ay>
      <KK_SK_Yil>\${body.expYear || '2030'}</KK_SK_Yil>
      <KK_CVC>\${body.cvc || '123'}</KK_CVC>
      <KK_Sahibi_GSM></KK_Sahibi_GSM>
      <Hata_URL>\${failUrl}</Hata_URL>
      <Basarili_URL>\${successUrl}</Basarili_URL>
      <Siparis_ID>\${siparis_ID}</Siparis_ID>
      <Siparis_Aciklama>Sahiplendirme Siparişi</Siparis_Aciklama>
      <Taksit>1</Taksit>
      <Islem_Tutar>\${tutar}</Islem_Tutar>
      <Toplam_Tutar>\${tutar}</Toplam_Tutar>
      <Islem_Hash>\${hash}</Islem_Hash>
      <Islem_Guvenlik_Tip>3D</Islem_Guvenlik_Tip>
      <Islem_ID></Islem_ID>
      <IPAdr>127.0.0.1</IPAdr>
      <Ref_URL>\${process.env.NEXT_PUBLIC_APP_URL}</Ref_URL>
      <Data1></Data1>
      <Data2></Data2>
      <Data3></Data3>
      <Data4></Data4>
      <Data5></Data5>
      <Data6></Data6>
      <Data7></Data7>
      <Data8></Data8>
      <Data9></Data9>
      <Data10></Data10>
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
        
        if (paramHtmlOrStatus.includes("<Sonuc>-1</Sonuc>")) {
          return NextResponse.json({ error: 'Kredi kartı reddedildi veya geçersiz.' }, { status: 400 });
        }

        const ucdMatch = paramHtmlOrStatus.match(/<UCD_HTML>(.*?)<\/UCD_HTML>/);
        if (ucdMatch && ucdMatch[1]) {
          const base64Html = ucdMatch[1];
          paramHtmlOrStatus = Buffer.from(base64Html, 'base64').toString('utf-8');
        } else {
          return NextResponse.json({ error: 'Ödeme alınamadı.' }, { status: 400 });
        }
      } catch (err) {
        console.error("Param POS Hatası:", err);
      }
    } else {
      // Simülasyon
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log("[TEST MODE] Param POS ödemesi simüle edildi.");
    }

    const newOrder = await db.order.create({
      data: {
        userId: userId as string,
        totalAmount,
        status: 'hazirlaniyor',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    // Create a notification for the user
    await db.notification.create({
      data: {
        userId: decoded.userId,
        type: 'order_status',
        content: `Siparişiniz alındı (Sipariş No: ${newOrder.id.slice(0, 8).toUpperCase()}).`
      }
    });

    return NextResponse.json({ 
      success: true, 
      order: newOrder,
      paymentResultHtml: paramHtmlOrStatus
    });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası veya geçersiz oturum' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('auth_token')?.value;
    const bearerToken = req.headers.get('Authorization')?.split(' ')[1];
    const token = cookieToken || bearerToken;

    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string, id?: string };
    const userId = decoded.userId || decoded.id;

    const orders = await db.order.findMany({
      where: { userId: userId as string },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
