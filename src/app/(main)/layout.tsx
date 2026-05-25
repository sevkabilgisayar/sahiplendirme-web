import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sahiplendirme.com — Türkiye\'nin Hayvan Sahiplendirme Platformu',
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  );
}
