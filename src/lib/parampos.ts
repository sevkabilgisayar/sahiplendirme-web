import crypto from 'crypto';

export const PARAM_CONFIG = {
  CLIENT_CODE: '159792',
  CLIENT_USERNAME: 'TP10176847',
  CLIENT_PASSWORD: '9E4BDAFC6DC251D6',
  GUID: '8DABA695-92B9-4EC0-A0C0-1882366F403D',
  ENDPOINT: 'https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx',
};

// Bu IP adresleri Param panelinden yetkilendirilmiştir:
// 37.205.4.247
// 37.205.0.49

/**
 * Param POS için SHA2B64 şifreleme fonksiyonu
 * Dökümantasyona göre format: Base64(SHA1(CLIENT_CODE + GUID + Taksit + Islem_Tutar + Toplam_Tutar + Siparis_ID + Hata_URL + Basarili_URL))
 */
export function generateParamHash(data: {
  taksit: string;
  islemTutar: string;
  toplamTutar: string;
  siparisId: string;
  hataUrl: string;
  basariliUrl: string;
}): string {
  const securityString = 
    PARAM_CONFIG.CLIENT_CODE + 
    PARAM_CONFIG.GUID + 
    data.taksit + 
    data.islemTutar + 
    data.toplamTutar + 
    data.siparisId + 
    data.hataUrl + 
    data.basariliUrl;

  return crypto.createHash('sha1').update(securityString).digest('base64');
}

/**
 * Ödeme isteği (Pos_Odeme) için XML payload'unu oluşturur
 */
export function buildPosOdemeXML(params: {
  krediKartiNo: string;
  sonKullanmaAy: string;
  sonKullanmaYil: string;
  cvv: string;
  taksit: string;
  islemTutar: string;
  toplamTutar: string;
  siparisId: string;
  islemAciklama: string;
  taksitSecenek?: string;
  hataUrl: string;
  basariliUrl: string;
}): string {
  const islemHash = generateParamHash({
    taksit: params.taksit,
    islemTutar: params.islemTutar,
    toplamTutar: params.toplamTutar,
    siparisId: params.siparisId,
    hataUrl: params.hataUrl,
    basariliUrl: params.basariliUrl
  });

  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Pos_Odeme xmlns="https://turkpos.com.tr/">
      <G>
        <CLIENT_CODE>${PARAM_CONFIG.CLIENT_CODE}</CLIENT_CODE>
        <CLIENT_USERNAME>${PARAM_CONFIG.CLIENT_USERNAME}</CLIENT_USERNAME>
        <CLIENT_PASSWORD>${PARAM_CONFIG.CLIENT_PASSWORD}</CLIENT_PASSWORD>
      </G>
      <GUID>${PARAM_CONFIG.GUID}</GUID>
      <KK_Sahibi>Musteri</KK_Sahibi>
      <KK_No>${params.krediKartiNo}</KK_No>
      <KK_SK_Ay>${params.sonKullanmaAy}</KK_SK_Ay>
      <KK_SK_Yil>${params.sonKullanmaYil}</KK_SK_Yil>
      <KK_CVC>${params.cvv}</KK_CVC>
      <KK_Sahibi_GSM></KK_Sahibi_GSM>
      <Hata_URL>${params.hataUrl}</Hata_URL>
      <Basarili_URL>${params.basariliUrl}</Basarili_URL>
      <Siparis_ID>${params.siparisId}</Siparis_ID>
      <Siparis_Aciklama>${params.islemAciklama}</Siparis_Aciklama>
      <Taksit>${params.taksit}</Taksit>
      <Islem_Tutar>${params.islemTutar}</Islem_Tutar>
      <Toplam_Tutar>${params.toplamTutar}</Toplam_Tutar>
      <Islem_Hash>${islemHash}</Islem_Hash>
      <Islem_Guvenlik_Tip>3D</Islem_Guvenlik_Tip>
      <Islem_ID></Islem_ID>
      <IPAdr>127.0.0.1</IPAdr>
      <Ref_URL>http://localhost:3000</Ref_URL>
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
}

export async function sendParamRequest(xmlPayload: string) {
  try {
    const response = await fetch(PARAM_CONFIG.ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'https://turkpos.com.tr/Pos_Odeme'
      },
      body: xmlPayload
    });

    const xmlResponse = await response.text();
    // In production, use xml2js to parse xmlResponse
    return xmlResponse;
  } catch (error) {
    console.error('Param POS isteği başarısız oldu:', error);
    throw error;
  }
}
