import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/sahiplendirme',
        destination: '/ilanlar?kategori=sahiplendirme',
        permanent: true,
      },
      {
        source: '/kayip',
        destination: '/ilanlar?kategori=kayip',
        permanent: true,
      },
      {
        source: '/ciftlestirme',
        destination: '/ilanlar?kategori=ciftlestirme',
        permanent: true,
      },
      {
        source: '/hizmetler',
        destination: '/ilanlar?kategori=hizmetler',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
