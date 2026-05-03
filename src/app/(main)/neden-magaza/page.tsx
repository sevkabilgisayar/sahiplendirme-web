import { Store, TrendingUp, ShieldCheck, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function NedenMagazaPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-violet-800 text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-950 to-transparent" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
            <Store size={16} className="text-violet-300" />
            <span className="text-sm font-medium text-violet-100">Kurumsal Mağazacılık</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold font-display leading-tight mb-6">
            Milyonlarca Hayvansevere <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-pink-300">Doğrudan Ulaşın</span>
          </h1>
          <p className="text-lg text-indigo-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Sahiplendirme.com mağazanız ile ürünlerinizi doğru hedef kitleye satın, marka bilinirliğinizi artırın ve e-ticaret satışlarınızı katlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/magaza-ac" className="bg-white text-indigo-900 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-2">
              Hemen Mağaza Aç <ArrowRight size={18} />
            </Link>
            <Link href="/paketler" className="bg-indigo-800 border border-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              Paketleri İncele
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-display text-[var(--foreground)] mb-4">Neden Bizimle Çalışmalısınız?</h2>
          <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto">Sadece evcil hayvan sektörüne odaklanan pazar yerimizde yerinizi alarak rakiplerinizin bir adım önüne geçin.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Users size={24} />,
              title: "Doğrudan Hedef Kitle",
              desc: "Platformumuzu ziyaret eden yüz binlerce aktif hayvansever direkt olarak sizin potansiyel müşterinizdir.",
              color: "text-blue-600",
              bg: "bg-blue-50"
            },
            {
              icon: <TrendingUp size={24} />,
              title: "Yüksek Dönüşüm",
              desc: "Genel e-ticaret sitelerine kıyasla, niş kitlemiz sayesinde ürünlerinizin satışa dönüşme oranı %300 daha yüksektir.",
              color: "text-emerald-600",
              bg: "bg-emerald-50"
            },
            {
              icon: <ShieldCheck size={24} />,
              title: "Güvenilir Marka Algısı",
              desc: "Sahiplendirme.com güvencesiyle satış yaparak müşterilerinizde %100 güven oluşturun.",
              color: "text-violet-600",
              bg: "bg-violet-50"
            }
          ].map((feat, i) => (
            <div key={i} className="bg-white border border-[var(--border)] p-8 rounded-3xl hover:shadow-xl transition-shadow group">
              <div className={`w-14 h-14 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-[var(--foreground-muted)] leading-relaxed text-sm">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px'}} />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-6">Satışlara Başlamak İçin Hazır Mısınız?</h2>
            <p className="text-emerald-50 mb-10 text-lg max-w-xl mx-auto">Sadece birkaç adımda kurumsal mağazanızı açın ve binlerce yeni müşteriye ulaşmaya bugünden başlayın.</p>
            <Link href="/magaza-ac" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-10 py-4 rounded-xl hover:bg-emerald-50 hover:scale-105 transition-all shadow-xl">
              Hemen Başvur <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
