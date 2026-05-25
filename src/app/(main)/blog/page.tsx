import Link from 'next/link';
import { ArrowRight, Clock, User, Tag } from 'lucide-react';
import { db } from '@/lib/db';

const CATEGORIES = ['Tümü', 'Sağlık', 'Bakım', 'Eğitim', 'Barınak Haberleri', 'Sahiplendirme Hikayeleri', 'Sahiplendirme'];

export default async function BlogPage() {
  const postsRaw = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  const posts = postsRaw.map(p => ({
    ...p,
    cover: p.image || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    categoryColor: p.category === 'Sağlık' ? 'bg-green-100 text-green-700' : p.category === 'Eğitim' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700',
    date: new Date(p.createdAt).toLocaleDateString('tr-TR')
  }));

  const featured = posts.length > 0 ? posts[0] : null;
  const rest = posts.length > 1 ? posts.slice(1) : [];

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

        {posts.length === 0 && (
          <div className="text-center py-20 text-[var(--foreground-muted)]">
            Henüz blog yazısı bulunmamaktadır.
          </div>
        )}

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
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1.5"><Tag size={13} /> {featured.viewCount} okuma</span>
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
                    <div className="flex items-center gap-3">
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
