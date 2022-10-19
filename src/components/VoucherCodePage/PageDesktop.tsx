import React, { FC, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import Breadcrumb from '@src/components/common/Breadcrumb'
import { useRouter } from 'next/router'
import get from 'lodash/get'
import numeral from 'numeral'
import moment from 'dayjs'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import VoucherStore from '@src/stores/voucher.store'
import { VOUCHER_CODE_INFO_ACTION } from '@src/interfaces/enums'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageDesktopProps {
  voucherStore?: VoucherStore
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const { voucherStore } = props
  const router = useRouter()
  const { query } = router
  const { code } = query
  const codeDetail = voucherStore.voucherCodeDetail
  const codeInfo = voucherStore.voucherCodeInfo
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
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <Breadcrumb nameLink={'Ưu đãi'} link={'/doi-qua'} />
        <div className="d-content">
          <div className="container">
            <div className="d-offer-detail">
              <div className="d-product-detai">
                <div className="d-product-detai__title">
                  <div className="d-product-detai__title__left">
                    <div className="is-d">
                      <Swiper
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                      >
                        {get(codeDetail, 'images', '').map((item, index) => {
                          return (
                            <SwiperSlide key={index}>
                              <div className="d-product-detai__title__left__outer" style={{ paddingTop: '47%' }}>
                                <img src={item} />
                              </div>
                            </SwiperSlide>
                          )
                        })}
                      </Swiper>
                    </div>
                  </div>
                  <div className="d-product-detai__title__right">
                    <div className="d-product-detai__title__right__title clearfix">
                      <span className="is-title">{codeDetail.name}</span>
                      <div className="d-product-detai__title__right__content" style={{ maxWidth: 270, float: 'right' }}>
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
                      </div>

                      {/* <div className="d-product-detai__title__right__icon">
                        <img src="/images/charity2-love.png" />
                        <a href="/#">
                          <img src="/images/charity2-share.png" />
                        </a>
                      </div> */}
                      {/* <div className="d-product-detai__title__right__content">
                        {voucherInfo?.viettelPercent ? (
                          <div className="d-product-detai__title__right__content__percent">
                            <span className="is-viettelpercent">
                              Tích điểm {get(voucherInfo, 'viettelPercent', '')}%
                            </span>
                          </div>
                        ) : (
                          <div className="d-product-detai__title__right__content__percent">
                            <span className="is-viettelpercent"></span>
                          </div>
                        )}
                        {voucherInfo?.paymentCash ? (
                          <div className="d-product-detai__title__right__content__text">
                            <span>Số tiền</span>
                            <i>
                              {numeral(voucherInfo.paymentCash ?? 0).format('0,0')}
                              <span className="c-pointlogo">đ</span>
                            </i>
                          </div>
                        ) : (
                          <div className="d-product-detai__title__right__content__text">
                            <i>Miễn phí</i>
                          </div>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-offer-detail__mid">
                <div className="d-offer-detail__mid__top">
                  <span>Chi tiết ưu đãi</span>
                </div>
                <div className="d-offer-detail__mid__bot">
                  <div className="d-offer-detail__mid__bot__left">
                    <span>
                      Ngày bắt đầu: {moment(get(codeDetail, 'startDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                      <br />
                      <br />
                      Ngày kết thúc: {moment(get(codeDetail, 'endDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                      <br />
                      <br />
                      Khu vực: {get(codeDetail, 'area', '') || 'Đang cập nhật'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="d-offer-detail__mid">
                <div className="d-offer-detail__mid__top">
                  <span>Mô tả ưu đãi</span>
                </div>
                <div className="d-offer-detail__mid__bot">
                  <div className="d-offer-detail__mid__bot__left">
                    {get(codeDetail, 'description', '') ? (
                      <pre className="b-maincontent">{get(codeDetail, 'description', '')}</pre>
                    ) : (
                      <div className="b-maincontent">
                        <p>Đang cập nhật</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* {get(partnerInfo, 'detail', '') ? (
                <div className="d-offer-detail__mid">
                  <div className="d-offer-detail__mid__top">
                    <span>Về {get(partnerInfo, 'name', '')}</span>
                  </div>
                  <div className="d-offer-detail__mid__bot">
                    <div className="d-offer-detail__mid__bot__left">
                      <pre className="b-maincontent">{get(partnerInfo, 'detail', '')}</pre>
                    </div>
                  </div>
                </div>
              ) : null} */}
              {/* {shopInfos.length > 0 ? (
                <div className="d-offer-detail__mid">
                  <div className="d-offer-detail__mid__top">
                    <span>Địa chỉ Áp dụng</span>
                  </div>
                  <div className="d-offer-detail__mid__bot">
                    <div className="d-offer-detail__mid__bot__left">
                      <div className="b-maincontent">
                        {btnMore
                          ? shopInfos.map((item, index) => {
                              return <p key={index}>{item?.address}</p>
                            })
                          : shopInfos.slice(0, 3).map((item, index) => {
                              return <p key={index}>{item?.address}</p>
                            })}
                      </div>
                    </div>
                  </div>
                  {shopInfos.length > 3 ? (
                    <div>
                      <span onClick={() => setBtnMore(!btnMore)} className="c-voucher-loadmore">
                        {btnMore ? 'Ẩn' : 'Xem thêm'}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null} */}
            </div>
          </div>
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  loading: store.loading,
}))(observer(PageDesktop))
