import React, { useEffect } from 'react'
import { GetStaticProps } from 'next'

import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import { withStaticProps } from '@src/helpers/wrapperProps'
import { VoucherHydration } from '@src/stores/voucher.store'
import * as voucherServices from '@src/services/voucher.service'
import * as productServices from '@src/services/product.service'
import * as globalServices from '@src/services/global.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { Voucher } from '@src/interfaces/Voucher'
import { IApiResponse } from '@src/utils/request'
import { GlobalHydration } from '@src/stores/global.store'
import { ICategory } from '@src/interfaces/Global'
import { CartType } from '@src/interfaces/enums'
import PageLoading from '@src/helpers/PageLoading'
import { ProductHydration } from '@src/stores/product.store'
import { Product } from '@src/interfaces/Product'

const SwapGiftDetail = dynamic(() => import('@src/components/SwapGift'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface SwapGiftProps {
  token: string
}

const SwapGift: React.FC<SwapGiftProps> = () => {
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
          title="Đổi quà"
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
          // keywords=""
          // descriptions=""
        />
        <SwapGiftDetail />
      </>
    </Layout>
  )
}
export const getStaticProps: GetStaticProps = withStaticProps(async function getStaticProps() {
  const hydrationData = {}
  let voucherStore: VoucherHydration
  let productStore: ProductHydration
  let globalStore: GlobalHydration
  const resListVoucher: IApiResponse<ResponseType<Voucher>> = await voucherServices.getListVouchers<
    ResponseType<Voucher>
  >({
    isHot: 1,
    skip: 0,
    limit: Config.PAGE_SIZE,
  })
  const resListProduct: IApiResponse<ResponseType<Product>> = await productServices.getListProducts<
    ResponseType<Product>
  >({
    isHot: 1,
    skip: 0,
    limit: Config.PAGE_SIZE,
  })
  const resCateVoucher: IApiResponse<ResponseType<ICategory>> = await globalServices.getListCategory<
    ResponseType<ICategory>
  >(CartType.VOUCHER)
  const resCateProduct: IApiResponse<ResponseType<ICategory>> = await globalServices.getListCategory<
    ResponseType<ICategory>
  >(CartType.PRODUCT)

  // init data here
  if (resListVoucher && resListVoucher.status === HttpStatusCode.OK && resListVoucher.data?.code === 0) {
    voucherStore = {
      hots: resListVoucher?.data?.data as Voucher[],
      pagination: {
        total: resListVoucher?.data?.total ? Number(resListVoucher?.data?.total) : 0,
      },
    }
  }
  if (resListProduct && resListProduct.status === HttpStatusCode.OK && resListProduct.data?.code === 0) {
    productStore = {
      hots: resListProduct?.data?.data as Product[],
      pagination: {
        total: resListProduct?.data?.total ? Number(resListProduct?.data?.total) : 0,
      },
    }
  }
  if (resCateVoucher && resCateVoucher.status === HttpStatusCode.OK && resCateVoucher.data?.code === 0) {
    if (!globalStore) globalStore = {}
    Object.assign(globalStore, {
      voucherCategories: resCateVoucher?.data?.data as ICategory[],
    })
  }
  if (resCateProduct && resCateProduct.status === HttpStatusCode.OK && resCateProduct.data?.code === 0) {
    if (!globalStore) globalStore = {}
    Object.assign(globalStore, {
      productCategories: resCateProduct?.data?.data as ICategory[],
    })
  }

  // hydrationData
  if (voucherStore) {
    Object.assign(hydrationData, { voucherStore })
  }
  if (productStore) {
    Object.assign(hydrationData, { productStore })
  }
  if (globalStore) {
    Object.assign(hydrationData, { globalStore })
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
export default withLayout(SwapGift)
