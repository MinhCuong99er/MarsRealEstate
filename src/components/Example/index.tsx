import React, { FC } from 'react'
import { isMobile } from 'react-device-detect'
/* import numeral from 'numeral'
import { toastUtil } from '@src/helpers/Toast'
import * as utils from '@src/utils' */
import PageDesktop from './PageDesktop'
import PageMobile from './PageMobile'

interface ExampleProps {}

const Example: FC<ExampleProps> = () => {
  if (isMobile) {
    return <PageMobile />
  }
  return <PageDesktop />
}

export default Example
