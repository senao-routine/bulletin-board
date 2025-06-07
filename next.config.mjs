/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  // Firebaseでのホスティングに必要な設定
  trailingSlash: false,
  distDir: 'out',
}

export default nextConfig
