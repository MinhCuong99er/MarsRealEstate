import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'

interface PageDesktopProps {
  store?: {
    authStore?: any
  }
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const {} = props

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content"></div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default inject('store')(observer(PageDesktop))
