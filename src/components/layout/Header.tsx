'use client';

import { cn } from '@/lib/utils';
import {
  Bell,
  Heart,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  User,
  ShoppingCart,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import SiteLogo from '../ui/SiteLogo';

const navLinks = [
  { href: '/ilanlar?kategori=sahiplendirme', label: 'Sahiplendirme', emoji: '🏠' },
  { href: '/ilanlar?kategori=kayip', label: 'Kayıp', emoji: '🔍' },
  { href: '/ilanlar?kategori=ciftlestirme', label: 'Çiftleştirme', emoji: '💕' },
  { href: '/hizmetler', label: 'Hizmetler', emoji: '⭐' },
  { href: '/magaza', label: 'Mağaza', emoji: '🛍️' },
];

// Mock auth state - will be replaced with real auth
const useAuth = () => ({
  user: { name: 'Ayşe Yılmaz', email: 'ayse@example.com' },
  isLoggedIn: true,
});

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll(); // İlk yüklemede scroll pozisyonunu kontrol et
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-[var(--surface)]/95 backdrop-blur-md shadow-sm border-b border-[var(--border)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center" style={{ overflow: 'visible' }}>
              <SiteLogo size="md" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary-dark)]'
                      : 'text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]'
                  )}
                >
                  <span>{link.emoji}</span>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">


              {/* Cart */}
              <Link
                href="/sepet"
                className="relative flex items-center justify-center w-9 h-9 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                <ShoppingCart size={18} />
                {/* Cart badge */}
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--surface)] text-white text-[9px] font-bold flex items-center justify-center">3</span>
              </Link>

              {isLoggedIn ? (
                <>
                  {/* Notifications */}
                  <Link
                    href="/bildirimler"
                    className="relative flex items-center justify-center w-9 h-9 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <Bell size={18} />
                    {/* Notification badge */}
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--danger)] rounded-full border-2 border-[var(--surface)] text-white text-[9px] font-bold flex items-center justify-center">2</span>
                  </Link>

                  {/* Messages */}
                  <Link
                    href="/profil/mesajlar"
                    className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <MessageCircle size={18} />
                  </Link>

                  {/* Create listing */}
                  <Link href="/ilan-ver">
                    <Button size="sm" variant="gradient" leftIcon={<Plus size={16} />} className="hidden sm:flex shadow-brand">
                      İlan Ver
                    </Button>
                  </Link>

                  {/* Profile dropdown */}
                  <Link href="/profil">
                    <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center cursor-pointer hover:shadow-brand transition-shadow">
                      <User size={18} className="text-white" />
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block whitespace-nowrap">
                    <Button variant="ghost" size="sm">Giriş Yap</Button>
                  </Link>
                  <Link href="/register" className="whitespace-nowrap">
                    <Button size="sm" className="shadow-sm">Üye Ol</Button>
                  </Link>
                </>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] transition-colors"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-[var(--surface)] border-b border-[var(--border)] shadow-xl animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary-dark)]'
                      : 'text-[var(--foreground)] hover:bg-[var(--surface-secondary)]'
                  )}
                >
                  <span className="text-xl">{link.emoji}</span>
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-[var(--border)] my-2" />

              {isLoggedIn && (
                <Link href="/ilan-ver">
                  <Button fullWidth variant="gradient" leftIcon={<Plus size={16} />}>İlan Ver</Button>
                </Link>
              )}

              {!isLoggedIn && (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" fullWidth>Giriş Yap</Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button fullWidth>Üye Ol</Button>
                  </Link>
                </div>
              )}
              {isLoggedIn && (
                <Link href="/profil">
                  <Button variant="outline" fullWidth leftIcon={<User size={16} />}>Profilim</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
