import React, { FC } from 'react'
import { isMobile } from 'react-device-detect'
import { PAGE_ERROR } from '@src/interfaces/enums'
import PageError from '@src/components/Error/PageError'
import PageMobile from './PageMobile'

interface ProductProps {}

const Product: FC<ProductProps> = () => {
  if (isMobile) {
    return <PageMobile />
  }
  return <PageError title={PAGE_ERROR.ONLY_MOBILE} />
}

export default Product
