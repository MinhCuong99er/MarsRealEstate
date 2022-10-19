import React from 'react'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
// import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import { withServerSideProps } from '@src/helpers/wrapperProps'
import * as voucherServices from '@src/services/voucher.service'
import PageLoading from '@src/helpers/PageLoading'
import { VoucherHydration } from '@src/stores/voucher.store'
import HttpStatusCode from '@src/contains/HttpStatusCode'
// service import here

const VoucherCodePage = dynamic(() => import('@src/components/VoucherCodePage'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface VoucherCodeProps {}

const VoucherCode: React.FC<VoucherCodeProps> = (props: VoucherCodeProps) => {
  const {} = props

  return (
    <>
      <Helmet
        title={`Trang thông tin mã code`}
        url={`${Config.publicRuntimeConfig.BASE_URL}`}
        image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
        // keywords=""
        // descriptions=""
      />
      <VoucherCodePage />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getServerSideProps({ query }) {
  const hydrationData = {}
  let voucherStore: VoucherHydration
  const resDetailVoucher = await voucherServices.getVoucherByCode<any>(query.code)
  // init data here
  if ((resDetailVoucher && resDetailVoucher.status === HttpStatusCode.OK) || resDetailVoucher.data?.code === 0) {
    voucherStore = {
      voucherCodeDetail: resDetailVoucher?.data?.voucher,
      voucherCodeInfo: resDetailVoucher?.data?.codeInfo,
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

export default withLayout(VoucherCode)
