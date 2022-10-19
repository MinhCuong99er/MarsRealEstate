import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouter } from 'next/router'
import getConfig from 'next/config'
import i18n from '../locales'

const { publicRuntimeConfig } = getConfig()

interface HelmetHeaderProps {
  title?: string
  keywords?: string
  descriptions?: string
  siteName?: string
  type?: string
  url?: string
  image?: string
  favicon?: string
  children?: React.ReactElement
}

const HelmetHeader: React.FC<HelmetHeaderProps> = (props: HelmetHeaderProps) => {
  const { locale } = useRouter()
  const { title, keywords, descriptions } = props
  const defaultTitle = (i18n[locale] || {}).defaultTitle || ''
  const defaultKeywords = (i18n[locale] || {}).defaultKeywords || ''
  const defaultDescription = (i18n[locale] || {}).defaultDescription || ''
  const defaultOGImage = `${publicRuntimeConfig.APP_IMAGE}`
  const defaultOGSiteName = (i18n[locale] || {}).defaultOGSiteName || ''
  const defaultOGType = (i18n[locale] || {}).defaultOGType || 'website'
  const defaultUrl = `${publicRuntimeConfig.BASE_URL}`
  const favicon = `${publicRuntimeConfig.APP_FAVICON}`

  let keyword = `${defaultKeywords}`
  if (keywords) {
    keyword = `${defaultKeywords}, ${keywords}`
  }
  let description = `${defaultDescription}`
  if (descriptions) {
    description = `${descriptions}`
  }
  return (
    <>
      <Helmet htmlAttributes={{ lang: locale }}>
        <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>{title || defaultTitle}</title>
        <meta name="hreflang" content={`${locale}`} />
        <meta name="keywords" content={`${keyword}`} />
        <meta name="description" content={`${description}`} />
        <meta property="og:site_name" content={props.siteName || defaultOGSiteName} />
        <meta property="og:type" content={props.type || defaultOGType} />
        <meta property="og:url" content={props.url || defaultUrl} />
        <meta property="og:title" content={props.title || defaultTitle} />
        <meta property="og:description" content={`${description}`} />
        <meta property="og:image" content={props.image || defaultOGImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="canonical" href={props.url || defaultUrl} />
        <link rel="icon" href={`${props.favicon || favicon}`} />
        {props?.children}
      </Helmet>
    </>
  )
}

export default HelmetHeader
