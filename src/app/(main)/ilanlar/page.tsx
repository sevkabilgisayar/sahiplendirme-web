'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, ChevronDown, MapPin, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ListingCard from '@/components/ui/ListingCard';
import { mockListings } from '@/lib/mock-data';
import Button from '@/components/ui/Button';
import AdBanner from '@/components/ui/AdBanner';
import {
  CITIES, AGE_OPTIONS, GENDER_OPTIONS, ANIMAL_TYPES, LISTING_TYPES, OWNER_TYPES,
  DOG_BREEDS, CAT_BREEDS, BIRD_BREEDS, DISTRICTS_BY_CITY
} from '@/constants';

const BREEDS_BY_ANIMAL: Record<string, string[]> = {
  kopek: DOG_BREEDS,
  kedi: CAT_BREEDS,
  kus: BIRD_BREEDS,
};

const ITEMS_PER_PAGE = 16;

export default function ListingsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ListingsPageInner />
    </Suspense>
  );
}

function ListingsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Filter states — initialized from URL query params
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get('kategori') ? [searchParams.get('kategori')!] : []
  );
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>(
    searchParams.get('tur') ? [searchParams.get('tur')!] : []
  );
  const [selectedCities, setSelectedCities] = useState<string[]>(
    searchParams.get('sehir') ? [searchParams.get('sehir')!] : []
  );
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedOwnerTypes, setSelectedOwnerTypes] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);

  // Available breeds based on selected animal types
  const availableBreeds = useMemo(() => {
    if (selectedAnimals.length === 1) return BREEDS_BY_ANIMAL[selectedAnimals[0]] || [];
    if (selectedAnimals.length === 0) return [...DOG_BREEDS, ...CAT_BREEDS, ...BIRD_BREEDS];
    return [];
  }, [selectedAnimals]);

  // Available districts based on selected cities
  const availableDistricts = useMemo(() => {
    let districts: string[] = [];
    selectedCities.forEach(city => {
      if (DISTRICTS_BY_CITY[city]) {
        districts = [...districts, ...DISTRICTS_BY_CITY[city]];
      } else {
        districts.push('Merkez'); // Fallback if no districts predefined
      }
    });
    return districts;
  }, [selectedCities]);

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
    setPage(1);
    // Hayvan türü değişirse ırkları temizle
    if (setter === setSelectedAnimals) {
      setSelectedBreeds([]);
    }
    // İl değişirse ilçeleri temizle
    if (setter === setSelectedCities) {
      setSelectedDistricts([]);
    }
  };

  const clearAll = () => {
    setSearch(''); setSelectedTypes([]); setSelectedAnimals([]);
    setSelectedCities([]); setSelectedDistricts([]); setSelectedGender(''); setSelectedOwnerTypes([]);
    setSelectedBreeds([]); setSelectedAges([]);
    setPage(1);
  };

  const hasFilters = search || selectedTypes.length || selectedAnimals.length || selectedCities.length || selectedDistricts.length || selectedGender || selectedOwnerTypes.length || selectedBreeds.length || selectedAges.length;

  // All listings (duplicated for demo volume)
  const allListings = useMemo(() => {
    const attachDistrict = (l: any) => {
      const cityDistricts = DISTRICTS_BY_CITY[l.city] || ['Merkez'];
      return { ...l, district: l.district || cityDistricts[Math.floor(Math.random() * cityDistricts.length)] };
    };
    return [
      ...mockListings.map(attachDistrict),
      ...mockListings.map(l => attachDistrict({ ...l, id: `${l.id}-b`, city: 'Ankara' })),
      ...mockListings.slice(0, 6).map(l => attachDistrict({ ...l, id: `${l.id}-c`, city: 'İzmir' })),
    ];
  }, []);

  const filtered = useMemo(() => {
    let result = [...allListings];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.breed.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        (l.district && l.district.toLowerCase().includes(q))
      );
    }
    if (selectedTypes.length) result = result.filter(l => selectedTypes.includes(l.type));
    if (selectedAnimals.length) result = result.filter(l => selectedAnimals.includes(l.animalType));
    if (selectedCities.length) result = result.filter(l => selectedCities.includes(l.city));
    if (selectedDistricts.length) result = result.filter(l => selectedDistricts.includes(l.district));
    if (selectedGender) result = result.filter(l => l.gender === selectedGender);
    if (selectedOwnerTypes.length) result = result.filter(l => selectedOwnerTypes.includes(l.ownerType));
    if (selectedBreeds.length) result = result.filter(l => selectedBreeds.includes(l.breed));

    if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sort === 'oldest') result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (sort === 'reward') result.sort((a, b) => (Number(b.reward) || 0) - (Number(a.reward) || 0));

    return result;
  }, [search, selectedTypes, selectedAnimals, selectedCities, selectedDistricts, selectedGender, selectedOwnerTypes, selectedBreeds, selectedAges, sort, allListings]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const FilterSidebar = () => (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Filter size={18} className="text-[var(--brand-primary)]" /> Filtreler
        </h2>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-red-500 hover:underline font-medium">
            Temizle
          </button>
        )}
      </div>

      {/* İlan Türü */}
      <div className="mb-6 border-b border-[var(--border)] pb-5">
        <h3 className="font-semibold text-sm mb-3 text-[var(--foreground-muted)] uppercase tracking-wide">İlan Türü</h3>
        <div className="flex flex-col gap-2">
          {LISTING_TYPES.map((cat) => (
            <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={selectedTypes.includes(cat.value)}
                onChange={() => toggleFilter(selectedTypes, cat.value, setSelectedTypes)}
                className="w-4 h-4 rounded border-[var(--border)] text-[var(--brand-primary)] accent-[var(--brand-primary)]" />
              <span className="text-sm group-hover:text-[var(--brand-primary)] transition-colors">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Hayvan Türü */}
      <div className="mb-6 border-b border-[var(--border)] pb-5">
        <h3 className="font-semibold text-sm mb-3 text-[var(--foreground-muted)] uppercase tracking-wide">Hayvan Türü</h3>
        <div className="flex flex-col gap-2">
          {ANIMAL_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={selectedAnimals.includes(type.value)}
                onChange={() => toggleFilter(selectedAnimals, type.value, setSelectedAnimals)}
                className="w-4 h-4 rounded border-[var(--border)] text-[var(--brand-primary)] accent-[var(--brand-primary)]" />
              <span className="text-sm group-hover:text-[var(--brand-primary)] transition-colors">{type.emoji} {type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Irk Filtresi — Hayvan türüne göre dinamik */}
      {selectedAnimals.length <= 1 && availableBreeds.length > 0 && (
        <div className="mb-6 border-b border-[var(--border)] pb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-[var(--foreground-muted)] uppercase tracking-wide">Irk</h3>
            {selectedBreeds.length > 0 && (
              <button onClick={() => setSelectedBreeds([])} className="text-[10px] text-[var(--brand-primary)] hover:underline font-bold">
                Tümünü Kaldır
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {availableBreeds.map(b => (
              <label key={b} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={selectedBreeds.includes(b)}
                  onChange={() => toggleFilter(selectedBreeds, b, setSelectedBreeds)}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--brand-primary)] accent-[var(--brand-primary)] flex-shrink-0" />
                <span className="text-sm group-hover:text-[var(--brand-primary)] transition-colors leading-tight py-0.5">{b}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Cinsiyet */}
      <div className="mb-6 border-b border-[var(--border)] pb-5">
        <h3 className="font-semibold text-sm mb-3 text-[var(--foreground-muted)] uppercase tracking-wide">Cinsiyet</h3>
        <div className="flex gap-2">
          {[{ value: '', label: 'Tümü' }, ...GENDER_OPTIONS].map(g => (
            <button key={g.value} onClick={() => { setSelectedGender(g.value); setPage(1); }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedGender === g.value
                  ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                  : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--brand-primary-light)]'
              }`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kimden (Sahibinde/Barınakta) */}
      <div className="mb-6 border-b border-[var(--border)] pb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-[var(--foreground-muted)] uppercase tracking-wide">Kimden</h3>
          {selectedOwnerTypes.length > 0 && (
            <button onClick={() => setSelectedOwnerTypes([])} className="text-[10px] text-[var(--brand-primary)] hover:underline font-bold">
              Tümünü Kaldır
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {OWNER_TYPES.map((o) => (
            <label key={o.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={selectedOwnerTypes.includes(o.value)}
                onChange={() => toggleFilter(selectedOwnerTypes, o.value, setSelectedOwnerTypes)}
                className="w-4 h-4 rounded border-[var(--border)] text-[var(--brand-primary)] accent-[var(--brand-primary)] flex-shrink-0" />
              <span className="text-sm group-hover:text-[var(--brand-primary)] transition-colors py-0.5">
                {o.value === 'sahibinde' ? '🏠' : '🏛️'} {o.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Yaş */}
      <div className="mb-6 border-b border-[var(--border)] pb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-[var(--foreground-muted)] uppercase tracking-wide">Yaşı</h3>
          {selectedAges.length > 0 && (
            <button onClick={() => setSelectedAges([])} className="text-[10px] text-[var(--brand-primary)] hover:underline font-bold">
              Tümünü Kaldır
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {AGE_OPTIONS.map((age) => (
            <label key={age.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={selectedAges.includes(age.value)}
                onChange={() => toggleFilter(selectedAges, age.value, setSelectedAges)}
                className="w-4 h-4 rounded border-[var(--border)] text-[var(--brand-primary)] accent-[var(--brand-primary)] flex-shrink-0" />
              <span className="text-sm group-hover:text-[var(--brand-primary)] transition-colors leading-tight py-0.5">{age.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Şehir */}
      <div className="mb-6 border-b border-[var(--border)] pb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-[var(--foreground-muted)] uppercase tracking-wide">İl Seçimi</h3>
          {selectedCities.length > 0 && (
            <button onClick={() => { setSelectedCities([]); setSelectedDistricts([]); }} className="text-[10px] text-[var(--brand-primary)] hover:underline font-bold">
              Tümünü Kaldır
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {CITIES.map(city => (
            <label key={city} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={selectedCities.includes(city)}
                onChange={() => toggleFilter(selectedCities, city, setSelectedCities)}
                className="w-4 h-4 rounded border-[var(--border)] text-[var(--brand-primary)] accent-[var(--brand-primary)] flex-shrink-0" />
              <span className="text-sm group-hover:text-[var(--brand-primary)] transition-colors leading-tight py-0.5">{city}</span>
            </label>
          ))}
        </div>
      </div>

      {/* İlçe */}
      {selectedCities.length > 0 && availableDistricts.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-[var(--foreground-muted)] uppercase tracking-wide">İlçe Seçimi</h3>
            {selectedDistricts.length > 0 && (
              <button onClick={() => setSelectedDistricts([])} className="text-[10px] text-[var(--brand-primary)] hover:underline font-bold">
                Tümünü Kaldır
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {availableDistricts.map(dist => (
              <label key={dist} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={selectedDistricts.includes(dist)}
                  onChange={() => toggleFilter(selectedDistricts, dist, setSelectedDistricts)}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--brand-primary)] accent-[var(--brand-primary)] flex-shrink-0" />
                <span className="text-sm group-hover:text-[var(--brand-primary)] transition-colors leading-tight py-0.5">{dist}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Top Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold font-display text-[var(--foreground)] mb-4">İlanlar</h1>

          {/* Active filters chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTypes.map(t => (
                <span key={t} className="flex items-center gap-1 bg-[var(--brand-primary)] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  {LISTING_TYPES.find(x => x.value === t)?.label}
                  <button onClick={() => setSelectedTypes(selectedTypes.filter(x => x !== t))} className="hover:opacity-70"><X size={12} /></button>
                </span>
              ))}
              {selectedAnimals.map(a => (
                <span key={a} className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {ANIMAL_TYPES.find(x => x.value === a)?.emoji} {ANIMAL_TYPES.find(x => x.value === a)?.label}
                  <button onClick={() => setSelectedAnimals(selectedAnimals.filter(x => x !== a))} className="hover:opacity-70"><X size={12} /></button>
                </span>
              ))}
              {selectedBreeds.map(b => (
                <span key={b} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  🐾 {b}
                  <button onClick={() => setSelectedBreeds(selectedBreeds.filter(x => x !== b))} className="hover:opacity-70"><X size={12} /></button>
                </span>
              ))}
              {selectedAges.map(a => (
                <span key={a} className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  ⏳ {AGE_OPTIONS.find(x => x.value === a)?.label}
                  <button onClick={() => setSelectedAges(selectedAges.filter(x => x !== a))} className="hover:opacity-70"><X size={12} /></button>
                </span>
              ))}
              {selectedOwnerTypes.map(o => (
                <span key={o} className="flex items-center gap-1 bg-stone-100 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {o === 'sahibinde' ? '🏠' : '🏛️'} {OWNER_TYPES.find(x => x.value === o)?.label}
                  <button onClick={() => setSelectedOwnerTypes(selectedOwnerTypes.filter(x => x !== o))} className="hover:opacity-70"><X size={12} /></button>
                </span>
              ))}
              {selectedCities.map(c => (
                <span key={c} className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <MapPin size={10} /> {c}
                  <button onClick={() => setSelectedCities(selectedCities.filter(x => x !== c))} className="hover:opacity-70"><X size={12} /></button>
                </span>
              ))}
              {selectedDistricts.map(d => (
                <span key={d} className="flex items-center gap-1 bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  📍 {d}
                  <button onClick={() => setSelectedDistricts(selectedDistricts.filter(x => x !== d))} className="hover:opacity-70"><X size={12} /></button>
                </span>
              ))}
              <button onClick={clearAll} className="text-xs text-red-500 hover:underline font-medium px-2">Tümünü Temizle</button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input type="text" placeholder="İlan adı, cins, ırk veya şehir ara..."
                value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-sm" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="h-12 pl-4 pr-10 appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]">
                  <option value="newest">En Yeniler</option>
                  <option value="oldest">En Eskiler</option>
                  <option value="reward">Ödülü En Yüksek</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
              </div>
              <Button variant="outline" className="lg:hidden h-12 px-4 border-[var(--border)] relative"
                onClick={() => setShowMobileFilters(!showMobileFilters)}>
                <SlidersHorizontal size={18} />
                {hasFilters && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--brand-primary)] rounded-full text-white text-[9px] flex items-center justify-center font-bold">!</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="flex gap-0 items-start justify-center">

          {/* SOL REKLAM SÜTUNU */}
          <aside className="hidden xl:flex flex-col gap-4 w-[168px] flex-shrink-0 sticky top-24 self-start px-2">
            <a href="/paketler" className="block group">
              <div className="w-[160px] h-[600px] bg-gradient-to-b from-orange-50 to-orange-100 border-2 border-dashed border-orange-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(45deg, #f97316 0, #f97316 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px'}} />
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-lg">📢</span>
                </div>
                <div className="text-center px-3">
                  <div className="text-xs font-bold text-orange-600 mb-1">REKLAM ALANI</div>
                  <div className="text-[10px] text-orange-400 font-medium">160 × 600</div>
                  <div className="text-[10px] text-orange-400 mt-1">Skyscraper</div>
                </div>
                <div className="text-[9px] text-orange-300 text-center px-2 leading-relaxed">
                  Reklamınız burada görünsün
                </div>
                <div className="mt-2 px-3 py-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full group-hover:bg-orange-600 transition-colors">
                  Reklam Ver
                </div>
              </div>
            </a>
          </aside>

          {/* ORTA İÇERİK */}
          <div className="flex-1 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter Sidebar */}
              <aside className={`lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                <FilterSidebar />
              </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-[var(--foreground-muted)]">
                Toplam <strong className="text-[var(--foreground)]">{filtered.length}</strong> ilan bulundu
                {totalPages > 1 && <span className="ml-1">· Sayfa {page}/{totalPages}</span>}
              </span>
            </div>

            {/* Listings Grid */}
            {paginated.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
                  {paginated.map((listing) => (
                    <div key={listing.id} className="h-full">
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>

                {/* Ad Banner between pages */}
                {page === 1 && (
                  <AdBanner
                    imageUrl="https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?q=80&w=2670&auto=format&fit=crop"
                    linkUrl="/paketler"
                    altText="Sahiplendirme.com Premium"
                  />
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      return (
                        <button key={pageNum} onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                            page === pageNum
                              ? 'gradient-brand text-white shadow-brand'
                              : 'border border-[var(--border)] text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)]'
                          }`}>
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-[var(--foreground-muted)]" />
                </div>
                <h3 className="text-lg font-bold font-display mb-2">İlan bulunamadı</h3>
                <p className="text-sm text-[var(--foreground-muted)] mb-4">Filtreleri değiştirerek tekrar deneyin.</p>
                <Button variant="outline" onClick={clearAll}>Filtreleri Temizle</Button>
              </div>
            )}
            </div>
          </div>
          </div>
          {/* /ORTA İÇERİK */}

          {/* SAĞ REKLAM SÜTUNU */}
          <aside className="hidden xl:flex flex-col gap-4 w-[168px] flex-shrink-0 sticky top-24 self-start px-2">
            <a href="/paketler" className="block group">
              <div className="w-[160px] h-[300px] bg-gradient-to-b from-violet-50 to-purple-100 border-2 border-dashed border-violet-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-violet-400 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(45deg, #8b5cf6 0, #8b5cf6 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px'}} />
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-lg">✨</span>
                </div>
                <div className="text-center px-3">
                  <div className="text-xs font-bold text-violet-600 mb-1">REKLAM ALANI</div>
                  <div className="text-[10px] text-violet-400 font-medium">160 × 300</div>
                  <div className="text-[10px] text-violet-400 mt-1">Half Page</div>
                </div>
                <div className="mt-2 px-3 py-1.5 bg-violet-500 text-white text-[10px] font-bold rounded-full group-hover:bg-violet-600 transition-colors">
                  Reklam Ver
                </div>
              </div>
            </a>
            <a href="/paketler" className="block group">
              <div className="w-[160px] h-[280px] bg-gradient-to-b from-emerald-50 to-teal-100 border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-emerald-400 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(45deg, #10b981 0, #10b981 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px'}} />
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-lg">🐾</span>
                </div>
                <div className="text-center px-3">
                  <div className="text-xs font-bold text-emerald-600 mb-1">REKLAM ALANI</div>
                  <div className="text-[10px] text-emerald-400 font-medium">160 × 280</div>
                  <div className="text-[10px] text-emerald-400 mt-1">Square</div>
                </div>
                <div className="mt-2 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full group-hover:bg-emerald-600 transition-colors">
                  Reklam Ver
                </div>
              </div>
            </a>
          </aside>

        </div>
      </div>
    </div>
  );
}
