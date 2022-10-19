import React, { useEffect } from 'react'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import dynamic from 'next/dynamic'
import PageLoading from '@src/helpers/PageLoading'

const PayWidthPoint = dynamic(() => import('@src/components/PayPoint'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface PayPointProps {}

const PayPoint: React.FC<PayPointProps> = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // $('.container').css({ background: 'red' })
    }
    // handleShowSuccess()
  }, [])

  return (
    <Layout>
      <>
        <Helmet
          title="Thanh toán"
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
          // keywords=""
          // descriptions=""
        />
        <PayWidthPoint />
      </>
    </Layout>
  )
}

export default withLayout(PayPoint)
