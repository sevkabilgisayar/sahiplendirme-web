import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import AIChatFAB from '@/components/global/AIChatFAB';
import CookieConsent from '@/components/global/CookieConsent';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sahiplendirme.com — Köpek, Kedi ve Kuş Sahiplendirme Platformu',
    template: '%s | Sahiplendirme.com',
  },
  description:
    'Türkiye\'nin yapay zekâ destekli hayvan sahiplendirme platformu. Köpek, kedi ve kuş sahiplendirme ilanları, kayıp hayvan ihbarları, çiftleştirme ve profesyonel hizmetler.',
  keywords: ['sahiplendirme', 'köpek sahiplendirme', 'kedi sahiplendirme', 'kayıp hayvan', 'çiftleştirme', 'pet', 'hayvan'],
  authors: [{ name: 'Sahiplendirme.com' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://sahiplendirme.com',
    siteName: 'Sahiplendirme.com',
    title: 'Sahiplendirme.com — Köpek, Kedi ve Kuş Sahiplendirme Platformu',
    description: 'Türkiye\'nin yapay zekâ destekli hayvan sahiplendirme platformu.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sahiplendirme.com',
    description: 'Türkiye\'nin yapay zekâ destekli hayvan sahiplendirme platformu.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        {children}
        <AIChatFAB />
        <CookieConsent />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
            },
          }}
        />
      </body>
    </html>
  );
}
