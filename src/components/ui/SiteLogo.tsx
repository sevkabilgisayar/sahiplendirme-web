'use client';

interface SiteLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SiteLogo - "Farklı Metod"
 * "sahiplendirm" kelimesi normal yazılır.
 * "e" harfi bir pati yastığı (pad) gibi davranır,
 * Üstüne gerçek organik 4 adet pati parmağı (toes) SVG olarak eklenir.
 * Bu sayede "e" harfi komple bir pati figürüne dönüşür.
 */
export default function SiteLogo({ size = 'md' }: SiteLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  
  // Metin boyutları
  const fsText = isSm ? 'text-[20px]' : isLg ? 'text-[36px]' : 'text-[28px]';
  // Parmak SVG genişliği - e harfinin genişliğine uygun olacak şekilde
  const toesWidth = isSm ? 16 : isLg ? 30 : 22;
  const toesHeight = toesWidth * 0.55; // Orantılı yükseklik

  return (
    <div className={`flex items-end font-display font-extrabold tracking-tight ${fsText}`}>
      {/* Mavi Kısım */}
      <span className="text-[#155294] leading-none">sahiplendirm</span>

      {/* Turuncu Pati "e" */}
      <div className="flex flex-col items-center justify-end leading-none ml-[1px]">
        {/* 4 Organik Pati Parmağı (Toes) */}
        <svg 
          width={toesWidth} 
          height={toesHeight} 
          viewBox="0 0 24 16" 
          fill="currentColor" 
          className="text-[#f38118] z-10"
          style={{ marginBottom: '-8%' }} // Parmakları "e" harfine yaklaştırır
          aria-hidden="true"
        >
          {/* Gerçek pati parmak formları (organik damla şekli) */}
          <path d="M11 6c0-2.2-1.3-4-3-4S5 3.8 5 6s1.3 4 3 4 3-1.8 3-4Z" />
          <path d="M19 6c0-2.2-1.3-4-3-4s-3 1.8-3 4 1.3 4 3 4 3-1.8 3-4Z" />
          <path d="M7 14c0-2.2-1.3-4-3-4S1 11.8 1 14s1.3 4 3 4 3-1.8 3-4Z" />
          <path d="M23 14c0-2.2-1.3-4-3-4s-3 1.8-3 4 1.3 4 3 4 3-1.8 3-4Z" />
        </svg>
        
        {/* e harfi (Pati Yastığı rolünde) */}
        <span className="text-[#f38118] leading-[0.8]">e</span>
      </div>
    </div>
  );
}
