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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // Mock Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const pathname = usePathname();

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
            <div className="flex items-center gap-3">
              
              {/* İlan Ver Butonu */}
              <Link href="/ilan-ver">
                <Button variant="gradient" leftIcon={<Plus size={16} />} className="hidden sm:flex shadow-brand whitespace-nowrap">
                  İlan Ver
                </Button>
              </Link>

              <div className="hidden sm:block w-px h-6 bg-[var(--border)] mx-1"></div>

              {/* Cart */}
              <Link
                href="/sepet"
                className="relative flex items-center justify-center w-10 h-10 rounded-full text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                <ShoppingCart size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--surface)] text-white text-[9px] font-bold flex items-center justify-center">3</span>
              </Link>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
                      className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <Bell size={20} />
                      <span className="absolute top-0 right-0 w-4 h-4 bg-[var(--danger)] rounded-full border-2 border-[var(--surface)] text-white text-[9px] font-bold flex items-center justify-center">2</span>
                    </button>

                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[var(--border)] py-2 z-50 animate-fade-in">
                        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                          <h3 className="font-bold text-[var(--foreground)]">Bildirimler</h3>
                          <Link href="/bildirimler" onClick={() => setNotificationsOpen(false)} className="text-xs text-[var(--brand-primary)] hover:underline font-medium">
                            Tümünü Gör
                          </Link>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">
                            <p className="text-sm font-medium text-[var(--foreground)]">Yeni Sahiplenme Talebi</p>
                            <p className="text-xs text-[var(--foreground-muted)] mt-1">Ali Demir, Pamuk ilanınız için başvuru yaptı.</p>
                            <p className="text-[10px] text-gray-400 mt-2">5 dk önce</p>
                          </div>
                          <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                            <p className="text-sm font-medium text-[var(--foreground)]">Yeni Mesaj</p>
                            <p className="text-xs text-[var(--foreground-muted)] mt-1">Ahmet Yılmaz size bir mesaj gönderdi.</p>
                            <p className="text-[10px] text-gray-400 mt-2">1 saat önce</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <Link
                    href="/profil/mesajlar"
                    className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <MessageCircle size={20} />
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
                      className="w-10 h-10 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] rounded-full flex items-center justify-center cursor-pointer hover:shadow-brand transition-all ring-2 ring-transparent hover:ring-[var(--brand-primary-light)]"
                    >
                      <User size={18} className="text-white" />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[var(--border)] py-2 z-50 animate-fade-in">
                        <div className="px-4 py-2 border-b border-[var(--border)] mb-1">
                          <p className="text-sm font-bold text-[var(--foreground)]">Ayşe Yılmaz</p>
                          <p className="text-xs text-[var(--foreground-muted)]">ayse@example.com</p>
                        </div>
                        <Link href="/profil" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--foreground-muted)] hover:bg-gray-50 hover:text-[var(--foreground)] transition-colors">
                          <User size={16} /> Hesabım
                        </Link>
                        <button 
                          onClick={() => { setIsLoggedIn(false); setProfileOpen(false); }} 
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors mt-1"
                        >
                          <LogOut size={16} /> Çıkış Yap
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="hidden sm:block whitespace-nowrap text-sm font-semibold hover:text-[var(--brand-primary)] px-2 transition-colors">
                    Giriş Yap
                  </Link>
                  <Link href="/register" className="whitespace-nowrap bg-[var(--foreground)] text-[var(--surface)] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[var(--foreground)]/90 transition-colors shadow-sm">
                    Üye Ol
                  </Link>
                </div>
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
