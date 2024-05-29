/** @type {import('next').NextConfig} */
module.exports = {
  compilerOptions: {
    target: "es2015"
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  },
}
