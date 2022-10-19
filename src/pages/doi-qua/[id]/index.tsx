import React from 'react'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { withServerSideProps } from '@src/helpers/wrapperProps'
import { VoucherHydration } from '@src/stores/voucher.store'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { toJS } from 'mobx'
import get from 'lodash/get'
import PageLoading from '@src/helpers/PageLoading'
// service import here
import * as voucherServices from '@src/services/voucher.service'
// import * as userServices from '@src/services/user.service'
// import { IUserResponse } from '@src/interfaces/User'

const VoucherDetail = dynamic(() => import('@src/components/VoucherDetail'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface VoucherProps {
  token: string
  voucherDetail?: any
  isLogin?: boolean
}

const Voucher: React.FC<VoucherProps> = (props: VoucherProps) => {
  const { voucherDetail } = props

  return (
    <Layout>
      <>
        <Helmet
          title={`${get(voucherDetail.voucherInfo, 'name', '')} - VN Direct`}
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
          // keywords=""
          // descriptions=""
        />
        <VoucherDetail />
      </>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getServerSideProps({ query }) {
  const hydrationData = {}
  let voucherDetail = {}
  let voucherStore: VoucherHydration
  /* ===== xử lý query: voucherId, refId, phone từ viettel truyền về ===== */
  /* if (query.voucherId && query.refId && query.phone) {
    const tokenPayload = {
      voucherId: query.voucherId,
      refId: query.refId,
      phone: query.phone,
    }
    const resInfo = await userServices.getCustomerInfo<IUserResponse>(tokenPayload, )
    if (resInfo && resInfo.status === HttpStatusCode.OK && resInfo.data && resInfo.data?.code === 0) {
      Object.assign(hydrationData, {
        authStore: {
          tokenPayload: tokenPayload,
          token: resInfo.data?.accessToken,
          auth: resInfo.data?.userInfo,
        },
      })
    }
  }
 */
  /* BEGIN VOUCHER DETAIL */
  const resDetailVoucher = await voucherServices.getVouchersInfo<any>(query.id)

  // thông tin voucher từ api
  if ((resDetailVoucher && resDetailVoucher.status === HttpStatusCode.OK) || resDetailVoucher.data?.code === 0) {
    voucherStore = {
      detail: resDetailVoucher?.data?.data,
    }
    voucherDetail = resDetailVoucher?.data?.data
  }

  // hydrationData
  if (voucherStore) {
    Object.assign(hydrationData, { voucherStore })
  }
  if (Object.keys(hydrationData).length > 0) {
    return {
      props: {
        hydrationData,
        voucherDetail,
      },
    }
  }
  return {
    props: {},
  }
})

export default withLayout(Voucher)
