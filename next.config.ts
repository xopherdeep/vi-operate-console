import withBundleAnalyzer from '@next/bundle-analyzer';
import { type RemotePattern } from 'next/dist/shared/lib/image-config';
import type { NextConfig } from 'next';

const config: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  turbopack: {},

  experimental: {
    // optimizeCss: true,
    serverActions: {
      bodySizeLimit: "2mb",
    }
  },

  images: {
    domains: [
      "operate.vi.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
        port: "",
      } as RemotePattern,
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
        pathname: "/**",
        port: "",
      } as RemotePattern,
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
        port: "",
      } as RemotePattern,
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  async redirects() {
    return [];
  },
};

export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzer()(config)
  : config;
