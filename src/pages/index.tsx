import React, { useEffect } from 'react'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { withStaticProps } from '@src/helpers/wrapperProps'

// service import here
import * as voucherServices from '@src/services/voucher.service'
import * as productServices from '@src/services/product.service'
import * as globalServices from '@src/services/global.service'
import { VoucherHydration } from '@src/stores/voucher.store'
import { ProductHydration } from '@src/stores/product.store'
import { GlobalHydration } from '@src/stores/global.store'
import { ICategory } from '@src/interfaces/Global'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import PageLoading from '@src/helpers/PageLoading'
import { IApiResponse } from '@src/utils/request'
import { Voucher } from '@src/interfaces/Voucher'
import { Product } from '@src/interfaces/Product'
import { CartType } from '@src/interfaces/enums'

const PageViewHandler = dynamic(() => import('@src/components/home'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface IndexProps {
  token: string
}

const Index: React.FC<IndexProps> = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.AOS.init({
        duration: 1500,
      })
    }
    // handleShowSuccess()
  }, [])

  return (
    <Layout>
      <>
        <Helmet
          title="Trang chủ"
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
          // keywords=""
          // descriptions=""
        />
        <PageViewHandler />
      </>
    </Layout>
  )
}

/* export const getServerSideProps: GetServerSideProps =
  async function getServerSideProps() {
    const resData = await helloServices.hello<any>()
    console.log(`🚀 ~ file: index.tsx ~ line 62 ~ getServerSideProps ~ resData`, resData);
    if (
      !resData ||
      resData.status !== HttpStatusCode.OK ||
      resData.data.code !== 0
    ) {
      // TODO: no response confirm
      return {
        props: {},
      }
    }

    return {
      props: {
        hydrationData: {
          authStore: {
            token: resData?.data?.data?.token,
            auth: resData?.data?.data?.auth,
          },
        },
      },
    }
  } */

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

export default withLayout(Index)
