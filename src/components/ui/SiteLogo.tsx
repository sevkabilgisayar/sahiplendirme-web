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
  // Logonun genişlik boyutlarını prop'a göre ayarlıyoruz
  // Slogan (Yaşamak güzeldir...) olduğu için biraz daha geniş tutmak iyi olur
  const width = size === 'sm' ? 150 : size === 'lg' ? 260 : 200;
  
  // Aspect ratio'nun korunması için yaklaşık height (Görsel otomatik oranlanır)
  const height = size === 'sm' ? 50 : size === 'lg' ? 86 : 66;

  return (
    <div className="flex items-center">
      <Image 
        src="/logo.png" 
        alt="Sahiplendirme.com Logo" 
        width={width} 
        height={height}
        className="object-contain"
        priority // Logonun gecikmeden (lazy load olmadan) anında yüklenmesi için
      />
    </div>
  );
}
