import React, { FC } from 'react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import VoucherTabDesktop from './VoucherTabDesktop'
import Breadcrumb from '@src/components/common/Breadcrumb'
import { IGeolocation } from '.'

interface PageDesktopProps {
  store?: {
    authStore?: any
  }
  geolocation: IGeolocation
  geolocationErr: string
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const {} = props

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <div className="d-breadcrumb-voucher">
            <Breadcrumb nameLink={'Ưu đãi quanh đây'} link={'/uu-dai-gan-day'} />
          </div>
          <VoucherTabDesktop />
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default PageDesktop
