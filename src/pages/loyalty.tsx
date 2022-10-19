import { withServerSideProps } from '@src/helpers/wrapperProps'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import * as userServies from '@src/services/user.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { IUserResponse } from '@src/interfaces/User'
import PageLoading from '@src/helpers/PageLoading'
import { PAGE_ERROR } from '@src/interfaces/enums'
import PageError from '@src/components/Error/PageError'

interface IRedirectPage {
  isLogin?: boolean
}

const RedirectPage: FC<IRedirectPage> = (props: IRedirectPage) => {
  const router = useRouter()
  const { isLogin } = props

  useEffect(() => {
    if (isLogin) {
      setTimeout(() => {
        router.replace('/')
      }, 1000)
    }
  }, [])

  if (isLogin) {
    return <PageLoading />
  }
  return <PageError title={PAGE_ERROR.PAGE_404} />
}

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getServerSideProps({ query }) {
  if (!query.token) {
    return {
      props: {},
    }
  }
  const a: any = {}
  const resInfo = await userServies.getCustomerInfo<IUserResponse>(a, query.token)
  if (resInfo && resInfo.status === HttpStatusCode.OK && resInfo.data && resInfo.data?.code === 0) {
    console.log(`🚀 ~ file: redirect.tsx ~ line 51 ~ getStaticProps ~ resInfo.data`, resInfo.data)
    return {
      props: {
        isLogin: true,
        hydrationData: {
          authStore: {
            token: query.token,
            auth: resInfo.data?.userInfo,
            calculateTier: resInfo.data?.calculateTier,
            tierInfos: resInfo.data?.tierInfos,
          },
        },
      },
    }
  }
  return {
    props: {},
  }
})
export default RedirectPage
