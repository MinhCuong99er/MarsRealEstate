import React, { FC, useState } from 'react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import VoucherTabDesktop from '@src/components/home/Page/VoucherTabDesktop'
import Breadcrumb from '@src/components/common/Breadcrumb'

interface PageDesktopProps {
  store?: {
    authStore?: any
  }
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const {} = props
  const [activeTab, setActiveTab] = useState('Ưu đãi')

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <div className="d-breadcrumb-voucher">
            <Breadcrumb nameLink={activeTab} link={'/doi-qua'} />
          </div>
          <VoucherTabDesktop onActiveTab={(value) => setActiveTab(value)} />
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default PageDesktop
