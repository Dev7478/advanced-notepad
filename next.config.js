/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators : false,
};

module.exports = {
  eslint: {
    // Remove any deprecated options
    dirs:['app','components'], // specify directories to lint
  },
}
