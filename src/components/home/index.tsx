import React, { FC } from 'react'
/* import numeral from 'numeral'
import { toastUtil } from '@src/helpers/Toast'
import * as utils from '@src/utils' */
// import PageDesktop from './PageDesktop'
import { PAGE_ERROR } from '@src/interfaces/enums'
import PageError from '@src/components/Error/PageError'

interface PageProps {}

const Page: FC<PageProps> = () => {
  return <PageError title={PAGE_ERROR.ONLY_MOBILE} />
}

export default Page
