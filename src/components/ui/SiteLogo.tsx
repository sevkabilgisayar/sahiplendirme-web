'use client';

interface SiteLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Logo: "sahiplendirme" — mavi + turuncu "e" pati şekliyle
 * Pati parmakları "e"nin x-yüksekliği içinde konumlandırılır,
 * header overflow sorununu önlemek için SVG kullanılır.
 */
export default function SiteLogo({ size = 'md' }: SiteLogoProps) {
  const fs = size === 'sm' ? 18 : size === 'lg' ? 32 : 24;

  // Parmak boyutları font boyutuyla orantılı
  const toeRx = fs * 0.085;   // yatay yarıçap
  const toeRy = fs * 0.13;    // dikey yarıçap
  const gap   = fs * 0.07;    // parmaklararası boşluk

  // "e" harfi SVG içinde çizilir — x-yüksekliği yaklaşık %68
  const eH     = fs;           // SVG yüksekliği = font boyutu
  const eBaseY = eH;           // baseline SVG'nin altında

  // 3 parmak merkezi — "e"nin üst kenarına oturur
  const xMid   = toeRx * 2 + gap; // "e"nin genişliğinin yaklaşık yarısı
  const toeTop = toeRy + 1;       // SVG üstünden biraz içeride

  const toe1 = { cx: xMid - toeRx - gap, cy: toeTop + 1, rot: -18 };
  const toe2 = { cx: xMid,               cy: toeTop - 1, rot: 0   };
  const toe3 = { cx: xMid + toeRx + gap, cy: toeTop + 1, rot: 18  };

  const svgW = fs * 0.64; // "e" harfinin genişliği

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: '-0.01em',
      }}
    >
      {/* Mavi kısım */}
      <span style={{ color: '#155294', fontSize: fs, fontFamily: 'inherit' }}>
        sahiplendirm
      </span>

      {/* Turuncu "e" + pati parmakları — SVG ile kesin konum */}
      <svg
        width={svgW + 4}
        height={eH + toeRy * 2 + 2}
        viewBox={`0 0 ${svgW + 4} ${eH + toeRy * 2 + 2}`}
        style={{
          display: 'inline-block',
          verticalAlign: 'text-bottom',
          overflow: 'visible',
          marginLeft: -1,
          marginBottom: 0,
        }}
        aria-hidden
      >
        {/* Pati parmakları */}
        {[toe1, toe2, toe3].map((t, i) => (
          <ellipse
            key={i}
            cx={t.cx}
            cy={t.cy + toeRy + 1}
            rx={toeRx}
            ry={toeRy}
            fill="#f38118"
            transform={`rotate(${t.rot}, ${t.cx}, ${t.cy + toeRy + 1})`}
          />
        ))}

        {/* "e" harfi */}
        <text
          x={0}
          y={eH + toeRy * 2 + 1}
          fill="#f38118"
          fontFamily="inherit"
          fontWeight={900}
          fontSize={fs}
        >
          e
        </text>
      </svg>
    </span>
  );
}
