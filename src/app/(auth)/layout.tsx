import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 gradient-brand relative overflow-hidden items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10 text-center text-white max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl">
              🐾
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold font-display">sahiplendirme.com</div>
            </div>
          </Link>

          {/* Animals emoji */}
          <div className="text-8xl mb-8 animate-float">🐶🐱🐦</div>

          <h2 className="text-3xl font-bold font-display mb-4">
            Bir hayatı değiştirme zamanı!
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Sahiplendirme, kayıp hayvan ve çiftleştirme ilanları için yapay zekâ destekli platformunuz.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-10 border-t border-white/20 pt-8">
            {[
              { v: '12K+', l: 'Mutlu Hayvan' },
              { v: '45K+', l: 'Üye' },
              { v: '200+', l: 'Barınak' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto p-6 sm:p-10 bg-[var(--background)]">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8 flex-shrink-0">
          <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center">
            <span className="text-lg">🐾</span>
          </div>
          <span className="text-xl font-bold font-display">
            <span className="text-gradient">sahiplendirme</span>.com
          </span>
        </Link>

        <div className="w-full max-w-[480px] py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
