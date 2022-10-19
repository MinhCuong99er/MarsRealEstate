import React, { FC, useState } from 'react'
import { observer, inject } from 'mobx-react'
import { flowResult } from 'mobx'
import HeaderMobile from '@src/components/common/HeaderMoblie'
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
import ModalShowQRCode from '@src/components/popup/ModalShowQRCode'
import PopupFix from '@src/components/popup/PopupFix'
import AuthStore from '@src/stores/auth.store'
import { VoucherHydration } from '@src/stores/voucher.store'
import { VOUCHER_TYPES } from '@src/interfaces/enums'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageMobileProps {
  voucherStore?: VoucherHydration
  authStore?: AuthStore
  cartStore?: CartStore
  loading?: boolean
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
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
  const [modalQRCode, setModalQRCode] = useState<boolean>(false)
  const [modalLienKet, setModalLienKet] = useState(false)
  const [loadingLinkToPhone, setLoadingLinkToPhone] = useState(false)
  const [openPopupFix, setOpenPopupFix] = useState(false)
  const [urlVoucherInfo /*, setUrlVoucherInfo*/] = useState('')

  const handleCloseGetPoint = () => setModalGetPoint(false)

  const [activeButtonPay, setActiveButtonPay] = useState<boolean>(true)
  const [orderItemInfos, setOrderItemInfos] = useState<any>()

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

  const handleModalLienKet = (s: boolean) => {
    if (!s) {
      setModalLienKet(false)
    } else {
      setModalLienKet(s)
    }
  }

  const doReward = () => {
    // 2-6-2022 anh Đăng bảo check trường url bắt voucher affilate
    if (typeof voucherInfo.url == 'string' && voucherInfo.url != '') {
      // window.open(voucherInfo.url, '_system')
      window.location.href = voucherInfo.url
      // setUrlVoucherInfo(voucherInfo.url)
      // setOpenPopupFix(true)
    } else if (
      // voucher tich diem
      voucherInfo?.type == VOUCHER_TYPES.EARN_ON_ECOM &&
      !authStore?.isLinkExchangePhone
    ) {
      handleModalLienKet(true)
    } else if (voucherInfo?.type == VOUCHER_TYPES.EARN_ON_ECOM) {
      // voucher dang affilate sửa lần 2 anh Đăng bảo chuyển từ linkPartner sang urlTemplate
      if (typeof voucherInfo.urlTemplate == 'string' && voucherInfo.urlTemplate != '') {
        // window.open(voucherInfo.urlTemplate, '_system')
        window.location.href = voucherInfo.urlTemplate
        // setUrlVoucherInfo(voucherInfo.urlTemplate)
        // setOpenPopupFix(true)
      } else {
        setModalNotLinkPartner(true)
      }
    } else if (voucherInfo?.type == VOUCHER_TYPES.EARN_OFF) {
      payVoucher()
    } else if (voucherInfo?.type == VOUCHER_TYPES.EXCHANGE_DISCOUNT_PERCENT) {
      if (voucherInfo?.paymentCash) {
        setModalGetPoint(true)
      } else {
        payVoucher()
      }
    } else {
      router.push(`/doi-qua/${voucherInfo?.id}/chi-tiet`)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openUsingPoint = () => {
    if (voucherInfo.type == 'earn_on_ecom') {
      if (
        (typeof voucherInfo.linkPartner == 'string' && voucherInfo.linkPartner != '') ||
        (typeof voucherInfo.urlTemplate == 'string' && voucherInfo.urlTemplate != '')
      ) {
        if (voucherInfo?.paymentCash) {
          setModalGetPoint(true)
        } else {
          payVoucher()
        }
      } else {
        setModalNotLinkPartner(true)
      }
    } else {
      if (voucherInfo?.paymentCash) {
        setModalGetPoint(true)
      } else {
        payVoucher()
      }
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
            setOrderItemInfos(resPayOrder?.pay?.orderItemInfos[0]?.code)
            setModalQRCode(true)
            // setTimeout(() => {
            //   router.push('/uu-dai-cua-toi')
            // }, 1000)
          }
        }
      }
      // }
      setActiveButtonPay(true)
    }
  }

  // if (!authStore || !authStore.token) return <h1>Bạn không có quyền xem trang này!</h1>
  // console.log('abc', toJS(voucherInfo))
  return (
    <>
      <div className="m-body">
        <HeaderMobile title={'Chi tiết ưu đãi'} />
        <div className="m-offer">
          <div className="m-offer__top is-remove-border">
            <div className="m-offer__top__img">
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
                      <div className="m-offer__top__img__outer">
                        <img src={item} />
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
            <div className="m-offer__top__text is-remove-paddingbottom">
              <div className="m-offer__top__text__left">
                <img src={get(partnerInfo, 'logo', '')} />
                <span>{voucherInfo.name}</span>
              </div>
              {/* <div className="m-offer__top__text__right">
                <img src="/images/charity2-love.png" />
                <a href="/#">
                  <img src="/images/charity2-share.png" />
                </a>
              </div> */}
            </div>
          </div>
          <div className="m-offer__mid is-product-detail is-remove-border">
            <div className="m-offer__mid__bot">
              <div className="m-offer__mid__bot__infor">
                {voucherInfo?.viettelPercent ? (
                  <div className={`is-viettelpercent ${voucherInfo?.paymentCash == 0 ? 'is-left' : ''}`}>
                    <span>Tích điểm {get(voucherInfo, 'viettelPercent', '')}%</span>
                  </div>
                ) : null}
                {voucherInfo?.paymentCash ? (
                  <>
                    <div className="is-text">
                      <span>Tích điểm </span>
                      <span>{voucherInfo?.value?.replace(/\./g, ',')}</span>
                    </div>
                    <div className="is-text">
                      <span>Số tiền </span>
                      <span>
                        {numeral(voucherInfo.paymentCash ?? 0).format('0,0')} Vnđ
                        {/* <span className="c-pointlogo">L</span> */}
                      </span>
                    </div>
                  </>
                ) : (
                  // <div className="is-text">
                  //   <span>Miễn phí</span>
                  // </div>
                  <div className="is-text">
                    <span>Tích điểm </span>
                    <span>{voucherInfo.value}</span>
                  </div>
                )}
              </div>
              {authStore && authStore.token ? (
                <button
                  // onClick={() => {
                  //   router.push(`/doi-qua/${voucherInfo?.id}/chi-tiet`)
                  // }}
                  onClick={doReward}
                >
                  {/* {voucherInfo?.paymentCash ? 'Thanh toán ngay' : 'Nhận ưu đãi'} */}
                  Mua ngay
                </button>
              ) : null}
            </div>
          </div>
          <div className="m-offer__bot">
            <ul>
              <li className="is-remove-border">
                <div className="is-text">
                  <div className="is-text__title">
                    <span>Chi tiết ưu đãi</span>
                  </div>
                  <div style={{ lineHeight: '1.4' }} className="is-text__content">
                    <span>
                      Thương hiệu: {get(partnerInfo, 'name', '') || 'Đang cập nhật'}
                      <br />
                      Ngày bắt đầu: {moment(get(voucherInfo, 'startDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                      <br />
                      Ngày kết thúc: {moment(get(voucherInfo, 'endDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                      <br />
                      Khu vực: {get(voucherInfo, 'area', '') || 'Đang cập nhật'}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="is-text">
                  <div className="is-text__title">
                    <span>Mô tả ưu đãi</span>
                  </div>
                  {get(voucherInfo, 'description', '') ? (
                    <pre className="is-text__content b-maincontent">{get(voucherInfo, 'description', '')}</pre>
                  ) : (
                    <div className="is-text__content b-maincontent">
                      <p>Đang cập nhật</p>
                    </div>
                  )}
                </div>
              </li>
              {get(partnerInfo, 'detail', '') ? (
                <li>
                  <div className="is-text">
                    <div className="is-text__title">
                      <span>Về {get(partnerInfo, 'name', '')}</span>
                    </div>
                    <pre style={{ lineHeight: '1.4' }} className="is-text__content b-maincontent">
                      {get(partnerInfo, 'detail', '')}
                    </pre>
                  </div>
                </li>
              ) : null}
              {shopInfos.length > 0 ? (
                <li>
                  <div className="is-text">
                    <div className="is-text__title">
                      <span>Địa chỉ Áp dụng</span>
                    </div>
                    <div style={{ lineHeight: '1.4' }} className="is-text__content b-maincontent">
                      {btnMore
                        ? shopInfos?.map((item, index) => {
                            if (item?.address?.replaceAll(' ', '').slice(0, 4) == 'http') {
                              return (
                                <p
                                  key={index}
                                  onClick={() => {
                                    // setUrlVoucherInfo(item?.address)
                                    // setOpenPopupFix(true)
                                    window.location.href = item?.address
                                  }}
                                >
                                  {item?.address}
                                </p>
                              )
                            } else {
                              return <p key={index}>{item?.address}</p>
                            }
                          })
                        : shopInfos.slice(0, 3).map((item, index) => {
                            if (item?.address?.replaceAll(' ', '').slice(0, 4) == 'http') {
                              return (
                                <p
                                  key={index}
                                  onClick={() => {
                                    // setUrlVoucherInfo(item?.address)
                                    // setOpenPopupFix(true)
                                    window.location.href = item?.address
                                  }}
                                >
                                  {item?.address}
                                </p>
                              )
                            } else {
                              return <p key={index}>{item?.address}</p>
                            }
                          })}
                    </div>
                  </div>
                  {shopInfos.length > 3 ? (
                    <span onClick={() => setBtnMore(!btnMore)} className="c-voucher-loadmore">
                      {btnMore ? 'Ẩn' : 'Xem thêm'}
                    </span>
                  ) : null}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
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
          {loading ? <PageLoadingcss style={{ height: 50, marginTop: 15 }} /> : null}
        </Modal.Body>
      </Modal>
      <Modal show={modalGetPoint} onHide={handleCloseGetPoint} centered className="m-modal-charity is-qa">
        <Modal.Body>
          <div className="m-modal-charity__input">
            <div className="m-modaltitle">Thông báo</div>
            <div className="m-modalbody">
              Bạn có muốn thanh toán {numeral(voucherInfo.paymentCash ?? 0).format('0,0')} Vnđ?
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
          {loading ? <PageLoadingcss style={{ height: 50, marginTop: 15 }} /> : null}
        </Modal.Body>
      </Modal>
      <Modal
        show={modalUpdateAddress}
        onHide={handleCloseUpdateAddress}
        centered
        className="m-modal-charity is-qa"
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
      <ModalShowQRCode modalQRCode={modalQRCode} setModalQRCode={setModalQRCode} codeInfo={orderItemInfos} />
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
          {loading ? <PageLoadingcss style={{ height: 50, marginTop: 15 }} /> : null}
        </Modal.Body>
      </Modal>
      <Modal
        show={modalLienKet}
        onHide={() => handleModalLienKet(false)}
        centered
        className="m-modal-charity is-qa is-detail"
      >
        <Modal.Body>
          <div className="m-modal-charity__input">
            <div className="m-modaltitle">Thông báo</div>
            <div className="m-modalbody">Bạn phải liên kết số điện thoại để được tích điểm</div>
          </div>
          <div className="m-modal-charity__btn">
            <button
              onClick={() => {
                setLoadingLinkToPhone(true)
                setTimeout(() => {
                  setLoadingLinkToPhone(false)
                  router.push(`/tai-khoan`)
                }, 1000)
              }}
              style={{ background: '#F58323' }}
            >
              Đồng ý
            </button>
            <button onClick={() => handleModalLienKet(false)} style={{ background: '#818285' }}>
              Huỷ
            </button>
          </div>
          {loadingLinkToPhone ? <PageLoadingcss style={{ height: 50, marginTop: 15 }} /> : null}
        </Modal.Body>
      </Modal>
      <PopupFix openPopupFix={openPopupFix} setOpenPopupFix={setOpenPopupFix} url={urlVoucherInfo} />
    </>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  authStore: store?.authStore,
  cartStore: store?.cartStore,
  loading: store.loading,
}))(observer(PageMobile))
