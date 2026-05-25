'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Tag } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductCard({ product, size = 'normal' }: { product: any; size?: 'normal' | 'small' }) {
  const [inCart, setInCart] = useState(false);
  return (
    <Link href={`/magaza/${product.id}`} className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group cursor-pointer overflow-hidden ${size === 'small' ? 'p-3' : 'p-4'}`}>
      <div className="relative">
        <div className={`w-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform ${size === 'small' ? 'h-24' : 'h-36'}`}>
          <img src={product.image || product.photo} alt={product.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
        </div>
        {product.tag && (
          <span className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
            product.tag.includes('İndirim') ? 'bg-rose-500 text-white' :
            product.tag === 'Yeni' ? 'bg-blue-500 text-white' :
            'bg-emerald-500 text-white'
          }`}>{product.tag}</span>
        )}
        {product.isBestseller && (
          <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-amber-400 text-amber-900 px-1 py-0.5 rounded-md">🔥</span>
        )}
      </div>
      <div className={`text-[10px] text-[var(--foreground-muted)] font-medium ${size === 'small' ? 'mt-2' : 'mt-2'}`}>{product.brand}</div>
      <div className={`font-semibold text-[var(--foreground)] leading-tight line-clamp-2 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>{product.name}</div>
      <div className="flex items-center gap-1 mt-1">
        <Star size={9} className="text-yellow-400 fill-yellow-400" />
        <span className="text-[10px] font-medium">{product.rating}</span>
        <span className="text-[9px] text-[var(--foreground-muted)]">({product.reviews})</span>
      </div>
      <div className="flex items-center gap-2 mt-auto pt-2">
        <span className={`font-bold text-emerald-600 ${size === 'small' ? 'text-sm' : 'text-base'}`}>₺{product.price}</span>
        {product.oldPrice && <span className="text-xs line-through text-[var(--foreground-muted)]">₺{product.oldPrice}</span>}
      </div>
      <button
        onClick={(e) => { 
          e.preventDefault(); 
          setInCart(true);
          
          // Add to local storage cart
          const currentCart = JSON.parse(localStorage.getItem('pet_cart') || '[]');
          const existing = currentCart.find((item: any) => item.id === product.id);
          
          if (existing) {
            existing.quantity += 1;
            localStorage.setItem('pet_cart', JSON.stringify(currentCart));
          } else {
            localStorage.setItem('pet_cart', JSON.stringify([...currentCart, { ...product, quantity: 1 }]));
          }

          toast.success(`${product.name} sepete eklendi!`);
          setTimeout(() => setInCart(false), 2000); 
        }}
        className={`w-full mt-2 font-semibold rounded-xl flex items-center justify-center gap-1 transition-all ${size === 'small' ? 'h-7 text-[11px]' : 'h-9 text-xs'} ${
          inCart ? 'bg-green-500 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white'
        }`}
      >
        {inCart ? '✓ Eklendi!' : <><Tag size={10} /> Sepete Ekle</>}
      </button>
    </Link>
  );
}
