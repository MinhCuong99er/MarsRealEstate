import React, { FC } from 'react'
import HeaderMobile from '@src/components/common/HeaderMoblie'

interface PageMobileProps {}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const {} = props

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={'Thanh toán online'} />
        <div className="container">
          <div className="md-payment-online">
            <div className="md-payment-online__title">Chọn phương thức thanh toán</div>
            <div className="md-payment-online__box">
              <img src="/images/payment-online.jpg" />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default PageMobile
