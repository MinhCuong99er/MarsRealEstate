import React, { FC, useState, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
// import FooterMobile from '@src/components/common/FooterMobile'
import Modal from 'react-bootstrap/Modal'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import { VoucherHydration } from '@src/stores/voucher.store'
import get from 'lodash/get'
import numeral from 'numeral'
import { flowResult, reaction } from 'mobx'
import isEqual from 'lodash/isEqual'
import { MY_VOUCHER_USED } from '@src/interfaces/enums'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import PageLoading from '@src/helpers/PageLoading'
import { toastUtil } from '@src/helpers/Toast'
import moment from 'dayjs'
import Config from '@src/contains/Config'
import VoucherListMyVoucher from './VoucherList'
import helper from '@src/helpers/helper'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageMobileProps {
  voucherStore?: VoucherHydration
  loading?: boolean
  isShowHeader?: boolean
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const disposers = []
  const { voucherStore, loading, isShowHeader } = props
  const [openShareBox, setOpenShareBox] = useState(false)
  const [modalQRCode, setModalQRCode] = useState(false)
  const handleCloseQRCode = () => setModalQRCode(false)
  const [itemShow, setItemShow] = useState<any>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // $('.container').css({ background: 'red' })
    }
    // handleShowSuccess()
    myNotUsedVoucher()
  }, [])

  const myNotUsedVoucher = async () => {
    const data = {
      skip: 0,
      limit: Config.PAGE_SIZE,
    }
    const resNotUsedVoucher = await flowResult<any>(voucherStore.getMyNotUsedVouchers?.(data))
    if (resNotUsedVoucher?.code == 0) {
      // console.log("🚀 ~ file: PageDesktop.tsx ~ line 43 ~ myNotUsedVoucher ~ resNotUsedVoucher", resNotUsedVoucher)
    }
  }

  const handleLoadMore = () => {
    voucherStore?.loadMoreMyVoucherUsed()
  }
  const hasMoreItems = voucherStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  const changMyVoucherUsed = (vType: MY_VOUCHER_USED) => {
    voucherStore.setMyUsedVoucher(vType)
  }

  React.useEffect(() => {
    disposers.push(
      reaction(
        () => voucherStore.isChangeMyVoucherUsed,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            voucherStore?.filterVoucherUsed()
          }
        }
      )
    )
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])

  return (
    <React.Fragment>
      <div className="m-body">
        {!isShowHeader && typeof isShowHeader == 'boolean' ? null : <HeaderMobile title={'Ưu đãi của tôi'} />}
        <div className="m-myvoucher">
          <div className="m-myvoucher__tab">
            <ul className="clearfix">
              <li
                className={`${voucherStore?.myVoucherUsed == MY_VOUCHER_USED.NOT_USED ? 'active' : ''}`}
                onClick={() => changMyVoucherUsed(MY_VOUCHER_USED.NOT_USED)}
              >
                <span>Ưu đãi đã đổi</span>
              </li>
              <li
                className={`${voucherStore?.myVoucherUsed == MY_VOUCHER_USED.USED ? 'active' : ''}`}
                onClick={() => changMyVoucherUsed(MY_VOUCHER_USED.USED)}
              >
                <span>Ưu đãi đã sử dụng</span>
              </li>
            </ul>
          </div>
          {voucherStore?.myVoucherUsed == MY_VOUCHER_USED.NOT_USED ? (
            <div className="m-myvoucher-list">
              <ul className="clearfix">
                {voucherStore?.notUsedVouchers.length <= 0 && !loading ? (
                  <span>Bạn chưa có ưu đãi nào!</span>
                ) : (
                  voucherStore?.notUsedVouchers.map((item, idx) => {
                    return (
                      <li
                        ref={voucherStore?.notUsedVouchers.length == idx + 1 ? lastElementRef : null}
                        key={`item-${item.name}-${item.id}-${idx}`}
                      >
                        <div className="m-myvoucher-list__item">
                          <div className="is-left">
                            <div className="is-partner">
                              <div className="is-logo">
                                <img src={get(item, 'logoPartner', '')} />
                              </div>
                              <div className="is-name">{get(item, 'partnerName', '')}</div>
                            </div>
                            <div className="is-bottom">
                              <div className="is-img">
                                <img src={get(item, 'imagesVoucher[0]', '')} />
                              </div>
                              <span className="is-title">{get(item, 'voucherName', '')}</span>
                              {item?.paymentPoint ? (
                                <span className="is-point">
                                  Tích <b>{numeral(get(item, 'paymentPoint', 0)).format('0,0')}</b> điểm
                                </span>
                              ) : (
                                <span className="is-point">
                                  <b>Miễn phí</b>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="is-right">
                            <div className="is-code">
                              <span>Mã sử dụng</span>
                              <b>{get(item, 'code', '')}</b>
                            </div>
                            <div className="is-bottom">
                              <span>HSD: {moment(get(item, 'expiredAt', '')).format('DD/MM/YYYY')}</span>
                              <button
                                className="btn"
                                onClick={() => {
                                  setItemShow(item)
                                  setModalQRCode(true)
                                }}
                              >
                                Sử dụng
                              </button>
                              <button
                                onClick={() => {
                                  if (navigator) {
                                    helper.testClipboard(get(item, 'code', ''))
                                    toastUtil.success('Copy thành công!')
                                  } else {
                                    toastUtil.error('Copy không thành công!')
                                  }
                                }}
                                className="btn"
                              >
                                Sao chép mã
                              </button>
                              {/* <button
                                  className="btn"
                                  onClick={() => {
                                    setItemShow(item)
                                    setOpenShareBox(true)
                                  }}
                                >
                                  Gửi tặng
                                </button> */}
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })
                )}
                {loading ? <PageLoading style={{ height: '150px' }} /> : null}
              </ul>
            </div>
          ) : (
            <VoucherListMyVoucher
              data={voucherStore?.usedVouchers}
              loading={loading}
              isMobile={true}
              lastElementRef={lastElementRef}
            />
          )}
        </div>
        {/* <FooterMobile activeMenu={4} /> */}
        <div
          onClick={() => setOpenShareBox(false)}
          className={`m-myvoucher-overlay ${openShareBox ? 'has-ovelay-show' : ''}`}
        ></div>
        <div className={`m-myvoucher-scrollbottom ${openShareBox ? 'has-menu-open' : ''}`}>
          <div className="is-top">
            <span>{get(itemShow, 'voucherName', '')}</span>
            <div className="is-close" onClick={() => setOpenShareBox(false)}>
              <img src="/images/close.png" />
            </div>
          </div>
          <div className="is-scroll">
            <ul className="clearfix">
              <li>
                <img src="/images/zalo-icon.jpg" />
              </li>
              <li>
                <img src="/images/zalo-icon.jpg" />
              </li>
              <li>
                <img src="/images/zalo-icon.jpg" />
              </li>
              <li>
                <img src="/images/zalo-icon.jpg" />
              </li>
              <li>
                <img src="/images/zalo-icon.jpg" />
              </li>
              <li>
                <img src="/images/zalo-icon.jpg" />
              </li>
            </ul>
          </div>
        </div>
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
                  value={get(itemShow, 'code', '')}
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
                <QRCode value={get(itemShow, 'code', '')} bgColor={'transparent'} size={190} />
              </div>
              {itemShow && itemShow.linkPartner && itemShow.linkPartner != '' ? (
                <div>
                  <a href={get(itemShow, 'linkPartner', '')} target="_blank" rel="noreferrer">
                    Hoặc nhấn vào đây để sử dụng
                  </a>
                </div>
              ) : null}
              <button onClick={() => setModalQRCode(false)} className="m-accumulatepoint-modal__content__btn">
                <span>Đóng</span>
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  loading: store.loading,
}))(observer(PageMobile))
