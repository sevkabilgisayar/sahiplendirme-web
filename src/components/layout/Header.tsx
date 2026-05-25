'use client';

import { Suspense } from 'react';

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
  X,
  Sparkles,
  Store
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import SiteLogo from '../ui/SiteLogo';

const navLinks = [
  { href: '/ilanlar?kategori=sahiplendirme', label: 'Sahiplendirme', emoji: '🏠' },
  { href: '/ilanlar?kategori=kayip', label: 'Kayıp', emoji: '🔍' },
  { href: '/ilanlar?kategori=ciftlestirme', label: 'Çiftleştirme', emoji: '💕' },
  { href: '/hizmetler', label: 'Hizmetler', emoji: '⭐' },
  { href: '/magaza', label: 'Ürünler', emoji: '🛍️' },
];

function HeaderContent() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Real Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string) => {
    if (href.includes('?')) {
      const [path, query] = href.split('?');
      if (pathname !== path) return false;
      const paramName = query.split('=')[0];
      const paramValue = query.split('=')[1];
      return searchParams?.get(paramName) === paramValue;
    }
    return pathname === href || pathname?.startsWith(href + '/');
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUser(data.user);
          // Bildirimleri çek
          const nRes = await fetch('/api/notifications');
          if (nRes.ok) {
            const nData = await nRes.json();
            setNotifications(nData.notifications || []);
            setUnreadCount(nData.unreadCount || 0);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();

    // Sepet durumunu localStorage üzerinden kontrol et
    const updateCartCount = () => {
      try {
        const cartStr = localStorage.getItem('cart');
        if (cartStr) {
          const cart = JSON.parse(cartStr);
          setCartCount(Array.isArray(cart) ? cart.length : 0);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart-updated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, [pathname]);

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setUser(null);
      setProfileOpen(false);
      window.location.href = '/login';
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === '/abonelik-odeme') {
    return (
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[var(--border)] h-16 flex items-center justify-center">
        <SiteLogo />
      </header>
    );
  }

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
            <Link href="/" className="flex items-center -ml-2 xl:-ml-16 transform scale-90 sm:scale-100 xl:scale-125 origin-left" style={{ overflow: 'visible' }}>
              <SiteLogo size="lg" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive(link.href)
                      ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary-dark)] shadow-sm'
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
              {isLoggedIn && (
                <Link href="/ilan-ver">
                  <Button variant="gradient" leftIcon={<Plus size={18} />} className="hidden lg:flex whitespace-nowrap shadow-sm font-bold text-base px-5 py-2.5">
                    Yeni İlan Ver
                  </Button>
                </Link>
              )}

              <div className="hidden sm:block w-px h-8 bg-[var(--border)] mx-2"></div>

              {/* Cart */}
              <Link
                href="/sepet"
                className="relative flex items-center justify-center w-10 h-10 rounded-full text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--surface)] text-white text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  {/* Favorites */}
                  <Link
                    href="/profil?tab=favoriler"
                    className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-red-500 transition-colors"
                  >
                    <Heart size={20} />
                  </Link>

                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
                      className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-[var(--danger)] rounded-full border-2 border-[var(--surface)] text-white text-[9px] font-bold flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
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
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-[var(--foreground-muted)]">
                              Henüz bildiriminiz bulunmuyor.
                            </div>
                          ) : notifications.map((n: any) => (
                            <div 
                              key={n.id} 
                              onClick={() => handleMarkAsRead(n.id, n.isRead)}
                              className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer ${!n.isRead ? 'bg-orange-50' : ''}`}
                            >
                              <p className="text-sm font-medium text-[var(--foreground)]">{n.content}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('tr-TR')}</p>
                            </div>
                          ))}
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
                          <p className="text-sm font-bold text-[var(--foreground)]">{user ? `${user.firstName} ${user.lastName}` : 'Kullanıcı'}</p>
                          <p className="text-xs text-[var(--foreground-muted)] truncate">{user ? user.email : ''}</p>
                        </div>
                        <Link href="/profil" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--foreground-muted)] hover:bg-gray-50 hover:text-[var(--foreground)] transition-colors">
                          <User size={16} /> Hesabım
                        </Link>
                        {user?.role === 'admin' && (
                          <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--brand-primary)] hover:bg-gray-50 transition-colors">
                            <Settings size={16} /> Admin Paneli
                          </Link>
                        )}
                        {(user?.accountType?.toLowerCase() === 'profesyonel' || user?.accountType?.toLowerCase() === 'barinak') && (
                          <Link href="/satici/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors">
                            <Store size={16} /> Satıcı Paneli
                          </Link>
                        )}

                        <button 
                          onClick={handleLogout} 
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
                  <Link href="/login" className="hidden md:block whitespace-nowrap text-sm font-semibold hover:text-[var(--brand-primary)] px-2 transition-colors">
                    Giriş Yap
                  </Link>
                  <Link href="/register" className="hidden sm:flex whitespace-nowrap bg-[var(--foreground)] text-[var(--surface)] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[var(--foreground)]/90 transition-colors shadow-sm items-center">
                    Üye Ol
                  </Link>
                </div>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="xl:hidden flex items-center justify-center w-9 h-9 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] transition-colors"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 xl:hidden">
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
                    isActive(link.href)
                      ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary-dark)] shadow-sm'
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

export default function Header() {
  return (
    <Suspense fallback={<div className="h-16 w-full bg-white border-b" />}>
      <HeaderContent />
    </Suspense>
  );
}
