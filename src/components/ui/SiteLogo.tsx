'use client';

interface SiteLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function SiteLogo({ size = 'md' }: SiteLogoProps) {
  const fontSizes: Record<string, number> = { sm: 18, md: 24, lg: 30 };
  const fs = fontSizes[size];

  // Paw toe dimensions scale with font size
  const toeW = Math.round(fs * 0.18);
  const toeH = Math.round(fs * 0.25);
  const toeGap = Math.round(fs * 0.05);
  const toeOffset = Math.round(fs * 0.28); // how far above the letter

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        lineHeight: 1,
        fontWeight: 900,
        letterSpacing: '-0.01em',
        overflow: 'visible',
      }}
    >
      {/* sahiplendirm — dark blue */}
      <span style={{ color: '#155294', fontSize: fs }}>sahiplendirm</span>

      {/* e — orange, with paw toes above */}
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          overflow: 'visible',
          color: '#f38118',
          fontSize: fs,
          // extra top padding so toes don't get clipped by parent flex
          paddingTop: toeOffset + toeH + 2,
          marginTop: -(toeOffset + toeH + 2),
        }}
      >
        {/* Three paw toes — left, center, right */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'flex-end',
            gap: toeGap,
            marginBottom: 2,
            overflow: 'visible',
          }}
        >
          {/* Left toe — shorter, angled left */}
          <span
            style={{
              display: 'block',
              width: toeW,
              height: toeH - 1,
              background: '#f38118',
              borderRadius: '50%',
              transform: 'rotate(-18deg)',
              marginBottom: 1,
            }}
          />
          {/* Center toe — tallest */}
          <span
            style={{
              display: 'block',
              width: toeW + 1,
              height: toeH + 2,
              background: '#f38118',
              borderRadius: '50%',
            }}
          />
          {/* Right toe — shorter, angled right */}
          <span
            style={{
              display: 'block',
              width: toeW,
              height: toeH - 1,
              background: '#f38118',
              borderRadius: '50%',
              transform: 'rotate(18deg)',
              marginBottom: 1,
            }}
          />
        </span>

        {/* The letter itself */}
        e
      </span>
    </span>
  );
}
