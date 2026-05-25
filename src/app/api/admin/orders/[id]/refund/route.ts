import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | any }
) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.role !== 'admin' && decoded.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    // ------------------------------------------------------------------
    // PARAM POS GERÇEK İADE ENTEGRASYON YAPI İSKELETİ (DETAYLI)
    // ------------------------------------------------------------------
    const PARAM_CLIENT_CODE = process.env.PARAM_CLIENT_CODE || '';
    const PARAM_CLIENT_USERNAME = process.env.PARAM_CLIENT_USERNAME || '';
    const PARAM_CLIENT_PASSWORD = process.env.PARAM_CLIENT_PASSWORD || '';
    const PARAM_GUID = process.env.PARAM_GUID || '';

    // Gerçek bir entegrasyonda burada SHA1 Security String oluşturulur.
    
    const refundRequestPayload = {
      G: {
        CLIENT_CODE: PARAM_CLIENT_CODE,
        CLIENT_USERNAME: PARAM_CLIENT_USERNAME,
        CLIENT_PASSWORD: PARAM_CLIENT_PASSWORD,
      },
      GUID: PARAM_GUID,
      Durum: 'IADE',
      Siparis_ID: orderId
    };

    if (PARAM_CLIENT_CODE && PARAM_GUID) {
      /* 
      const response = await fetch('https://test-api.param.com.tr/turkpos.ws/service_turkpos_test.asmx', {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: buildXmlBody(refundRequestPayload)
      });
      */
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Param POS İade Simüle Edildi:', refundRequestPayload);
    }
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: 'iptal_edildi' }
    });

    await db.adminLog.create({
      data: {
        actionType: 'WARNING',
        message: `${orderId} numaralı sipariş iptal/iade edildi.`,
        adminEmail: decoded.email || 'admin'
      }
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
