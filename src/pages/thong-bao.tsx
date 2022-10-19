import React, { useEffect } from 'react'
// import { /* GetServerSideProps,  */ GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import PageLoading from '@src/helpers/PageLoading'
// import * as helloServices from '@src/services/hello.service'
// import HttpStatusCode from '@src/contains/HttpStatusCode'

const PageViewHandler = dynamic(() => import('@src/components/Notifications'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface NotificationsProps {
  token: string
}

const Notifications: React.FC<NotificationsProps> = () => {
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
          title="Thông báo"
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

export default withLayout(Notifications)
