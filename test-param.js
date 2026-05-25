const crypto = require('crypto');

const CLIENT_CODE = '159792';
const CLIENT_USERNAME = 'TP10176847';
const CLIENT_PASSWORD = '9E4BDAFC6DC251D6';
const GUID = '8DABA695-92B9-4EC0-A0C0-1882366F403D';
const URL = 'https://dev.param.com.tr/turkpos.ws/service_turkpos_prod.asmx'; // Dev endpoint

const securityString = CLIENT_CODE + GUID + '1' + '10.00' + '10.00' + 'TEST-123' + 'http://localhost/hata' + 'http://localhost/basari';
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
      <KK_Sahibi>Test Musteri</KK_Sahibi>
      <KK_No>5549000000000000</KK_No>
      <KK_SK_Ay>12</KK_SK_Ay>
      <KK_SK_Yil>2030</KK_SK_Yil>
      <KK_CVC>123</KK_CVC>
      <KK_Sahibi_GSM></KK_Sahibi_GSM>
      <Hata_URL>http://localhost/hata</Hata_URL>
      <Basarili_URL>http://localhost/basari</Basarili_URL>
      <Siparis_ID>TEST-123</Siparis_ID>
      <Siparis_Aciklama>Test</Siparis_Aciklama>
      <Taksit>1</Taksit>
      <Islem_Tutar>10.00</Islem_Tutar>
      <Toplam_Tutar>10.00</Toplam_Tutar>
      <Islem_Hash>${hash}</Islem_Hash>
      <Islem_Guvenlik_Tip>3D</Islem_Guvenlik_Tip>
      <Islem_ID></Islem_ID>
      <IPAdr>127.0.0.1</IPAdr>
      <Ref_URL>http://localhost</Ref_URL>
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

fetch(URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': 'https://turkpos.com.tr/Pos_Odeme'
  },
  body: xml
}).then(res => res.text()).then(console.log).catch(console.error);
