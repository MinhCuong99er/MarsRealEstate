import '../styles/index.scss'

import { useEffect } from 'react'
// import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import RootStoreProvider from '@src/providers/RootStoreProvider'
import * as gtag from '../lib/gtag'

function MyApp({ Component, pageProps }: any) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
      NProgress.done()
    }
    const handleStart = () => {
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router.events])

  return (
    <RootStoreProvider hydrationData={pageProps.hydrationData}>
      <Component {...pageProps} />
    </RootStoreProvider>
  )
}

export default MyApp
