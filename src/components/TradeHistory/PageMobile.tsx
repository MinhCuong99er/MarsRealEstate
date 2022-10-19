import React, { FC, useState } from 'react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import MyVoucher from '@src/components/MyVoucher/PageMobile'
import OrderStatus from '@src/components/OrderStatus/PageMobile'

interface PageMobileProps {}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const {} = props
  const [tab, setTab] = useState('myVoucher')

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={'Lịch sử giao dịch'} />
        <div className="m-trade-history">
          <div className="m-trade-history__tab">
            <ul className="clearfix">
              <li className={`${tab == 'myVoucher' ? 'active' : ''}`} onClick={() => setTab('myVoucher')}>
                <span>Ưu đãi của tôi</span>
              </li>
              <li className={`${tab == 'orderStatus' ? 'active' : ''}`} onClick={() => setTab('orderStatus')}>
                <span>Trạng thái đơn hàng</span>
              </li>
            </ul>
          </div>
          {tab == 'myVoucher' ? <MyVoucher isShowHeader={false} /> : <OrderStatus isShowHeader={false} />}
        </div>
      </div>
    </React.Fragment>
  )
}

export default PageMobile
