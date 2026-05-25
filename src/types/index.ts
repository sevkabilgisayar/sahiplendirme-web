// types/index.ts — Proje PLANI.docx'e göre genişletilmiş tip sistemi

// ============ ENUMS ============
export type ListingType = 'sahiplendirme' | 'kayip' | 'ciftlestirme' | 'diger';
export type AnimalType = 'kopek' | 'kedi' | 'kus' | 'diger';
export type Gender = 'erkek' | 'disi' | 'bilinmiyor';
export type OwnerType = 'sahibinde' | 'barinakta';
export type UserRole = 'admin' | 'moderator' | 'shelter' | 'provider' | 'user';
export type AccountType = 'bireysel' | 'barinak' | 'profesyonel';
export type ListingStatus = 'taslak' | 'beklemede' | 'aktif' | 'pasif' | 'reddedildi';
export type ApplicationStatus = 'beklemede' | 'onaylandi' | 'reddedildi';
export type ServiceCategory = 'veteriner' | 'kuafor' | 'egitmen' | 'pet-otel' | 'gezdirici';
export type NotificationType = 'mesaj' | 'basvuru' | 'kayip_uyari' | 'paket_uyari' | 'sistem';
export type ReportReason = 'sahte' | 'tekrar' | 'uygunsuz' | 'aldatici' | 'diger';
export type LocationPrivacy = 'yaklasik' | 'tam';

// ============ LOCATION ============
export interface Location {
  lat: number;
  lng: number;
  city: string;
  district?: string;
  address?: string;
  privacy: LocationPrivacy; // Madde 5.D
}

// ============ LISTING ============
export interface Listing {
  id: string;
  type: ListingType;
  animalType: AnimalType;
  breed: string;
  name: string;
  age: string;
  gender: Gender;
  city: string;
  ownerType: OwnerType;
  emoji: string;
  createdAt: string;
  imageColor: string;

  // Genişletilmiş alanlar
  description?: string;
  photos?: string[];       // Min 1, Max 10 (Madde 5.A)
  videoLink?: string;      // Opsiyonel (Madde 5.A.2)
  location?: Location;     // Madde 5.D
  status?: ListingStatus;
  viewCount?: number;
  applicationCount?: number;
  userId?: string;
  user?: User;             // Added user relation
  shelterName?: string;    // Barınaktan sahiplendiriliyorsa barınak adı

  // Kayıp ilanı ek alanlar (Madde 6.1)
  reward?: string;
  rewardAmount?: string | number; // Added rewardAmount since it's used in components
  hasReward?: boolean;
  lossTime?: string;       // bugün/dün/2 gün önce...
  lastSeenLocation?: Location;
  sightings?: Sighting[];

  // Çiftleştirme ek alanlar (Madde 6.3)
  isNeutered?: boolean;
}

// ============ USER ============
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  role: UserRole;
  accountType: AccountType;
  avatar?: string;
  isVerified: boolean;
  isPhoneVerified?: boolean;
  memberSince: string;
  serviceCategory?: ServiceCategory; // Sadece profesyonel
}

// ============ APPLICATION (Madde 5.B) ============
export interface Application {
  id: string;
  listingId: string;
  userId: string;
  status: ApplicationStatus;
  message: string;
  housingType?: string;    // apartman/bahçeli vb.
  city: string;
  createdAt: string;
  user?: User;
}

// ============ SIGHTING / GÖRDÜM (Madde 6.1) ============
export interface Sighting {
  id: string;
  listingId: string;
  userId: string;
  location: Location;
  time: string;            // bugün/dün/2 gün önce
  note?: string;
  photo?: string;
  createdAt: string;
  user?: User;
}

// ============ MESSAGING (Madde 5.C) ============
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  listingId?: string;      // İlan üzerinden başlatılan konuşma
  createdAt: string;
}

// ============ SERVICE PROVIDER (Madde 5.F) ============
export interface ServiceProvider {
  id: string;
  userId: string;
  user?: User;
  category: ServiceCategory;
  region: string;
  workingHours?: string;
  description: string;
  photos: string[];        // Max 10
  packageStatus: 'aktif' | 'pasif';
  badge?: string;          // Öne çıkarma/rozet
}

// ============ PACKAGES & PAYMENTS (Madde 11, 12) ============
export interface Package {
  id: string;
  name: string;
  serviceType: ServiceCategory;
  price: number;
  duration: number;        // Ay
  features: string[];
  isPopular?: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  packageId: string;
  amount: number;
  status: 'beklemede' | 'basarili' | 'basarisiz' | 'iptal';
  createdAt: string;
}

// ============ NOTIFICATION (Madde 17) ============
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ============ REPORT / ŞİKAYET (Madde 14) ============
export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: 'listing' | 'user' | 'message';
  reason: ReportReason;
  description?: string;
  status: 'beklemede' | 'inceleniyor' | 'cozuldu' | 'reddedildi';
  createdAt: string;
}

// ============ BANNER / REKLAM (Madde 15) ============
export interface Banner {
  id: string;
  image: string;
  link: string;
  position: 'anasayfa' | 'listeleme' | 'detay';
  startDate: string;
  endDate: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
}
