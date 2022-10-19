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
import { toJS } from 'mobx'
import get from 'lodash/get'
import PageLoading from '@src/helpers/PageLoading'

const OfferCoursesDetail = dynamic(() => import('@src/components/OfferCoursesDetail'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface CoursesDetailProps {
  token: string
  voucherDetail?: any
}

const CoursesDetail: React.FC<CoursesDetailProps> = (props: CoursesDetailProps) => {
  const { voucherDetail } = props
  console.log(`🚀 ~ file: Page.tsx ~ line 31 ~ voucherDetail`, toJS(voucherDetail))

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
          title={`${get(voucherDetail.voucherInfo, 'name', '')} - VN Direct`}
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
          // keywords=""
          // descriptions=""
        />
        <OfferCoursesDetail />
      </>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getServerSideProps({ query }) {
  const hydrationData = {}
  let voucherDetail = {}
  let voucherStore: VoucherHydration
  const resDetailVoucher = await voucherServices.getVouchersInfo<any>(query.id)
  console.log(`🚀 ~ file: index.tsx ~ line 50 ~ GetServerSideProps ~ resDetailVoucher`, resDetailVoucher)

  // init data here
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
export default withLayout(CoursesDetail)
