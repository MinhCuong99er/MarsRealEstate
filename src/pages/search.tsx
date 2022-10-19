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

const PageViewHandler = dynamic(() => import('@src/components/Search'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface SearchProps {
  token: string
}

const Search: React.FC<SearchProps> = () => {
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
    console.log(`🚀 ~ file: Search.tsx ~ line 62 ~ getServerSideProps ~ resData`, resData);
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

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getServerSideProps({ query }) {
  const hydrationData = {}
  let voucherStore: VoucherHydration
  const resListVoucher = await voucherServices.getListVouchers<any>({
    isHot: 1,
    skip: 0,
    limit: 9,
    keyword: query ? (query.search ? query.search : '') : '',
  })

  // init data here
  if (resListVoucher && resListVoucher.status === HttpStatusCode.OK && resListVoucher.data?.code === 0) {
    voucherStore = {
      hots: resListVoucher?.data?.data,
      pagination: {
        total: resListVoucher?.data?.total ? Number(resListVoucher?.data?.total) : 0,
      },
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
export default withLayout(Search)
