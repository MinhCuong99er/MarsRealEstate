import React, { useEffect } from 'react'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import { withStaticProps } from '@src/helpers/wrapperProps'
/* import { VoucherHydration } from '@src/stores/voucher.store'
import * as voucherServices from '@src/services/voucher.service'
import * as globalServices from '@src/services/global.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { Voucher } from '@src/interfaces/Voucher'
import { IApiResponse } from '@src/utils/request'
import { GlobalHydration } from '@src/stores/global.store'
import { ICategory } from '@src/interfaces/Global'
import { CartType } from '@src/interfaces/enums' */
import PageLoading from '@src/helpers/PageLoading'

const NearestVoucherPage = dynamic(() => import('@src/components/NearestVoucher'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface NearestVoucherProps {}

const NearestVoucher: React.FC<NearestVoucherProps> = () => {
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
          title="Ưu đãi quanh đây"
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
          // keywords=""
          // descriptions=""
        />
        <NearestVoucherPage />
      </>
    </Layout>
  )
}

/* export const getStaticProps: GetStaticProps = withStaticProps(
  async function getServerSideProps() {
    const hydrationData = {}
    let voucherStore: VoucherHydration
    let globalStore: GlobalHydration
    const resListVoucher: IApiResponse<ResponseType<Voucher>> =
      await voucherServices.getListVouchers<ResponseType<Voucher>>({
        // isHot: 1,
        skip: 0,
        limit: Config.PAGE_SIZE,
      })
    const resCateVoucher: IApiResponse<ResponseType<ICategory>> =
      await globalServices.getListCategory<ResponseType<ICategory>>(
        CartType.VOUCHER
      )
    const resCateProduct: IApiResponse<ResponseType<ICategory>> =
      await globalServices.getListCategory<ResponseType<ICategory>>(
        CartType.PRODUCT
      )

    // init data here
    if (
      (resListVoucher && resListVoucher.status === HttpStatusCode.OK) ||
      resListVoucher.data?.code === 0
    ) {
      voucherStore = {
        hots: resListVoucher?.data?.data as Voucher[],
        pagination: {
          total: resListVoucher?.data?.total
            ? Number(resListVoucher?.data?.total)
            : 0,
        },
      }
    }
    if (
      (resCateVoucher && resCateVoucher.status === HttpStatusCode.OK) ||
      resCateVoucher.data?.code === 0
    ) {
      if (!globalStore) globalStore = {}
      Object.assign(globalStore, {
        voucherCategories: resCateVoucher?.data?.data as ICategory[],
      })
    }
    if (
      (resCateProduct && resCateProduct.status === HttpStatusCode.OK) ||
      resCateProduct.data?.code === 0
    ) {
      if (!globalStore) globalStore = {}
      Object.assign(globalStore, {
        productCategories: resCateProduct?.data?.data as ICategory[],
      })
    }

    // hydrationData
    if (voucherStore) {
      Object.assign(hydrationData, { voucherStore })
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
  }
) */

export const getStaticProps: GetStaticProps = withStaticProps(async function getServerSideProps() {
  return {
    props: {},
  }
})
export default withLayout(NearestVoucher)
