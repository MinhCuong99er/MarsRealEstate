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
import { toJS } from 'mobx'
import get from 'lodash/get'
import PageLoading from '@src/helpers/PageLoading'

const ProductDetail = dynamic(() => import('@src/components/ProductDetail'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface ProductProps {
  token: string
  productDetail?: any
}

const Product: React.FC<ProductProps> = (props: ProductProps) => {
  const { productDetail } = props
  console.log(`🚀 ~ file: Page.tsx ~ line 31 ~ productDetail`, toJS(productDetail))

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
          title={`${get(productDetail, 'productTypeInfo.name', 'Đổi quà') || 'Đổi quà'} - VN Direct`}
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
          // keywords=""
          // descriptions=""
        />
        {!productDetail ? <h1>Sản phẩm chưa có thông tin!</h1> : <ProductDetail />}
      </>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getServerSideProps({ query }) {
  const hydrationData = {}
  let productDetail = {}
  let productStore: ProductHydration
  const resDetailProduct = await productServices.getProductsInfo<any>(query.id)

  // init data here
  if (resDetailProduct && resDetailProduct.status === HttpStatusCode.OK && resDetailProduct.data?.code === 0) {
    productStore = {
      detail: resDetailProduct?.data?.data,
    }
    productDetail = resDetailProduct?.data?.data ?? null
  }

  // hydrationData
  if (productStore) {
    Object.assign(hydrationData, { productStore })
  }
  if (Object.keys(hydrationData).length > 0) {
    return {
      props: {
        hydrationData,
        productDetail,
      },
    }
  }
  return {
    props: {},
  }
})

export default withLayout(Product)
