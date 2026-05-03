'use client';

interface SiteLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SiteLogo - "Kırılmaz" Flex-Col Versiyonu
 * absolute position kullanılmaz. Parmaklar ve "e" harfi flex-col ile alt alta dizilir.
 * Aradaki boşluk, line-height ezilerek ve negatif margin kullanılarak sıfırlanır.
 * Böylece tarayıcı uyumsuzlukları ve yukarı fırlama hataları %100 engellenir.
 */
export default function SiteLogo({ size = 'md' }: SiteLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  
  // Ana metin boyutu
  const fsText = isSm ? 'text-[20px]' : isLg ? 'text-[36px]' : 'text-[28px]';

  return (
    <div className={`flex items-center font-display font-extrabold tracking-tight ${fsText}`}>
      {/* Mavi Kısım */}
      <span className="text-[#155294]">sahiplendirm</span>
      
      {/* Tire (-) */}
      <span className="text-[#155294] mx-[4px] mt-[1px]">-</span>

      {/* Pati 'e' Kombinasyonu */}
      <div className="inline-flex flex-col items-center justify-end">
        {/* Parmaklar (Daha büyük ve daha belirgin) */}
        <svg 
          viewBox="0 0 24 16" 
          className="text-[#f38118] fill-current"
          style={{ 
            width: '1.05em',     // Genişlik artırıldı
            height: '0.75em',    // Yükseklik artırıldı
            // Parmaklar harfin içine çok gömülmesin, tam üstünde belirgin dursun
            marginBottom: '-0.15em', 
            zIndex: 10
          }}
          aria-hidden="true"
        >
          {/* Pati Parmakları (Toes) */}
          <path d="M11 6c0-2.2-1.3-4-3-4S5 3.8 5 6s1.3 4 3 4 3-1.8 3-4Z" />
          <path d="M19 6c0-2.2-1.3-4-3-4s-3 1.8-3 4 1.3 4 3 4 3-1.8 3-4Z" />
          <path d="M7 14c0-2.2-1.3-4-3-4S1 11.8 1 14s1.3 4 3 4 3-1.8 3-4Z" />
          <path d="M23 14c0-2.2-1.3-4-3-4s-3 1.8-3 4 1.3 4 3 4 3-1.8 3-4Z" />
        </svg>
        
        {/* 'e' harfi */}
        {/* leading-[0.7] (line-height) ile fontun kendi üst boşluğunu kesiyoruz */}
        <span className="text-[#f38118] leading-[0.7]">e</span>
      </div>
    </div>
  );
}
