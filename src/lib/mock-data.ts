import { Listing } from '@/types';

export const mockListings: Listing[] = [
  {
    id: '1', type: 'sahiplendirme', animalType: 'kopek', breed: 'Golden Retriever',
    name: 'Karamel', age: '2 Yıl', gender: 'disi', city: 'İstanbul',
    ownerType: 'sahibinde', emoji: '🐶', createdAt: '2024-01-15',
    imageColor: 'from-amber-200 to-orange-200',
    photos: [
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '2', type: 'kayip', animalType: 'kedi', breed: 'British Shorthair',
    name: 'Boncuk', age: '3 Yıl', gender: 'erkek', city: 'Ankara',
    ownerType: 'sahibinde', emoji: '🐱', createdAt: '2024-01-14',
    imageColor: 'from-slate-200 to-gray-300',
    reward: '1000',
    photos: [
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '3', type: 'ciftlestirme', animalType: 'kus', breed: 'Muhabbet Kuşu',
    name: 'Mavi', age: '1 Yıl', gender: 'erkek', city: 'İzmir',
    ownerType: 'sahibinde', emoji: '🐦', createdAt: '2024-01-13',
    imageColor: 'from-sky-200 to-blue-300',
    photos: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '4', type: 'sahiplendirme', animalType: 'kedi', breed: 'Karışık/Melez',
    name: 'Pamuk', age: '6 Ay', gender: 'disi', city: 'Bursa',
    ownerType: 'barinakta', emoji: '🐱', createdAt: '2024-01-12',
    imageColor: 'from-rose-100 to-pink-200',
    photos: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '5', type: 'sahiplendirme', animalType: 'kopek', breed: 'Labrador',
    name: 'Max', age: '1 Yıl', gender: 'erkek', city: 'Antalya',
    ownerType: 'barinakta', emoji: '🐶', createdAt: '2024-01-11',
    imageColor: 'from-yellow-200 to-amber-300',
    photos: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '6', type: 'kayip', animalType: 'kopek', breed: 'Husky',
    name: 'Luna', age: '2 Yıl', gender: 'disi', city: 'İstanbul',
    ownerType: 'sahibinde', emoji: '🐶', createdAt: '2024-01-10',
    imageColor: 'from-gray-200 to-slate-300',
    reward: '2500',
    photos: [
      'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '7', type: 'sahiplendirme', animalType: 'kedi', breed: 'Persian',
    name: 'Çilek', age: '4 Ay', gender: 'disi', city: 'İstanbul',
    ownerType: 'barinakta', emoji: '🐱', createdAt: '2024-01-09',
    imageColor: 'from-orange-100 to-amber-200',
    photos: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '8', type: 'sahiplendirme', animalType: 'kopek', breed: 'Poodle',
    name: 'Fıstık', age: '3 Yıl', gender: 'erkek', city: 'Ankara',
    ownerType: 'sahibinde', emoji: '🐶', createdAt: '2024-01-08',
    imageColor: 'from-yellow-100 to-amber-100',
    photos: [
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '9', type: 'ciftlestirme', animalType: 'kopek', breed: 'Golden Retriever',
    name: 'Bella', age: '2 Yıl', gender: 'disi', city: 'İzmir',
    ownerType: 'sahibinde', emoji: '🐶', createdAt: '2024-01-07',
    imageColor: 'from-yellow-200 to-orange-100',
    photos: [
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '10', type: 'kayip', animalType: 'kedi', breed: 'Tekir',
    name: 'Tarçın', age: '5 Yıl', gender: 'erkek', city: 'Bursa',
    ownerType: 'sahibinde', emoji: '🐱', createdAt: '2024-01-06',
    imageColor: 'from-orange-200 to-amber-100',
    reward: '500',
    photos: [
      'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '11', type: 'sahiplendirme', animalType: 'kus', breed: 'Papağan',
    name: 'Tango', age: '2 Yıl', gender: 'erkek', city: 'İstanbul',
    ownerType: 'sahibinde', emoji: '🦜', createdAt: '2024-01-05',
    imageColor: 'from-green-200 to-emerald-300',
    photos: [
      'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591198936750-16d7e2e88b85?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '12', type: 'sahiplendirme', animalType: 'kopek', breed: 'Beagle',
    name: 'Şeker', age: '1 Yıl', gender: 'disi', city: 'Antalya',
    ownerType: 'barinakta', emoji: '🐶', createdAt: '2024-01-04',
    imageColor: 'from-amber-100 to-orange-100',
    photos: [
      'https://images.unsplash.com/photo-1537942677486-01bf3c90e7e6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583511655826-05700442f2ef?w=800&auto=format&fit=crop',
    ],
  },
];
