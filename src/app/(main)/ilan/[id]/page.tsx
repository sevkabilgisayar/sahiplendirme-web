import { notFound } from 'next/navigation';
import ListingDetailClient from './ListingDetailClient';
import { db } from '@/lib/db';
import { AGE_OPTIONS, ANIMAL_TYPES } from '@/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Güvenli JSON parse
function parsePhotos(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
    if (typeof parsed === 'string') {
      const again = JSON.parse(parsed);
      if (Array.isArray(again)) return again.filter(Boolean);
    }
    return [];
  } catch { return []; }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  const listing = await db.listing.update({
    where: { id: resolvedParams.id },
    data: { viewCount: { increment: 1 } },
    include: {
      user: true,
    }
  }).catch(() => null);

  if (!listing) {
    notFound();
  }

  const photos = parsePhotos(listing.photos);
  const lat = listing.latitude || 39.9334;  // Türkiye merkezi fallback
  const lng = listing.longitude || 32.8597;
  const address = [listing.city, listing.district].filter(Boolean).join('/');

  const ageLabel = AGE_OPTIONS.find(a => a.value === listing.age)?.label || listing.age || 'Bilinmiyor';
  const animalLabel = ANIMAL_TYPES.find(a => a.value === listing.animal)?.label || listing.animal || 'Bilinmiyor';

  // Transform db listing to match frontend props expectations
  const extendedListing = {
    ...listing,
    name: listing.title,   // DB'de title var, Client name bekliyor (Başlık olarak kullanılıyor)
    animalName: listing.name, // Gerçek hayvan adı
    animalType: listing.animal,
    createdAt: listing.createdAt.toISOString(),
    imageColor: 'from-orange-100 to-amber-200',
    emoji: '🐾',
    videoLink: undefined,
    viewCount: listing.viewCount || 0,
    lostAt: listing.lossTime,
    photos,
    gallery: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800'],
    attributes: [
      { label: 'Türü', value: animalLabel },
      { label: 'Irk', value: listing.breed || 'Bilinmiyor' },
      { label: 'Yaş', value: ageLabel },
      { label: 'Cinsiyet', value: listing.gender || 'Bilinmiyor' },
      { label: 'Konum', value: [listing.city, listing.district].filter(Boolean).join(' / ') || 'Bilinmiyor' },
    ],
    location: {
      lat,
      lng,
      address: address || listing.city || 'Türkiye',
    },
    owner: {
      id: listing.user.id,
      name: listing.contactName || `${listing.user.firstName} ${listing.user.lastName}`,
      memberSince: new Date(listing.user.createdAt).getFullYear().toString(),
      phone: listing.contactPhone || listing.user.phone || 'GİZLİ',
      avatar: listing.contactName ? undefined : listing.user.avatar,
      isGhost: !!listing.contactName,
    }
  };

  return <ListingDetailClient listing={extendedListing} />;
}
