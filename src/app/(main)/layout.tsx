import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileAppHeader from '@/components/layout/MobileAppHeader';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Sahiplendirme.com — Türkiye\'nin Hayvan Sahiplendirme Platformu',
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile App Header */}
      <MobileAppHeader />

      {/* Main content */}
      <main className="min-h-[calc(100vh-4rem)] md:pt-0 pt-[104px]">{children}</main>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </>
  );
}
