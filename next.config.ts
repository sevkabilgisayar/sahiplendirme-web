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
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
