import React, { FC } from 'react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import ListVoucher from '@src/components/OfferCourses/VoucherCourses'
import FooterMobile from '@src/components/common/FooterMobile'

interface PageMobileProps {}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const {} = props

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={'ƯU ĐÃI KHOÁ HỌC ĐẦU TƯ'} />
        <div className="d-content">
          <div className="container">
            <div className="d-charity">
              <div className="d-charity__list">
                <ListVoucher />
              </div>
            </div>
          </div>
        </div>
        <FooterMobile activeMenu={1} />
      </div>
    </React.Fragment>
  )
}

export default PageMobile
