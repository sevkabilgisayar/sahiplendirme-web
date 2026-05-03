'use client';

interface SiteLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SiteLogo - Mükemmel SVG Kaynaşması
 * Font kaymalarını ve kopuk durmayı engellemek için "e" harfi ve 3 pati parmağı 
 * TEK BİR SVG kutusunun (viewBox) içinde piksel hassasiyetiyle birleştirildi.
 */
export default function SiteLogo({ size = 'md' }: SiteLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  
  // Ana metin boyutu
  const fsText = isSm ? 'text-[20px]' : isLg ? 'text-[36px]' : 'text-[28px]';
  
  // SVG'nin kapsayacağı alan boyutu (e harfinin kaplayacağı fiziksel alan)
  const svgWidth = isSm ? 22 : isLg ? 40 : 30;
  const svgHeight = isSm ? 28 : isLg ? 52 : 38;

  return (
    <div className={`flex items-baseline font-display font-extrabold tracking-tight ${fsText}`}>
      {/* Mavi Kısım */}
      <span className="text-[#155294]">sahiplendirm</span>

      {/* 
        Turuncu Kısım: e harfi + 3 Parmak (Tamamen tek SVG içinde)
        Bu sayede aralarında asla boşluk oluşmaz, havada uçuşmazlar.
      */}
      <svg 
        width={svgWidth} 
        height={svgHeight} 
        viewBox="0 0 100 135" 
        className="text-[#f38118]"
        // Yazı ile aynı alt çizgiye (baseline) oturması için ince ayar
        style={{ transform: 'translateY(14%)', marginLeft: '0.5px' }} 
        aria-hidden="true"
      >
        {/* Sol Parmak - Sola Eğik */}
        <ellipse cx="26" cy="45" rx="12" ry="18" transform="rotate(-25 26 45)" fill="currentColor" />
        
        {/* Orta Parmak - Daha uzun ve dik */}
        <ellipse cx="50" cy="28" rx="14" ry="21" fill="currentColor" />
        
        {/* Sağ Parmak - Sağa Eğik */}
        <ellipse cx="74" cy="45" rx="12" ry="18" transform="rotate(25 74 45)" fill="currentColor" />
        
        {/* e harfinin kendisi - Parmakların tam altına yapışık */}
        <text 
          x="50" 
          y="125" 
          fontSize="115" 
          fontWeight="900" 
          fontFamily="inherit" 
          fill="currentColor" 
          textAnchor="middle"
        >
          e
        </text>
      </svg>
    </div>
  );
}
