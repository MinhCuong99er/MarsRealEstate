/* eslint-disable */
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const isProd = process.env.NODE_ENV === 'production'
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.production') })
} else {
  dotenv.config()
}

module.exports = {
  // Use the CDN in production and localhost for development.
  // assetPrefix: isProd ? `${process.env.BASE_URL}` : '',
  // rewrites: async () => nextI18NextRewrites(localeSubpaths),
  // async rewrites() {
  //   return [
  //     {
  //       source: '/:slug*',
  //       destination: '/:slug', // Matched parameters can be used in the destination
  //     },
  //   ];
  // },
  server: {
    // Force the server to use TLSv1.2 or TLSv1.3 only and exclude any other protocols
    secureProtocol: 'TLSv1_2_method',
    ciphers: 'DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5:!3DES:!SHA1',
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'localhost',
      'img.youtube.com',
      'storage.googleapis.com',
      'gravatar.com',
      'admin.mpoint.vn',
      '632466.sgp1.digitaloceanspaces.com',
    ],
    // path: '/_next/image',
    loader: 'default',
  },
  i18n: {
    // These are all the locales you want to support in your application
    locales: ['vi', 'en'],
    // This is the default locale you want to be used when visiting a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'vi',
  },
  serverRuntimeConfig: {
    TOKEN_SECRET: 'c540612b-2391-4b3a-83ae-a4ad5a90aa76',
    SECRET_KEY_CONFIRM: 'd54b74ed-2f5e-4cc4-811d-54e413b8868e',
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    ...process.env,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('jquery')
    }

    return config
  },
}
