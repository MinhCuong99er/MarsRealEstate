import React from 'react'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import PageLoading from '@src/helpers/PageLoading'
import { withStaticProps } from '@src/helpers/wrapperProps'

const PageViewHandler = dynamic(() => import('@src/components/Auth/ForgotPassword'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  return (
    <Layout>
      <>
        <Helmet
          title="Quên mật khẩu"
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
        />
        <PageViewHandler />
      </>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = withStaticProps(async function getStaticProps() {
  return {
    props: {},
  }
})

export default withLayout(Index)
