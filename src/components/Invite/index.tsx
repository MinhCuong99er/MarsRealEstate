import React, { FC } from 'react'
import { isMobile } from 'react-device-detect'
/* import numeral from 'numeral'
import { toastUtil } from '@src/helpers/Toast'
import * as utils from '@src/utils' */
// import PageDesktop from './PageDesktop'
import { PAGE_ERROR } from '@src/interfaces/enums'
import PageError from '@src/components/Error/PageError'
import PageMobile from './PageMobile'

interface InviteProps {}

const Invite: FC<InviteProps> = () => {
  if (isMobile) {
    return <PageMobile />
  }
  // return <PageDesktop />
  return <PageError title={PAGE_ERROR.ONLY_MOBILE} />
}

export default Invite
