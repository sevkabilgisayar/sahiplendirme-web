import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/settings
export async function GET() {
  try {
    const settings = await db.siteSetting.upsert({
      where: { id: 'singleton' },
      update: {},
      create: { id: 'singleton' },
    });
    
    // Yalnızca public olan (gizlilik içermeyen) verileri dönüyoruz
    const publicSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      siteUrl: settings.siteUrl,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      footerText: settings.footerText,
      metaTitle: settings.metaTitle,
      metaDescription: settings.metaDescription,
      metaKeywords: settings.metaKeywords,
      ogImageUrl: settings.ogImageUrl,
      googleAnalyticsId: settings.googleAnalyticsId,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      contactAddress: settings.contactAddress,
      instagramUrl: settings.instagramUrl,
      twitterUrl: settings.twitterUrl,
      facebookUrl: settings.facebookUrl,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMsg: settings.maintenanceMsg,
      allowNewRegistrations: settings.allowNewRegistrations,
    };

    return NextResponse.json(publicSettings);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Ayarlar alınamadı' }, { status: 500 });
  }
}
