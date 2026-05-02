// constants/index.ts

export const ANIMAL_TYPES = [
  { value: 'kopek', label: 'Köpek', emoji: '🐶' },
  { value: 'kedi', label: 'Kedi', emoji: '🐱' },
  { value: 'kus', label: 'Kuş', emoji: '🐦' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'erkek', label: 'Erkek' },
  { value: 'disi', label: 'Dişi' },
  { value: 'bilinmiyor', label: 'Bilinmiyor' },
] as const;

export const LISTING_TYPES = [
  { value: 'sahiplendirme', label: 'Sahiplendirme', color: 'blue' },
  { value: 'kayip', label: 'Kayıp', color: 'red' },
  { value: 'ciftlestirme', label: 'Çiftleştirme', color: 'purple' },
] as const;

export const OWNER_TYPES = [
  { value: 'sahibinde', label: 'Sahibinde' },
  { value: 'barinakta', label: 'Barınakta' },
] as const;

export const ACCOUNT_TYPES = [
  {
    value: 'bireysel',
    label: 'Bireysel',
    description: 'Sahiplendirme, kayıp, çiftleştirme',
    price: 'ÜCRETSİZ',
    priceColor: 'text-green-600',
  },
  {
    value: 'barinak',
    label: 'Vakıf/Barınak',
    description: 'Resmi kurum ve barınaklar',
    price: 'ÜCRETSİZ',
    priceColor: 'text-green-600',
  },
  {
    value: 'profesyonel',
    label: 'Profesyonel',
    description: 'Veteriner, kuaför, eğitmen, otel',
    price: '₺299/ay',
    priceColor: 'text-[var(--brand-primary)]',
  },
] as const;

export const SERVICE_CATEGORIES = [
  { value: 'veteriner', label: 'Veteriner', emoji: '🩺' },
  { value: 'kuafor', label: 'Kuaför', emoji: '✂️' },
  { value: 'egitmen', label: 'Eğitmen', emoji: '🎓' },
  { value: 'pet-otel', label: 'Pet Otel', emoji: '🏨' },
  { value: 'gezdirici', label: 'Gezdirici', emoji: '🦮' },
] as const;

export const LOSS_TIME_OPTIONS = [
  { value: '0', label: 'Bugün' },
  { value: '1', label: 'Dün' },
  { value: '2', label: '2 Gün Önce' },
  { value: '3', label: '3 Gün Önce' },
  { value: '4', label: '4 Gün Önce' },
  { value: '5', label: '5 Gün Önce' },
  { value: '7', label: '1 Hafta Önce' },
  { value: '14', label: '2 Hafta Önce' },
  { value: '30', label: '1 Ay+ Önce' },
] as const;

export const AGE_OPTIONS = [
  { value: '0-6ay', label: '0-6 Ay' },
  { value: '6ay-1yil', label: '6 Ay - 1 Yıl' },
  { value: '1-3yil', label: '1-3 Yıl' },
  { value: '3-7yil', label: '3-7 Yıl' },
  { value: '7+yil', label: '7+ Yıl' },
  { value: 'bilinmiyor', label: 'Bilinmiyor' },
] as const;

export const HOUSING_OPTIONS = [
  { value: 'apartman', label: 'Apartman Dairesi' },
  { value: 'bahceli', label: 'Bahçeli Ev' },
  { value: 'mustakil', label: 'Müstakil Ev' },
  { value: 'ciftlik', label: 'Çiftlik / Arazi' },
  { value: 'diger', label: 'Diğer' },
] as const;

// 81 İl - Türkiye
export const CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya',
  'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir',
  'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis',
  'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane',
  'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir',
  'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu',
  'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kilis',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin',
  'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop',
  'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',
  'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
];

export const DOG_BREEDS = [
  'Akbaş', 'Alman Çoban Köpeği', 'Beagle', 'Border Collie', 'Boxer', 'Bulldog',
  'Chihuahua', 'Cocker Spaniel', 'Dachshund', 'Dalmaçyalı', 'Doberman',
  'Golden Retriever', 'Husky', 'Jack Russell Terrier', 'Kangal', 'Labrador',
  'Maltese', 'Pomeranian', 'Poodle', 'Rottweiler', 'Shih Tzu',
  'Springer Spaniel', 'Yorkshire Terrier', 'Karışık/Melez', 'Bilinmiyor',
];

export const CAT_BREEDS = [
  'Abyssinian', 'Bengal', 'British Shorthair', 'Himalayan', 'İran Kedisi',
  'Maine Coon', 'Ragdoll', 'Russian Blue', 'Scottish Fold', 'Siamese',
  'Sphynx', 'Turkish Angora', 'Turkish Van', 'Van Kedisi',
  'Karışık/Melez', 'Bilinmiyor',
];

export const BIRD_BREEDS = [
  'Cennet Papağanı', 'Cennet Muhabbet', 'Hint Bülbülü', 'Kanarya',
  'Konur', 'Macaw', 'Muhabbet Kuşu', 'Pakistan Papağanı', 'Sultan Papağanı',
  'Karışık/Melez', 'Bilinmiyor',
];

export const PHOTO_MAX = 10;
export const PHOTO_MIN = 1;
export const DESCRIPTION_MIN_CHARS = 30;
