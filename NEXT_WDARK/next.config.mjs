/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    localeDetection: true,
  },
  images: {
    domains: ['dev-wdark-2025.pantheonsite.io'],
  },
};

export default nextConfig;