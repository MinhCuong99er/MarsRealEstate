import React, { FC, useState } from 'react'
import { observer, inject } from 'mobx-react'
import { flowResult } from 'mobx'
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

import Modal from 'react-bootstrap/Modal'
import PageLoadingcss from '@src/helpers/PageLoadingcss'
import { toastUtil } from '@src/helpers/Toast'
import CartStore from '@src/stores/cart.store'
import { Voucher } from '@src/interfaces/Voucher'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageDesktopProps {
  voucherStore?: {
    detail?: any
  }
  authStore?: {
    auth?: any
    token?: any
  }
  cartStore?: CartStore
  loading?: boolean
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const { voucherStore, authStore, cartStore, loading } = props
  const router = useRouter()
  const voucherDetailData = voucherStore.detail
  const voucherInfo: Voucher = get(voucherDetailData, 'voucherInfo', {}) || {}
  const partnerInfo = get(voucherDetailData, 'partnerInfo', {}) || {}
  const authInfo = get(authStore, 'auth', {}) || {}
  const shopInfos = get(voucherDetailData, 'shopInfos', []) || []
  const [btnMore, setBtnMore] = useState(false)

  const [modalNotLinkPartner, setModalNotLinkPartner] = useState(false)
  const [modalGetPoint, setModalGetPoint] = useState(false)
  const handleCloseGetPoint = () => setModalGetPoint(false)

  const [activeButtonPay, setActiveButtonPay] = useState<boolean>(true)
  // const [orderItemInfos, setOrderItemInfos] = useState<any>()

  const note = ''

  const [address, setAddress] = useState<string>(authStore?.auth?.address ?? '')
  const [provinceId, setProvinceId] = useState<number>(authStore?.auth?.provinceId ?? 0)
  const [districtId, setDistrictId] = useState<number>(authStore?.auth?.districtId ?? 0)
  const [wardId, setWardId] = useState<number>(authStore?.auth?.wardId ?? 0)

  const [addressUpdate, setAddressUpdate] = useState<string>(authStore?.auth?.address ?? '')
  const [provinceIdUpdate, setProvinceIdUpdate] = useState<number>(authStore?.auth?.provinceId ?? 0)
  const [districtIdUpdate, setDistrictIdUpdate] = useState<number>(authStore?.auth?.districtId ?? 0)
  const [wardIdUpdate, setWardIdUpdate] = useState<number>(authStore?.auth?.wardId ?? 0)

  const [modalUpdateAddress, setModalUpdateAddress] = useState(false)
  const handleCloseUpdateAddress = () => {
    setModalUpdateAddress(false)
    setAddressUpdate(address)
    setProvinceIdUpdate(provinceId)
    setDistrictIdUpdate(districtId)
    setWardIdUpdate(wardId)
  }

  const updateUser = async () => {
    if (!addressUpdate || !provinceIdUpdate || !districtIdUpdate || !wardIdUpdate) {
      toastUtil.error('Vui lòng cập nhập các trường cần thay đổi thông tin')
    } else {
      setAddressUpdate(addressUpdate)
      setProvinceIdUpdate(provinceIdUpdate)
      setDistrictIdUpdate(districtIdUpdate)
      setWardIdUpdate(wardIdUpdate)
      setModalUpdateAddress(false)
      setAddress(addressUpdate)
      setProvinceId(provinceIdUpdate)
      setDistrictId(districtIdUpdate)
      setWardId(wardIdUpdate)
    }
  }

  const openUsingPoint = () => {
    if (voucherInfo.type == 'earn_on_ecom') {
      if (
        (typeof voucherInfo.linkPartner == 'string' && voucherInfo.linkPartner != '') ||
        (typeof voucherInfo.urlTemplate == 'string' && voucherInfo.urlTemplate != '')
      ) {
        setModalGetPoint(true)
      } else {
        setModalNotLinkPartner(true)
      }
    } else {
      setModalGetPoint(true)
    }
  }

  const payVoucher = async () => {
    if (activeButtonPay) {
      setActiveButtonPay(false)
      /* if (!address || !provinceId || !districtId || !wardId) {
        toastUtil.error('Thiếu thông tin cần thiết!')
      } else { */
      const params = {
        address: address || '',
        listOrderItems: [
          {
            type: 'voucher',
            typeId: voucherInfo.id,
            quantity: 1,
          },
        ],
        provinceId: provinceId || 1,
        districtId: districtId || 1,
        wardId: wardId || 1,
        receiveEmail: authInfo.receiveEmail,
        receiveName: authInfo.receiveName,
        receivePhone: authInfo.receivePhone,
      }
      const resPayOrder = await flowResult<any>(cartStore.checkout?.(params, note))
      if (resPayOrder?.code && resPayOrder?.code != 0) {
        toastUtil.error(resPayOrder?.message || 'Hệ thống đang bận, vui lòng thực hiện sau')
        handleCloseGetPoint()
      } else {
        if (resPayOrder?.pay?.code != 0) {
          toastUtil.error(resPayOrder?.pay?.message || 'Hệ thống đang bận, vui lòng thực hiện sau')
        } else {
          if (resPayOrder?.pay?.vnpUrl) {
            window.location.href = resPayOrder?.pay?.vnpUrl
          } else {
            toastUtil.success(resPayOrder?.message || 'Đổi ưu đãi thành công !')
            handleCloseGetPoint()
            // setOrderItemInfos(resPayOrder?.pay?.orderItemInfos[0])
            // setModalQRCode(true)
            setTimeout(() => {
              router.push('/uu-dai-cua-toi')
            }, 1000)
          }
        }
      }
      // }
      setActiveButtonPay(true)
    }
  }

  // if (!authStore || !authStore.token) return <h1>Bạn không có quyền xem trang này!</h1>

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
                        {get(voucherInfo, 'images', '').map((item, index) => {
                          return (
                            <SwiperSlide key={index}>
                              <div className="d-product-detai__title__left__outer">
                                <img src={item} />
                              </div>
                            </SwiperSlide>
                          )
                        })}
                      </Swiper>
                    </div>
                  </div>
                  <div className="d-product-detai__title__right">
                    <div className="d-product-detai__title__right__title">
                      <span className="is-title">{voucherInfo.name}</span>
                      {/* <div className="d-product-detai__title__right__icon">
                        <img src="/images/charity2-love.png" />
                        <a href="/#">
                          <img src="/images/charity2-share.png" />
                        </a>
                      </div> */}
                      <div className="d-product-detai__title__right__content">
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
                        {authStore && authStore.token ? (
                          <div className="d-product-detai__title__right__content__btn">
                            <button
                              // onClick={() => {
                              //   router.push(
                              //     `/doi-qua/${voucherInfo?.id}/chi-tiet`
                              //   )
                              // }}
                              onClick={openUsingPoint}
                            >
                              {voucherInfo?.paymentCash ? 'Thanh toán ngay' : 'Nhận ưu đãi ngay'}
                            </button>
                          </div>
                        ) : null}
                      </div>
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
                      Thương hiệu: {get(partnerInfo, 'name', '') || 'Đang cập nhật'}
                      <br />
                      <br />
                      Ngày bắt đầu: {moment(get(voucherInfo, 'startDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                      <br />
                      <br />
                      Ngày kết thúc: {moment(get(voucherInfo, 'endDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                      <br />
                      <br />
                      Khu vực: {get(voucherInfo, 'area', '') || 'Đang cập nhật'}
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
                    {get(voucherInfo, 'description', '') ? (
                      <pre className="b-maincontent">{get(voucherInfo, 'description', '')}</pre>
                    ) : (
                      <div className="b-maincontent">
                        <p>Đang cập nhật</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {get(partnerInfo, 'detail', '') ? (
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
              ) : null}
              {shopInfos.length > 0 ? (
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
              ) : null}
            </div>
          </div>
        </div>
        <FooterDesktop />
        <Modal
          show={modalNotLinkPartner}
          onHide={() => setModalNotLinkPartner(false)}
          centered
          className="m-modal-charity is-qa is-detail"
        >
          <Modal.Body>
            <div className="m-modal-charity__input">
              <div className="m-modaltitle">Thông báo</div>
              <div className="m-modalbody">Ưu đãi này chưa có đường dẫn để nhận</div>
            </div>
            <div className="m-modal-charity__btn">
              <button onClick={() => setModalNotLinkPartner(false)} style={{ background: '#818285' }}>
                Đóng
              </button>
            </div>
            {loading ? <PageLoadingcss style={{ height: '30px' }} /> : null}
          </Modal.Body>
        </Modal>
        <Modal show={modalGetPoint} onHide={handleCloseGetPoint} centered className="m-modal-charity is-qa is-detail">
          <Modal.Body>
            <div className="m-modal-charity__input">
              <div className="m-modaltitle">Thông báo</div>
              <div className="m-modalbody">
                Bạn có muốn đổi ưu đãi này với {numeral(voucherInfo.paymentCash ?? 0).format('0,0')} Vnđ?
              </div>
            </div>
            <div className="m-modal-charity__btn">
              <button
                onClick={() => {
                  if (voucherInfo.type == 'earn_on_ecom') {
                    if (
                      (typeof voucherInfo.linkPartner == 'string' && voucherInfo.linkPartner != '') ||
                      (typeof voucherInfo.urlTemplate == 'string' && voucherInfo.urlTemplate != '')
                    ) {
                      window.open(voucherInfo.linkPartner || voucherInfo.urlTemplate)
                    } else {
                      alert('Chưa có link đối tác')
                    }
                  } else {
                    payVoucher()
                  }
                }}
                // style={{ background: '#ee0033' }}
                style={{ background: '#141ed2' }}
              >
                Đồng ý
              </button>
              <button onClick={handleCloseGetPoint} style={{ background: '#818285' }}>
                Huỷ
              </button>
            </div>
            {loading ? <PageLoadingcss style={{ height: '30px' }} /> : null}
          </Modal.Body>
        </Modal>
        <Modal
          show={modalUpdateAddress}
          onHide={handleCloseUpdateAddress}
          centered
          className="m-modal-charity is-qa is-detail"
          style={{ display: 'none' }}
        >
          <Modal.Body>
            <div className="md-userpage-address">
              <div className="md-userpage-address__box">
                <div className="is-title">Cập nhật địa chỉ giao hàng</div>
                <div className="is-btn">
                  <button onClick={updateUser} className="btn btn-secondary">
                    Cập nhật
                  </button>
                  <button onClick={handleCloseUpdateAddress} className="btn btn-primary">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  authStore: store?.authStore,
  cartStore: store?.cartStore,
  loading: store.loading,
}))(observer(PageDesktop))
