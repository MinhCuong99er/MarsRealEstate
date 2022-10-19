import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { withStaticProps } from '@src/helpers/wrapperProps'
// service import here
import * as voucherServices from '@src/services/voucher.service'
import { VoucherHydration } from '@src/stores/voucher.store'
import { AuthHydration } from '@src/stores/auth.store'
import { GetStaticProps } from 'next'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { Voucher } from '@src/interfaces/Voucher'
import { IApiResponse } from '@src/utils/request'
import PageLoading from '@src/helpers/PageLoading'

const OfferCoursesDetail = dynamic(() => import('@src/components/OfferCourses'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface OfferCoursesProps {
  token: string
}

const OfferCourses: React.FC<OfferCoursesProps> = () => {
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
          title="Ưu đãi khóa học"
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

export const getStaticProps: GetStaticProps = withStaticProps(async function getStaticProps() {
  const hydrationData = {}
  let authStore: AuthHydration
  let voucherStore: VoucherHydration
  const resListCourses: IApiResponse<ResponseType<Voucher>> = await voucherServices.getListCourses<
    ResponseType<Voucher>
  >({
    types: 'course',
    skip: 0,
    limit: Config.PAGE_SIZE,
  })
  console.log(`🚀 ~ file: index.tsx ~ line 88 ~ getStaticProps ~ resListCourses`, resListCourses)

  // init data here
  /* if (
      (resData && resData.status === HttpStatusCode.OK) ||
      resData.data.code === 0
    ) {
      authStore = {
        token: resData?.data?.data?.token,
        auth: resData?.data?.data?.auth,
      }
    } */
  if ((resListCourses && resListCourses.status === HttpStatusCode.OK) || resListCourses.data?.code === 0) {
    voucherStore = {
      courses: resListCourses?.data?.data as Voucher[],
      pagination: {
        total: resListCourses?.data?.total ? Number(resListCourses?.data?.total) : 0,
      },
    }
  }

  // hydrationData
  if (authStore) {
    Object.assign(hydrationData, { authStore })
  }
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

export default withLayout(OfferCourses)
