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
import * as productServices from '@src/services/product.service'
import { ProductHydration } from '@src/stores/product.store'
import PageLoading from '@src/helpers/PageLoading'

const Product = dynamic(() => import('@src/components/SwapNowProduct'), {
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
  let productStore: ProductHydration
  const resDetailProduct = await productServices.getProductsInfo<any>(query.id)

  // init data here
  if ((resDetailProduct && resDetailProduct.status === HttpStatusCode.OK) || resDetailProduct.data?.code === 0) {
    productStore = {
      detail: resDetailProduct?.data?.data,
    }
  }

  // hydrationData
  if (productStore) {
    Object.assign(hydrationData, { productStore })
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
