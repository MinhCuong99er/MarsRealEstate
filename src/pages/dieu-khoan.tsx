import React, { useEffect } from 'react'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import PageLoading from '@src/helpers/PageLoading'
import { withStaticProps } from '@src/helpers/wrapperProps'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { GlobalHydration } from '@src/stores/global.store'
import { IQuestionAnswer } from '@src/interfaces/Global'

import * as globalServices from '@src/services/global.service'

const PageViewHandler = dynamic(() => import('@src/components/ConditionsTerms'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface ConditionsTermsProps {
  token: string
}

const ConditionsTerms: React.FC<ConditionsTermsProps> = () => {
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
          title="Điều kiện điều khoản"
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

export const getStaticProps: GetStaticProps = withStaticProps(async function getStaticProps() {
  const hydrationData = {}
  let globalStore: GlobalHydration

  const resListQA = await globalServices.getListQuestionAnswer<ResponseType<IQuestionAnswer>>()

  // init data here
  if (resListQA && resListQA.status === HttpStatusCode.OK && resListQA.data?.code === 0) {
    globalStore = {
      questionAnswers: resListQA?.data?.data as IQuestionAnswer[],
    }
  }
  // hydrationData
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

export default withLayout(ConditionsTerms)
