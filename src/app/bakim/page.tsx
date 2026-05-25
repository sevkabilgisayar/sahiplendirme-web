import React from 'react';
import { Hammer } from 'lucide-react';

export default function BakimPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Hammer className="text-orange-500" size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Yapım Aşamasında</h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Sahiplendirme.com çok yakında yepyeni yüzüyle hizmetinizde olacak! Size daha iyi hizmet verebilmek için altyapı çalışmalarımız devam ediyor.
        </p>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full w-2/3 animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-400 mt-4 font-medium">Lütfen daha sonra tekrar ziyaret edin.</p>
      </div>
    </div>
  );
}
