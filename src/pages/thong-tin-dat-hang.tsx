import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { withServerSideProps } from '@src/helpers/wrapperProps'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import PageLoading from '@src/helpers/PageLoading'
// import * as helloServices from '@src/services/hello.service'
// import HttpStatusCode from '@src/contains/HttpStatusCode'

const PageViewHandler = dynamic(() => import('@src/components/OrderSuccess'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface OrderSuccessProps {
  status: string
}

const OrderSuccess: React.FC<OrderSuccessProps> = (props: OrderSuccessProps) => {
  const { status } = props
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.AOS.init({
        duration: 1500,
      })
    }
  }, [])

  return (
    <Layout>
      <>
        <Helmet
          title={status === '00' ? 'Đặt hàng thành công' : 'Đặt hàng thất bại'}
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

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getStaticProps({ query }) {
  if (!query.status) {
    return {
      props: {},
    }
  }
  if (query.status) {
    return {
      props: {
        status: query.status,
      },
    }
  }
  return {
    props: {},
  }
})

// export const getStaticProps: GetStaticProps = async function getStaticProps() {
//   const resData = await helloServices.hello<any>()
//   console.log(
//     `🚀 ~ file: index.tsx ~ line 62 ~ getServerSideProps ~ resData`,
//     resData
//   )
//   if (
//     !resData ||
//     resData.status !== HttpStatusCode.OK ||
//     resData.data.code !== 0
//   ) {
//     // TODO: no response confirm
//     return {
//       props: {},
//     }
//   }

//   return {
//     props: {},
//   }
// }

export default withLayout(OrderSuccess)
