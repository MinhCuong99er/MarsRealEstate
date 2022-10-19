import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Config from '@src/contains/Config'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { withServerSideProps } from '@src/helpers/wrapperProps'
import { CharityHydration } from '@src/stores/charity.store'
import * as voucherServices from '@src/services/charity.service'
import { toJS } from 'mobx'
import get from 'lodash/get'
import PageLoading from '@src/helpers/PageLoading'

const CharityForCommunity2 = dynamic(() => import('@src/components/CharityInfo'), {
  ssr: false,
  loading: () => <PageLoading />,
})

interface Charity2Props {
  token: string
  charityDetail?: any
}

const Charity2: React.FC<Charity2Props> = (props: Charity2Props) => {
  const { charityDetail } = props
  console.log(`🚀 ~ file: Page.tsx ~ line 31 ~ charityDetail`, toJS(charityDetail))
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
          title={`${get(charityDetail, 'name', '')} - VN Direct`}
          url={`${Config.publicRuntimeConfig.BASE_URL}`}
          image={`${Config.publicRuntimeConfig.APP_IMAGE}`}
          // keywords=""
          // descriptions=""
        />
        <CharityForCommunity2 />
      </>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getServerSideProps({ query }) {
  const hydrationData = {}
  let charityDetail = {}
  let charityStore: CharityHydration
  const resDetailVoucher = await voucherServices.getCharityInfo<any>(query.id)
  console.log(`🚀 ~ file: index.tsx ~ line 50 ~ GetServerSideProps ~ resDetailVoucher`, resDetailVoucher)
  const resDonatesList = await voucherServices.getListDonates<any>({
    charityId: query.id,
    skip: 0,
    limit: 1000,
  })
  console.log(`🚀 ~ file: index.tsx ~ line 57 ~ GetServerSideProps ~ resDonatesList`, resDonatesList)
  // init data here
  if ((resDetailVoucher && resDetailVoucher.status === HttpStatusCode.OK) || resDetailVoucher.data?.code === 0) {
    charityStore = {
      detail: resDetailVoucher?.data?.data,
    }
    charityDetail = resDetailVoucher?.data?.data
  }
  if ((resDonatesList && resDonatesList.status === HttpStatusCode.OK) || resDonatesList.data?.code === 0) {
    charityStore = {
      detail: resDetailVoucher?.data?.data,
      donates: resDonatesList?.data?.data,
      pagination: {
        total: resDonatesList?.data?.total ? Number(resDonatesList?.data?.total) : 0,
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
        charityDetail,
      },
    }
  }
  return {
    props: {},
  }
})
export default withLayout(Charity2)
