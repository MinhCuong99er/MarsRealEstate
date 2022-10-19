import React, { FC } from 'react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import RankInfoBox from './RankInfoBox'
import FooterMobile from '@src/components/common/FooterMobile'

interface PageMobileProps {}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const {} = props

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={'ĐIỀU KIỆN NÂNG HẠNG & QUYỀN LỢI'} />
        <RankInfoBox />
        <FooterMobile activeMenu={4} />
      </div>
    </React.Fragment>
  )
}

export default PageMobile
