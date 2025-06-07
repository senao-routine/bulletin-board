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
  trailingSlash: true,
  distDir: 'out',
}

export default nextConfig
