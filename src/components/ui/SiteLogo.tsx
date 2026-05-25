'use client';

import Image from 'next/image';

interface SiteLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * SiteLogo - Resim (Image) Versiyonu
 * Kullanıcının kendi tasarladığı 'logo.png' görselini kullanır.
 * Kod karmaşasından ve CSS hizalama hatalarından tamamen kurtarır.
 */
export default function SiteLogo({ size = 'md' }: SiteLogoProps) {
  // Logonun boyutlarını büyüttük (slogan okunur olsun diye)
  const width = size === 'sm' ? 200 : size === 'lg' ? 400 : size === 'xl' ? 550 : 320;
  
  // Aspect ratio'ya uygun yeni yükseklikler
  const height = size === 'sm' ? 65 : size === 'lg' ? 130 : size === 'xl' ? 180 : 100;

  return (
    <div className="flex items-center">
      <img 
        src="/logo.png" 
        alt="Sahiplendirme.com Logo" 
        style={{ height: `${height}px`, width: 'auto', maxWidth: 'none' }}
        className="object-contain"
      />
    </div>
  );
}
