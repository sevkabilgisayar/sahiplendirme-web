'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  count?: number;
}

export function Skeleton({ className, width, height, rounded = 'md', count = 1 }: SkeletonProps) {
  const radiusMap = {
    sm: 'rounded-md',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };

  const style = {
    width: width,
    height: height,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={style}
          className={cn('skeleton', radiusMap[rounded], className)}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
      <Skeleton className="w-full h-48" rounded="sm" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-20 h-5" />
        </div>
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-1/2 h-4" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-8 h-8" rounded="lg" />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
