import React, { FC } from 'react'
import { useRouter } from 'next/router'
import numeral from 'numeral'
import HeaderMobile from '@src/components/common/HeaderMoblie'
// import FooterMobile from '@src/components/common/FooterMobile'

interface PageMobileProps {}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const {} = props
  const router = useRouter()
  const status = router?.query?.status
  const amount = router?.query?.amount
  const order = router?.query?.order
  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={status === '00' ? 'ĐẶT HÀNG THÀNH CÔNG' : 'ĐẶT HÀNG THẤT BẠI'} />
        <div className="md-order-success">
          <div className="container">
            <div className="md-order-success__image">
              {status === '00' ? <img src="/images/ok.png" width={150} /> : <img src="/images/fail.png" width={150} />}
            </div>
            <div className="md-order-success__box">
              <h3>{status === '00' ? 'Bạn đã đặt hàng thành công' : 'Đặt hàng thất bại'}</h3>
              {amount ? (
                <div>
                  <h6>Số tiền: {numeral(amount).format('#,#')} VNĐ</h6>
                </div>
              ) : null}
              {order ? (
                <div>
                  <h6>Mã hóa đơn: {numeral(order).format('#,#')} </h6>
                </div>
              ) : null}
            </div>
            <div className="md-order-success__button">
              <div className="is-btn">
                <button className="btn btn-secondary" onClick={() => router.push('/')}>
                  Trở về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <FooterMobile activeMenu={3} /> */}
      </div>
    </React.Fragment>
  )
}

export default PageMobile
