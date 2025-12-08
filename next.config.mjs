/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.88:9002/:path*',
      },
    ];
  },
};

export default nextConfig;
