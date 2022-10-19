import getConfig from 'next/config'

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()
const PAGE_SIZE = publicRuntimeConfig.PAGE_SIZE ? Number(publicRuntimeConfig.PAGE_SIZE) : 9
const PAGE_SIZE_HOMEPAGE = publicRuntimeConfig.PAGE_SIZE_HOMEPAGE ? Number(publicRuntimeConfig.PAGE_SIZE_HOMEPAGE) : 6

export default {
  publicRuntimeConfig,
  serverRuntimeConfig,
  PAGE_SIZE,
  PAGE_SIZE_HOMEPAGE,
}
