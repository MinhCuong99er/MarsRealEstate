import React, { FC, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import { useRouter } from 'next/router'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import VoucherStore from '@src/stores/voucher.store'
import get from 'lodash/get'
import moment from 'dayjs'
import { VOUCHER_CODE_INFO_ACTION } from '@src/interfaces/enums'

interface PageMobileProps {
  voucherStore?: VoucherStore
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { voucherStore } = props
  const codeDetail = voucherStore.voucherCodeDetail
  const codeInfo = voucherStore.voucherCodeInfo

  const router = useRouter()
  const { query } = router
  const { code } = query

  const isReturnUrl = codeInfo?.action == VOUCHER_CODE_INFO_ACTION.SHOW_WEB && codeInfo?.linkPartner

  useEffect(() => {
    if (isReturnUrl) {
      router.push(codeInfo?.linkPartner)
    }
  }, [codeInfo])

  if (isReturnUrl) {
    return null
  }

  return (
    <>
      <div className="m-body">
        <HeaderMobile title={'Chi tiết mã code'} />
        <div className="m-offer">
          <div className="m-accumulatepoint-modal__content">
            <div
              className="m-accumulatepoint-modal__content__name"
              style={{ fontSize: 26, fontWeight: 700, padding: '0 15px' }}
            >
              {/* <span style={{ color: '#ee0033' }}>{codeDetail?.name}</span> */}
              <span style={{ color: '#141ed2' }}>{codeDetail?.name}</span>
            </div>
            <br />
            <div className="m-accumulatepoint-modal__content__image" style={{ padding: '0 10px' }}>
              <img src={codeDetail?.images} style={{ width: '100%' }} />
            </div>
            <div className="m-offer" style={{ fontSize: 20, textAlign: 'left' }}>
              <div className="m-offer__bot">
                <ul>
                  <li style={{ borderBottom: 0 }}></li>
                  <li className="is-remove-border">
                    <div className="is-text">
                      <div className="is-text__title">
                        <span>Chi tiết ưu đãi</span>
                      </div>
                      <div style={{ lineHeight: '1.4' }} className="is-text__content">
                        <span style={{ fontSize: 17 }}>
                          Ngày bắt đầu:{' '}
                          {moment(get(codeDetail, 'startDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                          <br />
                          Ngày kết thúc:{' '}
                          {moment(get(codeDetail, 'endDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                          <br />
                          Khu vực: {get(codeDetail, 'area', '') || 'Đang cập nhật'}
                          <div className="b-maincontent">
                            <pre>{get(codeDetail, 'description', '') || 'Đang cập nhật'}</pre>
                          </div>
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <br />
            <div className="m-accumulatepoint-modal__content__text">
              <span>
                Quý khách vui lòng đưa mã cho <br />
                nhân viên thu ngân để sử dụng
              </span>
            </div>
            <div className="m-accumulatepoint-modal__content__barcode">
              <Barcode
                value={code}
                displayValue={true}
                height={50}
                width={1.2}
                fontSize={13}
                textMargin={2}
                textSpacing={5}
                background={'transparent'}
              />
            </div>
            <div className="m-accumulatepoint-modal__content__qrcode" style={{}}>
              <QRCode value={code as string} bgColor={'transparent'} size={190} />
            </div>
            <br />
            <br />
            <br />
            {/* {itemShow && itemShow.linkPartner && itemShow.linkPartner != '' ? (
              <div>
                <a href={get(itemShow, 'linkPartner', '')} target="_blank" rel="noreferrer">
                  Hoặc nhấn vào đây để sử dụng
                </a>
              </div>
            ) : null} */}
            {/* <button onClick={() => setModalQRCode(false)} className="m-accumulatepoint-modal__content__btn">
              <span>Đóng</span>
            </button> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
}))(observer(PageMobile))
