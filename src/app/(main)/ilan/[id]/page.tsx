import { mockListings } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import ListingDetailClient from './ListingDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const listing = mockListings.find(l => l.id === resolvedParams.id);

  if (!listing) {
    notFound();
  }

  // Generate some mock extended data based on the listing
  const extendedListing = {
    ...listing,
    description: 'Merhaba, çok oyuncu ve sevecen bir can dostudur. Bütün aşıları tamdır ve tuvalet eğitimi vardır. Maalesef ev taşıma durumumuz nedeniyle onu çok sevsek de yeni ve sıcak bir yuva arıyoruz. Lütfen sadece bahçeli evi olanlar veya ona yeterince vakit ayırabilecek hayvan severler iletişime geçsin.',
    videoLink: listing.type === 'sahiplendirme' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
    viewCount: Math.floor(Math.random() * 800) + 100,
    lostAt: listing.type === 'kayip' ? '2 gün önce' : undefined,
    attributes: [
      { label: 'Irk', value: listing.breed },
      { label: 'Yaş', value: listing.age },
      { label: 'Cinsiyet', value: listing.gender === 'erkek' ? 'Erkek' : listing.gender === 'disi' ? 'Dişi' : 'Bilinmiyor' },
      { label: 'Aşı Durumu', value: 'Tam' },
      { label: 'Tuvalet Eğitimi', value: 'Var' },
      { label: 'Kimlik/Çip', value: 'Mevcut' },
      { label: 'Kısırlaştırılmış', value: 'Hayır' },
    ],
    gallery: [
      listing.imageColor,
      'from-gray-100 to-gray-200',
      'from-blue-50 to-indigo-50',
    ],
    location: {
      lat: 41.0082,
      lng: 28.9784,
      address: `${listing.city}, Merkez Mahallesi, Sahil Caddesi No:45`
    },
    owner: {
      name: 'Ayşe Yılmaz',
      memberSince: 'Ekim 2023',
      phone: '+90 5XX XXX XX XX',
    }
  };

  return <ListingDetailClient listing={extendedListing} />;
}
