import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import ListVoucher from './VoucherCourses'
import Breadcrumb from '@src/components/common/Breadcrumb'

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
        <div className="d-content">
          <Breadcrumb nameLink={`Ưu đãi khóa học đầu tư`} link={'/uu-dai-khoa-hoc'} />
          <div className="container">
            <div className="d-charity">
              <div className="d-charity__title">
                <span>Ưu đãi khoá học đầu tư</span>
              </div>
              <div className="d-charity__list">
                <ListVoucher />
              </div>
            </div>
          </div>
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default inject('store')(observer(PageDesktop))
