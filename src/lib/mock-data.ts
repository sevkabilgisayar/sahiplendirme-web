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

export const mockStoreProducts = [
  { id: 1, name: 'Royal Canin Medium Adult', brand: 'Royal Canin', price: 289, oldPrice: 350, img: '🥩', photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop', tag: '%17 İndirim', rating: 4.8, reviews: 324, isBestseller: true, isFeatured: true, isOnSale: true },
  { id: 2, name: 'Flexi Otomatik Tasma 5m', brand: 'Flexi', price: 199, oldPrice: 249, img: '🦮', photo: 'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=500&auto=format&fit=crop', tag: '%20 İndirim', rating: 4.6, reviews: 187, isBestseller: true, isFeatured: false, isOnSale: true },
  { id: 3, name: 'ComfyPet Ortopedik Yatak', brand: 'ComfyPet', price: 379, oldPrice: 450, img: '🛏️', photo: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop', tag: '%15 İndirim', rating: 4.9, reviews: 412, isBestseller: false, isFeatured: true, isOnSale: true },
  { id: 4, name: 'Kong Extreme Oyuncak', brand: 'Kong', price: 149, oldPrice: null, img: '🧸', photo: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop', tag: 'Yeni', rating: 4.7, reviews: 98, isBestseller: false, isFeatured: true, isOnSale: false },
  { id: 5, name: 'NutriVet Eklem Vitamini', brand: 'NutriVet', price: 89, oldPrice: null, img: '💊', photo: 'https://images.unsplash.com/photo-1623366302587-bcaafabcacbd?w=500&auto=format&fit=crop', tag: '', rating: 4.5, reviews: 203, isBestseller: true, isFeatured: false, isOnSale: false },
  { id: 6, name: 'Trixie Tüy Fırçası Pro', brand: 'Trixie', price: 129, oldPrice: 159, img: '✂️', photo: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop', tag: '%19 İndirim', rating: 4.4, reviews: 76, isBestseller: false, isFeatured: false, isOnSale: true },
  { id: 7, name: 'Purina Pro Plan Kedi', brand: 'Purina', price: 319, oldPrice: 389, img: '🐱', photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop', tag: '%18 İndirim', rating: 4.8, reviews: 511, isBestseller: true, isFeatured: true, isOnSale: true },
  { id: 8, name: 'PetSafe Otomatik Besleyici', brand: 'PetSafe', price: 599, oldPrice: 749, img: '🍽️', photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop', tag: '%20 İndirim', rating: 4.6, reviews: 143, isBestseller: false, isFeatured: true, isOnSale: true },
  { id: 9, name: 'Kuş Kafesi Deluxe', brand: 'PetHouse', price: 849, oldPrice: null, img: '🐦', photo: 'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=500&auto=format&fit=crop', tag: 'Yeni', rating: 4.3, reviews: 34, isBestseller: false, isFeatured: false, isOnSale: false },
  { id: 10, name: "Hill's Science Plan", brand: "Hill's", price: 459, oldPrice: 529, img: '🥩', photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop', tag: '%13 İndirim', rating: 4.9, reviews: 678, isBestseller: true, isFeatured: false, isOnSale: true },
  { id: 11, name: 'Catit Design Çeşme', brand: 'Catit', price: 349, oldPrice: 419, img: '🚰', photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop', tag: '%17 İndirim', rating: 4.7, reviews: 256, isBestseller: true, isFeatured: false, isOnSale: true },
  { id: 12, name: 'Ziwi Peak Kuzu Etli', brand: 'Ziwi', price: 189, oldPrice: null, img: '🥩', photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop', tag: 'Premium', rating: 4.9, reviews: 89, isBestseller: false, isFeatured: true, isOnSale: false },
];
