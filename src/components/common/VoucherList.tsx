import React, { FC, useState } from 'react'
import Link from 'next/link'
import numeral from 'numeral'
import get from 'lodash/get'
import { Voucher } from '@src/interfaces/Voucher'
import PageLoading from '@src/helpers/PageLoading'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import { Modal } from 'react-bootstrap'
import { toastUtil } from '@src/helpers/Toast'
import helper from '@src/helpers/helper'
import moment from 'dayjs'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import AuthStore from '@src/stores/auth.store'
import { RootStoreHydration } from '@src/stores/RootStore'

interface VoucherListProps {
  data?: Array<Voucher>
  isLoading?: boolean | React.Dispatch<React.SetStateAction<boolean>>
  isMyVoucher?: boolean
  lastElementRef: (node: any) => void
  action?: 'point' | 'loadMore' | 'type' | 'category' | ''
  authStore?: AuthStore
}

const renderVietelPercent = (percent: number | null) => {
  if (percent !== null && typeof percent == 'number' && percent > 0) {
    return (
      <span className="is-viettelpercent">
        <b>Tích điểm {percent}%</b>
      </span>
    )
  }
  return <div className="is-viettelpercent" style={{ content: ' ' }}></div>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderVoucherTich = (item: Voucher) => {
  if (typeof item?.giftPoint == 'number' && item?.giftPoint > 0) {
    return (
      <span className="is-point">
        <b>{numeral(get(item, 'giftPoint', 0)).format('0,0')}</b> <span className="c-pointlogo">đ</span>
      </span>
    )
  } else if (typeof item?.discountPercent == 'number' && item?.discountPercent > 0) {
    return (
      <span className="is-point">
        <b>{numeral(get(item, 'discountPercent', 0)).format('0,0')}</b> <span className="c-pointlogo">%</span>
      </span>
    )
  }
  return (
    <span className="is-point">
      <b>{numeral(get(item, 'billPointPercent', 0)).format('0,0')}</b> <span className="c-pointlogo">%</span>
    </span>
  )
}

const renderVoucherType = (item: Voucher) => {
  if (item?.paymentCash && item?.paymentCash > 0) {
    return (
      <>
        {renderVietelPercent(item.viettelPercent)}
        <span className="is-point">
          <b>{numeral(get(item, 'paymentCash', 0)).format('0,0')}</b> <span className="c-pointlogo">đ</span>
        </span>
      </>
    )
  }
  /*  else if (
    // voucher tich diem
    item?.type == 'earn_on_ecom' ||
    item?.type == 'earn_on_voucher' ||
    item?.type == 'earn_off'
  ) {
    return (
      <>
        {renderVietelPercent(item.viettelPercent)}
        {renderVoucherTich(item)}
      </>
    )
  } */
  return (
    <>
      {renderVietelPercent(item.viettelPercent)}
      <span className="is-point">
        <b>Miễn phí</b>
      </span>
    </>
  )
}

const VoucherItem = ({
  item,
  isMyVoucher,
  setCodeShow,
  setModalQRCode,
  setLinkPartner,
  token,
}: {
  item: Voucher
  isMyVoucher?: boolean
  setCodeShow: (code: string) => void
  setModalQRCode: (visibile: boolean) => void
  setLinkPartner: (url: string) => void
  token?: string
}) => (
  <>
    <Link
      href={`/${item.typeVoucher == 'full_product_my_app' ? 'uu-dai-khoa-hoc/chi-tiet' : 'doi-qua'}/${
        isMyVoucher ? item.voucherId : item.id
      }`}
    >
      <a>
        <div className="md-voucher-list-box__outer">
          <div className="is-img">
            {isMyVoucher ? <img src={get(item, 'imagesVoucher[0]', '')} /> : <img src={get(item, 'images[0]', '')} />}
          </div>
          <div className="is-content">
            <div className="is-partner">
              {isMyVoucher ? <img src={get(item, 'logoPartner', '')} /> : <img src={get(item, 'partnerLogo', '')} />}
            </div>
            <b className="is-title">{get(item, 'partnerName', '')}</b>
            {isMyVoucher ? (
              <>
                <span className="is-description is-myv">{get(item, 'voucherName', '')}</span>
                <div className="is-infov">
                  <span className="is-description is-small">Mã sử dụng: {get(item, 'code', '')}</span>
                  <span className="is-description is-small is-date">
                    Hạn sử dụng: {moment(get(item, 'expiredAt', '')).format('DD/MM/YYYY')}
                  </span>
                </div>
              </>
            ) : (
              <span className="is-description">{get(item, 'name', '')}</span>
            )}
            {renderVoucherType(item)}
          </div>
        </div>
      </a>
    </Link>
    {isMyVoucher && token ? (
      <button
        onClick={() => {
          if (navigator) {
            helper.testClipboard(get(item, 'code', ''))
            toastUtil.success('Copy mã thành công!')
          } else {
            toastUtil.error('Copy không thành công!')
          }
        }}
        className="btn is-copy"
      >
        Sao chép mã
      </button>
    ) : null}
    {isMyVoucher && token ? (
      <button
        onClick={() => {
          setCodeShow(get(item, 'code', ''))
          setLinkPartner(get(item, 'linkPartner', ''))
          setModalQRCode(true)
        }}
        className="btn"
      >
        Sử dụng
      </button>
    ) : !isMyVoucher && token ? (
      // <Link href={`/doi-qua/${item.id}/chi-tiet`}>
      <Link href={`/doi-qua/${item.id}`}>
        <a className="btn">{get(item, 'paymentPoint', '') ? 'Mua ngay' : 'Nhận ưu đãi'}</a>
      </Link>
    ) : null}
  </>
)

const VoucherList: FC<VoucherListProps> = (props: VoucherListProps) => {
  const { data = [], isLoading = false, isMyVoucher = false, action, authStore } = props
  console.log(`🚀 ~ file: VoucherList.tsx ~ line 171 ~ data`, toJS(data))
  const [modalQRCode, setModalQRCode] = useState(false)
  const [codeShow, setCodeShow] = useState<string>('')
  const [linkPartner, setLinkPartner] = useState<string>('')
  const handleCloseQRCode = () => setModalQRCode(false)

  return (
    <>
      <div className="md-voucher-list">
        <div className="container">
          <div className="md-voucher-list-box">
            {data.length <= 0 && !isLoading ? (
              isMyVoucher ? (
                <span className="is-white">Bạn không có ưu đãi nào!</span>
              ) : (
                <span className="is-white">Không tìm thấy ưu đãi nào</span>
              )
            ) : (
              <ul className="clearfix">
                {isLoading && typeof action == 'string' && (action == 'point' || action == 'type') ? (
                  <PageLoading style={{ height: '150px' }} />
                ) : null}
                {data.map((item, idx) => {
                  if (data.length == idx + 1) {
                    return (
                      <li ref={props.lastElementRef} key={`voucher-${item.name}-${item.id}-${idx}`}>
                        <VoucherItem
                          item={item}
                          isMyVoucher={isMyVoucher}
                          setCodeShow={setCodeShow}
                          setModalQRCode={setModalQRCode}
                          setLinkPartner={setLinkPartner}
                          token={authStore?.token}
                        />
                      </li>
                    )
                  }
                  return (
                    <li key={`voucher-${item.name}-${item.id}-${idx}`}>
                      <VoucherItem
                        item={item}
                        isMyVoucher={isMyVoucher}
                        setCodeShow={setCodeShow}
                        setModalQRCode={setModalQRCode}
                        setLinkPartner={setLinkPartner}
                        token={authStore?.token}
                      />
                    </li>
                  )
                })}
              </ul>
            )}
            {isLoading && typeof action == 'string' && (action == '' || action == 'loadMore') ? (
              <PageLoading style={{ height: '150px' }} />
            ) : null}
            <Modal show={modalQRCode} onHide={handleCloseQRCode} centered className="m-modal-charity is-maxwidth">
              <Modal.Body>
                <div className="m-accumulatepoint-modal__content">
                  <div className="m-accumulatepoint-modal__content__text">
                    <span>
                      Quý khách vui lòng đưa mã cho <br />
                      nhân viên thu ngân để sử dụng
                    </span>
                  </div>
                  <div className="m-accumulatepoint-modal__content__barcode">
                    <Barcode
                      value={codeShow ?? ''}
                      displayValue={true}
                      height={50}
                      width={1.2}
                      fontSize={13}
                      textMargin={2}
                      textSpacing={5}
                      background={'transparent'}
                    />
                  </div>
                  <div className="m-accumulatepoint-modal__content__qrcode" style={{ margin: '6% 0' }}>
                    <QRCode value={codeShow ?? ''} bgColor={'transparent'} size={190} />
                  </div>
                  {linkPartner != '' ? (
                    <div>
                      <a href={linkPartner} target="_blank" rel="noreferrer">
                        Hoặc nhấn vào đây để sử dụng
                      </a>
                    </div>
                  ) : null}
                  <button onClick={handleCloseQRCode} className="m-accumulatepoint-modal__content__btn">
                    <span>Đóng</span>
                  </button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </>
  )
}

export default inject(({ store }: { store: RootStoreHydration }) => ({
  authStore: store?.authStore,
}))(observer(VoucherList))
