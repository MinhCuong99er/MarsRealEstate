import React, { FC } from 'react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import RankInfoBox from './RankInfoBox'

interface PageDesktopProps {}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const {} = props

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <RankInfoBox />
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default PageDesktop
