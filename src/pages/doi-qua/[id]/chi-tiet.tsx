import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'

import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { withServerSideProps } from '@src/helpers/wrapperProps'
// service import here
import * as voucherServices from '@src/services/voucher.service'
import { VoucherHydration } from '@src/stores/voucher.store'
import PageLoading from '@src/helpers/PageLoading'

const Product = dynamic(() => import('@src/components/SwapNow'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface ProductDetailProps {
  token: string
}

const ProductDetail: React.FC<ProductDetailProps> = () => {
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
          title="Chi tiết sản phẩm"
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
          // keywords=""
          // descriptions=""
        />
        <Product />
      </>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getServerSideProps({ query }) {
  const hydrationData = {}
  let voucherStore: VoucherHydration
  const resDetailVoucher = await voucherServices.getVouchersInfo<any>(query.id)
  console.log(`🚀 ~ file: index.tsx ~ line 50 ~ GetServerSideProps ~ resDetailVoucher`, resDetailVoucher)

  // init data here
  if ((resDetailVoucher && resDetailVoucher.status === HttpStatusCode.OK) || resDetailVoucher.data?.code === 0) {
    voucherStore = {
      detail: resDetailVoucher?.data?.data,
    }
  }

  // hydrationData
  if (voucherStore) {
    Object.assign(hydrationData, { voucherStore })
  }
  if (Object.keys(hydrationData).length > 0) {
    return {
      props: {
        hydrationData,
      },
    }
  }
  return {
    props: {},
  }
})

export default withLayout(ProductDetail)
