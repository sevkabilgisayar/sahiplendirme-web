import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';
import { mockBlogPosts } from '../page';

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = mockBlogPosts.find(p => p.slug === params.slug) || mockBlogPosts[0];
  const related = mockBlogPosts.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--background)] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--brand-primary)] mb-8 transition-colors">
          <ArrowLeft size={16} /> Blog'a Dön
        </Link>

        {/* Category */}
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${post.categoryColor}`}>{post.category}</span>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold font-display mt-4 mb-4 leading-tight">{post.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)] mb-8 pb-8 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white text-xs font-bold">{post.author[0]}</div>
            <div>
              <div className="font-semibold text-[var(--foreground)]">{post.author}</div>
              <div className="text-xs">{post.authorRole}</div>
            </div>
          </div>
          <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} okuma</span>
          <span>{post.date}</span>
        </div>

        {/* Cover */}
        <div className="rounded-2xl overflow-hidden mb-10 border border-[var(--border)]">
          <img src={post.cover} alt={post.title} className="w-full h-64 sm:h-96 object-cover" />
        </div>

        {/* Content */}
        <div className="prose prose-sm sm:prose max-w-none text-[var(--foreground-muted)] leading-relaxed space-y-4 mb-16">
          <p className="text-base font-medium text-[var(--foreground)]">{post.excerpt}</p>
          <p>Evcil hayvan sahiplenme süreci, hem hayvan hem de sahip için önemli bir dönüm noktasıdır. Bu süreçte doğru adımları atmak, uzun ve mutlu bir birlikteliğin temelini oluşturur.</p>
          <h2 className="text-xl font-bold text-[var(--foreground)] mt-6">Hazırlık Süreci</h2>
          <p>Hayvan sahiplenmeden önce evinizi, yaşam tarzınızı ve bütçenizi değerlendirin. Irkın gereksinimleri, enerji düzeyi ve bakım ihtiyaçları gibi faktörler önemlidir.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Yaşam alanınızın uygunluğunu değerlendirin</li>
            <li>Veteriner masrafları için bütçe ayırın</li>
            <li>Aile üyelerinin görüşünü alın</li>
            <li>Tatil ve seyahat planlarınızı gözden geçirin</li>
          </ul>
          <h2 className="text-xl font-bold text-[var(--foreground)] mt-6">İlk Günler</h2>
          <p>Yeni evinize gelen can dostunuz için sabırlı olun. Adaptasyon süreci günler hatta haftalar sürebilir. Sakin ve güvenli bir ortam sağlamak kritik önem taşır.</p>
          <p>Veteriner ziyaretini ilk hafta içinde gerçekleştirin ve genel sağlık kontrolü, aşılama takvimine uyun.</p>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold font-display mb-6">İlgili Yazılar</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map(rp => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block bg-white border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="h-32 overflow-hidden">
                    <img src={rp.cover} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rp.categoryColor}`}>{rp.category}</span>
                    <h3 className="text-sm font-semibold mt-2 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">{rp.title}</h3>
                    <p className="text-xs text-[var(--foreground-muted)] mt-1 flex items-center gap-1">
                      <Clock size={10} /> {rp.readTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
