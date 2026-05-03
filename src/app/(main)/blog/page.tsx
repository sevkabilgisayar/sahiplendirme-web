import Link from 'next/link';
import { ArrowRight, Clock, User, Tag } from 'lucide-react';

export const mockBlogPosts = [
  {
    slug: 'kopek-sahiplenme-rehberi',
    title: 'Köpek Sahiplenirken Dikkat Edilmesi Gerekenler',
    excerpt: 'İlk kez köpek sahiplenecekler için kapsamlı rehber. Irk seçimi, hazırlık süreci ve yeni dostunuzla uyum dönemi hakkında bilmeniz gereken her şey.',
    content: 'Uzun makale içeriği burada yer alacak.',
    category: 'Sahiplendirme',
    categoryColor: 'bg-blue-100 text-blue-700',
    author: 'Dr. Ayşe Yılmaz',
    authorRole: 'Veteriner Hekim',
    date: '2024-01-20',
    readTime: '8 dk',
    cover: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    slug: 'kedi-beslenmesi',
    title: 'Kedinizin Yaşına Göre Doğru Beslenme Rehberi',
    excerpt: 'Yavru kedi, yetişkin ve yaşlı kediler için beslenme önerileri. Hangi besinler zararlı, hangileri faydalı? Uzman veteriner görüşleri.',
    content: 'Uzun makale içeriği burada yer alacak.',
    category: 'Sağlık',
    categoryColor: 'bg-green-100 text-green-700',
    author: 'Vet. Mehmet Kaya',
    authorRole: 'Feline Uzmanı',
    date: '2024-01-15',
    readTime: '6 dk',
    cover: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    slug: 'kayip-hayvan-ihbar',
    title: 'Kayıp Hayvana Rastladığınızda Ne Yapmalısınız?',
    excerpt: 'Sokakta kayıp bir hayvan gördüğünüzde atmanız gereken adımlar. Doğru ihbar yöntemi, geçici bakım ve sahibini bulma süreci.',
    content: 'Uzun makale içeriği burada yer alacak.',
    category: 'Barınak Haberleri',
    categoryColor: 'bg-red-100 text-red-700',
    author: 'Sahiplendirme.com Ekibi',
    authorRole: 'Platform Editörü',
    date: '2024-01-10',
    readTime: '5 dk',
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    slug: 'kopek-egitim-ipuclari',
    title: '5 Temel Komut: Köpeğinizi Evde Nasıl Eğitirsiniz?',
    excerpt: '"Otur", "Dur", "Gel", "Yere yat", "Bırak" — Temel komutları öğretmek için aşamalı pozitif pekiştirme yöntemi.',
    content: 'Uzun makale içeriği burada yer alacak.',
    category: 'Eğitim',
    categoryColor: 'bg-purple-100 text-purple-700',
    author: 'Emre Demir',
    authorRole: 'Sertifikalı Eğitmen',
    date: '2024-01-05',
    readTime: '10 dk',
    cover: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    slug: 'sahiplendirme-hikayesi-boncuk',
    title: 'Boncuk\'un Hikayesi: Barınaktan Sıcak Bir Yuvaya',
    excerpt: 'Ankara barınağında 8 ay kalan Boncuk\'un sahiplendirilme sürecini anlattık. İlk günden bugüne dönüşümün duygusal hikayesi.',
    content: 'Uzun makale içeriği burada yer alacak.',
    category: 'Sahiplendirme Hikayeleri',
    categoryColor: 'bg-orange-100 text-orange-700',
    author: 'Zeynep Arslan',
    authorRole: 'Topluluk Üyesi',
    date: '2023-12-28',
    readTime: '4 dk',
    cover: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    slug: 'tuy-bakimi-mevsim',
    title: 'Mevsim Değişikliklerinde Tüy Bakımı',
    excerpt: 'İlkbahar ve sonbahar dönemlerinde yoğunlaşan tüy dökülmesi sorununu aşmanın pratik yolları. Hangi fırça doğru?',
    content: 'Uzun makale içeriği burada yer alacak.',
    category: 'Bakım',
    categoryColor: 'bg-pink-100 text-pink-700',
    author: 'Selin Çelik',
    authorRole: 'Pet Groomer',
    date: '2023-12-20',
    readTime: '7 dk',
    cover: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop',
    featured: false,
  },
];

const CATEGORIES = ['Tümü', 'Sağlık', 'Bakım', 'Eğitim', 'Barınak Haberleri', 'Sahiplendirme Hikayeleri', 'Sahiplendirme'];

export default function BlogPage() {
  const featured = mockBlogPosts.find(p => p.featured);
  const rest = mockBlogPosts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-rose-50 border-b border-[var(--border)] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            📝 Sahiplendirme.com Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            Evcil Hayvanlar İçin <span className="text-gradient">Uzman Rehberleri</span>
          </h1>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Veteriner hekimler, eğitmenler ve deneyimli hayvan severlerden sağlık, bakım ve eğitim içerikleri.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`text-sm font-semibold px-4 py-2 rounded-full border transition-all ${
                cat === 'Tümü'
                  ? 'gradient-brand text-white border-transparent'
                  : 'border-[var(--border)] bg-white hover:border-[var(--brand-primary-light)] text-[var(--foreground-muted)] hover:text-[var(--brand-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block mb-12">
            <div className="relative rounded-3xl overflow-hidden border border-[var(--border)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0">
                <img src={featured.cover} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
              <div className="relative z-10 p-8 sm:p-12 min-h-[380px] flex flex-col justify-end">
                <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 ${featured.categoryColor}`}>
                  {featured.category}
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mb-3 max-w-2xl">{featured.title}</h2>
                <p className="text-white/80 max-w-xl text-sm mb-5">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-white/70 text-xs">
                  <span className="flex items-center gap-1.5"><User size={13} /> {featured.author}</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} /> {featured.readTime} okuma</span>
                  <span>{featured.date}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={post.cover} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${post.categoryColor}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 gradient-brand rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {post.author[0]}
                      </div>
                      <span className="font-medium">{post.author.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <button className="flex items-center gap-2 mx-auto bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand-primary)] text-[var(--foreground-muted)] hover:text-[var(--brand-primary)] font-semibold px-6 py-3 rounded-xl transition-all">
            Daha Fazla Yükle <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
