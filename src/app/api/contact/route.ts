import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Lütfen zorunlu alanları doldurun.' }, { status: 400 });
    }

    // SMTP yapılandırması (Gelecekte .env dosyasından çekilebilir)
    // Şimdilik .env'de varsa kullanır, yoksa hata vermez ama göndermez (test amaçlı)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465 || process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Sahiplendirme İletişim Formu" <${process.env.SMTP_USER}>`,
      to: 'info@sahiplendirme.com',
      subject: `İletişim Formu: ${subject}`,
      text: `
Sahiplendirme.com iletişim formundan yeni bir mesaj aldınız.

Ad Soyad: ${name}
E-Posta: ${email}
Telefon: ${phone || 'Belirtilmedi'}
Konu: ${subject}

Mesaj:
${message}
      `,
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
  <h2 style="color: #ff5a5f;">Yeni İletişim Mesajı</h2>
  <p>Sahiplendirme.com iletişim formundan yeni bir mesaj aldınız.</p>
  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Ad Soyad:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td></tr>
    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>E-Posta:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Telefon:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || 'Belirtilmedi'}</td></tr>
    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Konu:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${subject}</td></tr>
  </table>
  <h3 style="margin-top: 20px;">Mesaj İçeriği:</h3>
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
</div>
      `,
    };

    // Eğer SMTP tanımlıysa gönderimi yap
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn("SMTP_USER veya SMTP_PASS tanımlı olmadığı için e-posta gerçekten gönderilmedi. Test ortamı sayıldı.");
      // Prod'da uyarı verilebilir veya veritabanına loglanabilir.
    }

    return NextResponse.json({ success: true, message: 'Mesajınız başarıyla gönderildi.' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Mesaj gönderilirken bir hata oluştu.' }, { status: 500 });
  }
}
