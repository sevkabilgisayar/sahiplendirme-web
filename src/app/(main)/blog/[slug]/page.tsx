import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> | any }) {
  const resolvedParams = await params;
  
  const postRaw = await db.blogPost.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!postRaw) {
    notFound();
  }

  const relatedRaw = await db.blogPost.findMany({
    where: { 
      slug: { not: resolvedParams.slug },
      category: postRaw.category
    },
    take: 3
  });

  const post = {
    ...postRaw,
    cover: postRaw.image || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    categoryColor: postRaw.category === 'Sağlık' ? 'bg-green-100 text-green-700' : postRaw.category === 'Eğitim' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700',
    date: new Date(postRaw.createdAt).toLocaleDateString('tr-TR')
  };

  const related = relatedRaw.map((rp: any) => ({
    ...rp,
    cover: rp.image || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    categoryColor: rp.category === 'Sağlık' ? 'bg-green-100 text-green-700' : rp.category === 'Eğitim' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700',
    date: new Date(rp.createdAt).toLocaleDateString('tr-TR')
  }));

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
            <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
            <div>
              <div className="font-semibold text-[var(--foreground)]">Admin</div>
              <div className="text-xs">Sahiplendirme.com</div>
            </div>
          </div>
          <span>{post.date}</span>
          <span className="flex items-center gap-1"><Tag size={14} /> {post.viewCount} okuma</span>
        </div>

        {/* Cover */}
        <div className="rounded-2xl overflow-hidden mb-10 border border-[var(--border)]">
          <img src={post.cover} alt={post.title} className="w-full h-64 sm:h-96 object-cover" />
        </div>

        {/* Content */}
        <div className="prose prose-sm sm:prose max-w-none text-[var(--foreground-muted)] leading-relaxed space-y-4 mb-16">
          <p className="text-base font-medium text-[var(--foreground)]">{post.excerpt}</p>
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
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
                      <Clock size={10} /> {rp.date}
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
