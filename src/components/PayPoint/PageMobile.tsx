import React, { FC, useState } from 'react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import FooterMobile from '@src/components/common/FooterMobile'
import { observer, inject } from 'mobx-react'
import { AuthHydration } from '@src/stores/auth.store'
import numeral from 'numeral'
import Link from 'next/link'
numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageMobileProps {
  authStore?: AuthHydration
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { authStore } = props
  const [checkText, setCheckText] = useState(true)

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={'Thanh toán bằng điểm'} />
        <div className="container">
          <div className="m-box-pay">
            {authStore?.auth?.phone ? (
              <>
                <div className="m-box-pay__title">
                  Quý khách vui lòng đưa mã này cho <br />
                  nhân viên thu ngân
                </div>
                <div className="m-box-pay__barcode">
                  <Barcode
                    value={authStore?.auth?.phone ?? 0}
                    displayValue={false}
                    background={'transparent'}
                    height={50}
                    width={1.2}
                    fontSize={13}
                    textMargin={0}
                    textSpacing={5}
                  />
                  <div className="m-box-pay__barcode__text">
                    <span className={checkText ? 'm-full-barcode' : ''}>{authStore?.auth?.phone ?? ''}</span>
                    <span onClick={() => setCheckText(!checkText)}> {checkText ? 'Xem mã' : 'Ẩn mã'}</span>
                  </div>
                </div>
                <div className="m-box-pay__qrcode">
                  <QRCode value={authStore?.auth?.phone ?? ''} bgColor={'transparent'} size={131} />
                  {/* <span>Tự động cập nhật mã sau 59 giây</span> */}
                </div>
              </>
            ) : (
              <div className="m-box-pay__title">
                <b>Quý khách chưa liên kết số điên thoại</b>
                <br />
                <br />
                Hãy nhấn vào{' '}
                <Link href="/tai-khoan">
                  <a className="c-link-modal">đây</a>
                </Link>{' '}
                để sử dụng chức năng tích điểm liên kết
              </div>
            )}
            <div className="m-box-pay__bot">
              <div className="m-box-pay__bot__top">
                <span>Số điểm hiện có</span>
              </div>
              <div className="m-box-pay__bot__bot">
                <span>{numeral(authStore?.auth?.point ?? 0).format('#,#')}</span>
                {/* <span>Nạp thêm</span> */}
              </div>
            </div>
          </div>
        </div>
        <FooterMobile activeMenu={1} />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
}))(observer(PageMobile))
