'use client';

interface SiteLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SiteLogo - Mükemmel CSS Relative/Absolute + Tireli Versiyon
 * "sahiplendirm - e" şeklinde yazılır.
 * "e" harfinin font yapısı bozulmaz, üzerine 'em' birimleri kullanılarak 
 * mükemmel ölçeklenen SVG pati parmakları yerleştirilir.
 */
export default function SiteLogo({ size = 'md' }: SiteLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  
  // Ana metin boyutu
  const fsText = isSm ? 'text-[20px]' : isLg ? 'text-[36px]' : 'text-[28px]';

  return (
    <div className={`flex items-baseline font-display font-extrabold tracking-tight ${fsText}`}>
      {/* Mavi Kısım */}
      <span className="text-[#155294]">sahiplendirm</span>
      
      {/* Tire (-) */}
      <span className="text-[#155294] mx-[3px]">-</span>

      {/* 
        Turuncu "e" ve Pati Parmakları 
        Relative container sayesinde parmaklar harfe göre % ve em ile konumlanır, 
        ekran küçülse/büyüse bile asla kaymaz.
      */}
      <span className="text-[#f38118] relative inline-flex justify-center">
        e
        <svg 
          viewBox="0 0 24 16" 
          className="absolute text-[#f38118] fill-current pointer-events-none"
          style={{ 
            width: '0.8em',      // Harfin boyutuna göre orantılı genişlik
            height: '0.55em',    // Harfin boyutuna göre orantılı yükseklik
            top: '-0.38em',      // Harfin tam kavisinin üzerine oturacak kadar yukarı
            left: '50%', 
            transform: 'translateX(-50%)' 
          }}
          aria-hidden="true"
        >
          {/* Pati Parmakları (Toes) */}
          <path d="M11 6c0-2.2-1.3-4-3-4S5 3.8 5 6s1.3 4 3 4 3-1.8 3-4Z" />
          <path d="M19 6c0-2.2-1.3-4-3-4s-3 1.8-3 4 1.3 4 3 4 3-1.8 3-4Z" />
          <path d="M7 14c0-2.2-1.3-4-3-4S1 11.8 1 14s1.3 4 3 4 3-1.8 3-4Z" />
          <path d="M23 14c0-2.2-1.3-4-3-4s-3 1.8-3 4 1.3 4 3 4 3-1.8 3-4Z" />
        </svg>
      </span>
    </div>
  );
}
