import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { withStaticProps } from '@src/helpers/wrapperProps'

// service import here
import * as charityServices from '@src/services/charity.service'
import { CharityHydration } from '@src/stores/charity.store'
import { GetStaticProps } from 'next'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { Charity } from '@src/interfaces/Charity'
import { IApiResponse } from '@src/utils/request'
import PageLoading from '@src/helpers/PageLoading'

const CharityForCommunity = dynamic(() => import('@src/components/Charity'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface CharityProps {
  token: string
}

const CharityPage: React.FC<CharityProps> = () => {
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
          title="Đóng góp vì cộng đồng"
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
          // keywords=""
          // descriptions=""
        />
        <CharityForCommunity />
      </>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = withStaticProps(async function getStaticProps() {
  const hydrationData = {}
  let charityStore: CharityHydration
  const resListCharity: IApiResponse<ResponseType<Charity>> = await charityServices.getListCharities<
    ResponseType<Charity>
  >({
    skip: 0,
    limit: Config.PAGE_SIZE,
  })
  console.log(`🚀 ~ file: index.tsx ~ line 48 ~ getStaticProps ~ resListVoucher`, resListCharity)

  // init data here
  if ((resListCharity && resListCharity.status === HttpStatusCode.OK) || resListCharity.data?.code === 0) {
    charityStore = {
      charities: resListCharity?.data?.data as Charity[],
      pagination: {
        total: resListCharity?.data?.total ? Number(resListCharity?.data?.total) : 0,
      },
    }
  }

  // hydrationData
  if (charityStore) {
    Object.assign(hydrationData, { charityStore })
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

export default withLayout(CharityPage)
