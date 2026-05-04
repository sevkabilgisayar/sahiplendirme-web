'use client';

import { cn } from '@/lib/utils';
import { Grid2X2, Heart, Home, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Ana Sayfa', icon: Home },
  { href: '/ilanlar', label: 'İlanlar', icon: Grid2X2 },
  { href: '/favoriler', label: 'Favoriler', icon: Heart },
  { href: '/profil/mesajlar', label: 'Mesajlar', icon: MessageCircle },
  { href: '/profil', label: 'Profil', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/97 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.07)]">
      <div className="flex items-center justify-around py-1 px-2 safe-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[56px]',
                isActive
                  ? 'text-orange-500'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <span className={cn(
                'relative flex items-center justify-center w-7 h-7 rounded-xl transition-all duration-200',
                isActive ? 'bg-orange-50' : ''
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {tab.href === '/profil/mesajlar' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
              </span>
              <span className={cn('text-[10px] font-medium leading-none', isActive ? 'font-bold' : '')}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
