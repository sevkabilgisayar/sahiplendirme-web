'use client';

import Image from 'next/image';

interface SiteLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SiteLogo - Resim (Image) Versiyonu
 * Kullanıcının kendi tasarladığı 'logo.png' görselini kullanır.
 * Kod karmaşasından ve CSS hizalama hatalarından tamamen kurtarır.
 */
export default function SiteLogo({ size = 'md' }: SiteLogoProps) {
  // Logonun boyutlarını büyüttük (slogan okunur olsun diye)
  const width = size === 'sm' ? 200 : size === 'lg' ? 400 : 320;
  
  // Aspect ratio'ya uygun yeni yükseklikler
  const height = size === 'sm' ? 65 : size === 'lg' ? 130 : 100;

  return (
    <div className="flex items-center">
      <Image 
        src="/logo.png" 
        alt="Sahiplendirme.com Logo" 
        width={width} 
        height={height}
        className="object-contain"
        priority // Logonun gecikmeden yüklenmesi için
      />
    </div>
  );
}
