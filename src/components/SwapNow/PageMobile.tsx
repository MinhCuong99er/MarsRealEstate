import React, { FC, useEffect, useState } from 'react'
import { flowResult, toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import Modal from 'react-bootstrap/Modal'
// import { useRouter } from 'next/router'
import numeral from 'numeral'
import { toastUtil } from '@src/helpers/Toast'
import CartStore from '@src/stores/cart.store'
import get from 'lodash/get'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'

import province from '@src/helpers/dataMap/province.json'
import district from '@src/helpers/dataMap/district.json'
import ward from '@src/helpers/dataMap/ward.json'
import PageLoadingcss from '@src/helpers/PageLoadingcss'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

const provincelist = province.RECORDS
const districtlistAll = district.RECORDS
const wardlistAll = ward.RECORDS

interface PageMobileProps {
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

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { voucherStore, authStore, cartStore, loading } = props
  console.log('🚀 ~ file: PageDesktop.tsx ~ line 22 ~ voucherStore', toJS(voucherStore))
  // const router = useRouter()

  const voucherDetailData = voucherStore.detail
  const authInfo = get(authStore, 'auth', {}) || {}
  const voucherInfo = get(voucherDetailData, 'voucherInfo', {}) || {}

  const [modalUpdateAddress, setModalUpdateAddress] = useState(false)
  const handleCloseUpdateAddress = () => {
    setModalUpdateAddress(false)
    setAddressUpdate(address)
    setProvinceIdUpdate(provinceId)
    setDistrictIdUpdate(districtId)
    setWardIdUpdate(wardId)
  }

  const [modalGetPoint, setModalGetPoint] = useState(false)
  const handleCloseGetPoint = () => setModalGetPoint(false)

  const [modalPayPoint, setModalPayPoint] = useState(false)
  const handleClosePayPoint = () => setModalPayPoint(false)

  const [modalQRCode, setModalQRCode] = useState(false)
  const handleCloseQRCode = () => setModalQRCode(false)

  // const [note, setNote] = useState('')
  const note = ''

  const [existingPoints, setExistingPoints] = useState<number>(0)
  const [orderItemInfos, setOrderItemInfos] = useState<any>()

  const [address, setAddress] = useState<string>(authStore?.auth?.address ?? '')
  const [provinceId, setProvinceId] = useState<number>(authStore?.auth?.provinceId ?? 0)
  const [districtId, setDistrictId] = useState<number>(authStore?.auth?.districtId ?? 0)
  // const [districtList, setDistrictList] = useState([])
  const [wardId, setWardId] = useState<number>(authStore?.auth?.wardId ?? 0)
  // const [wardList, setWardList] = useState([])

  const [addressUpdate, setAddressUpdate] = useState<string>(authStore?.auth?.address ?? '')
  const [provinceIdUpdate, setProvinceIdUpdate] = useState<number>(authStore?.auth?.provinceId ?? 0)
  const [districtIdUpdate, setDistrictIdUpdate] = useState<number>(authStore?.auth?.districtId ?? 0)
  const [districtListUpdate, setDistrictListUpdate] = useState([])
  const [wardIdUpdate, setWardIdUpdate] = useState<number>(authStore?.auth?.wardId ?? 0)
  const [wardListUpdate, setWardListUpdate] = useState([])
  const [activeButtonPay, setActiveButtonPay] = useState<boolean>(true)

  // const [provinceUser] = provincelist.filter(
  //   (item) => parseInt(item.id) === provinceId
  // )
  // const [districtUser] = districtlistAll.filter(
  //   (item) => parseInt(item.id) === districtId
  // )
  // const [wardUser] = wardlistAll.filter((item) => parseInt(item.id) === wardId)

  // const updateNote = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const val = e.target.value
  //   setNote(val)
  // }
  const handleGetExistingPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setExistingPoints(parseInt(val))
  }

  useEffect(() => {
    const listDistrict = districtlistAll
      .filter((item) => parseInt(item.province) === provinceIdUpdate)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      )
    setDistrictListUpdate(listDistrict)
  }, [provinceIdUpdate])

  useEffect(() => {
    const listWard = wardlistAll
      .filter((item) => parseInt(item.district) === districtIdUpdate)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      )
    setWardListUpdate(listWard)
  }, [districtIdUpdate])

  // useEffect(() => {
  //   if (existingPoints > voucherInfo?.paymentPoint) {
  //     setExistingPoints(voucherInfo?.paymentPoint ?? 0)
  //   }
  // }, [existingPoints])

  const handleAddressUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAddressUpdate(val)
  }
  const handleProvinceUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setProvinceIdUpdate(parseInt(val))
    setDistrictIdUpdate(0)
    setWardIdUpdate(0)
  }
  const handleDistrictUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setDistrictIdUpdate(parseInt(val))
    setWardIdUpdate(0)
  }
  const handleWardUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setWardIdUpdate(parseInt(val))
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
  // const openUpdateAddress = () => {
  //   setModalUpdateAddress(true)
  // }

  const openUsingPoint = () => {
    // if (existingPoints >= voucherInfo.paymentPoint) {
    setModalGetPoint(true)
    // } else {
    //   setModalPayPoint(true)
    // }
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
            setOrderItemInfos(resPayOrder?.pay?.orderItemInfos[0])
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
  if (!authStore || !authStore.token) return <h1>Bạn không có quyền xem trang này!</h1>

  return (
    <>
      <div className="m-body">
        <HeaderMobile title={`Đổi ưu đãi ngay`} />
        <div className="m-swap-now">
          {/* <div className="m-swap-now__address">
            <div className="m-swap-now__address__title">
              <span>
                {voucherInfo?.type == 'course'
                  ? 'Thông tin khách hàng'
                  : 'Địa chỉ nhận hàng'}
              </span>
            </div>
            <div className="m-swap-now__address__content">
              <div className="m-swap-now__address__content__text">
                <span className="is-content">
                  {get(authInfo, 'name', {}) || ''}
                  {get(authInfo, 'phone', {}) ? ' - ' : ''}
                  {get(authInfo, 'phone', {}) || ''}
                  <br />
                  <br />
                  {voucherInfo ? (
                    <>
                      {address ? (
                        <>
                          {address}
                          {wardUser?.name ? ', ' : ''}
                        </>
                      ) : null}
                      {wardUser?.name ? (
                        <>
                          {wardUser?.name}
                          {districtUser?.name ? ', ' : ''}
                        </>
                      ) : null}
                      {districtUser?.name ? (
                        <>
                          {districtUser?.name}
                          <br />
                        </>
                      ) : null}
                      {provinceUser?.name ? (
                        <>
                          {provinceUser?.name}
                          <br />
                        </>
                      ) : null}
                    </>
                  ) : null}
                </span>
                {voucherInfo ? (
                  <i onClick={openUpdateAddress}>Cập nhật</i>
                ) : null}
              </div>
              {!voucherInfo ? (
                <div className="m-swap-now__address__content__text">
                  <span className="is-textbox">Ghi chú:</span>
                  <input
                    type="text"
                    value={note}
                    onChange={updateNote}
                    placeholder="VD: Giao vào giờ hành chính"
                  ></input>
                </div>
              ) : null}
            </div>
          </div> */}
          <div className="m-swap-now__product">
            <div className="m-swap-now__product__title">
              <div className="m-swap-now__product__title__top">
                <span>
                  {/* {voucherInfo?.type == 'course' ? 'Khóa học' : 'Ưu đãi'} */}
                  Ưu đãi
                </span>
              </div>
              <div className="m-swap-now__product__title__bot">
                <div className="m-swap-now__product__title__bot__left">
                  <img src={get(voucherInfo, 'images[0]', {}) || ''} />
                </div>
                <div className="m-swap-now__product__title__bot__right">
                  <div className="m-swap-now__product__title__bot__right__title">
                    <span>{get(voucherInfo, 'name', {}) || ''}</span>
                  </div>
                  <div style={{ marginTop: '15px' }} className="m-swap-now__product__title__bot__right__point">
                    {voucherInfo?.paymentCash ? (
                      <i>{numeral(voucherInfo.paymentCash ?? 0).format('0,0')} Vnđ</i>
                    ) : (
                      <i>Miễn phí</i>
                    )}
                    <span>X1</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-swap-now__product__mid" style={{ display: 'none' }}>
              <div className="m-swap-now__product__mid__left">
                <span>Sử dụng điểm hiện có</span>
                <span style={{ fontSize: '12px' }}>(Đang có {numeral(authInfo.point ?? 0).format('0,0')} điểm)</span>
              </div>
              <div className="m-swap-now__product__mid__right">
                <input
                  type="number"
                  value={existingPoints ?? 0}
                  style={{ display: 'none' }}
                  // placeholder={numeral(
                  //   voucherInfo.paymentPoint ?? 0
                  // ).format('0,0')}
                  onChange={handleGetExistingPoints}
                />
                <div className="is-flex">
                  <label className="c-switch">
                    <input
                      type="checkbox"
                      checked={existingPoints == 0 ? false : true}
                      onClick={() => {
                        if (existingPoints == 0) {
                          if (authInfo?.point >= voucherInfo?.paymentCash) {
                            setExistingPoints(voucherInfo?.paymentCash ?? 0)
                          } else {
                            toastUtil.error('Bạn không đủ điểm để đổi')
                          }
                        } else {
                          setExistingPoints(0)
                        }
                      }}
                    />
                    <span className="c-cslider round"></span>
                  </label>
                  {/* <button
                    className={existingPoints == 0 ? 'active' : ''}
                    onClick={() => setExistingPoints(0)}
                  >
                    Không sử dụng
                  </button>
                  <button
                    className={existingPoints != 0 ? 'active' : ''}
                    onClick={() =>
                      setExistingPoints(voucherInfo?.paymentPoint ?? 0)
                    }
                  >
                    Sử dụng
                  </button> */}
                </div>
              </div>
            </div>
            <div className="m-swap-now__product__bot">
              <div className="is-info-point">
                <span>Tổng tiền</span>
                <span>
                  {numeral(voucherInfo.paymentCash ?? 0).format('0,0')} Vnđ
                  {/* <span className="c-pointlogo">L</span> */}
                </span>
              </div>
              {/* <div className="is-info-point">
                <span>Khuyến mại</span>
                <span>0 điểm</span>
              </div>
              <div className="is-info-point">
                <span>Sử dụng điểm</span>
                <span style={{ fontWeight: 600 }}>
                  - {numeral(existingPoints ?? 0).format('0,0')} điểm
                </span>
              </div> */}
            </div>
          </div>
          {/* <div className="m-swap-now__bot">
            <div className="m-swap-now__bot__title">
              <span>Đơn vị vận chuyển</span>
              <a href="/">Thay đổi</a>
            </div>
            <div className="m-swap-now__bot__content">
              <div className="m-swap-now__bot__content__left">
                <img src="/images/topship.png" />
              </div>
              <div className="m-swap-now__bot__content__right">
                <div className="m-swap-now__bot__content__right__text">
                  <span style={{ fontWeight: 600 }}>Topship - Snappy</span>
                  <span style={{ fontSize: '12px' }}>
                    Dự kiến giao hàng vào 09/09/2021
                  </span>
                </div>
                <div className="m-swap-now__bot__content__right__price">
                  <span>25.000vnđ</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="m-swap-now__btn" onClick={openUsingPoint}>
          <button>{voucherInfo?.paymentPoint > 0 ? 'Thanh toán ngay' : 'Đổi ưu đãi ngay'}</button>
        </div>
        <div style={{ height: '65px' }}></div>
        <Modal show={modalUpdateAddress} onHide={handleCloseUpdateAddress} centered className="m-modal-charity is-qa">
          <Modal.Body>
            <div className="md-userpage-address">
              <div className="md-userpage-address__box">
                <div className="is-title">Cập nhật địa chỉ giao hàng</div>
                <div className="is-form">
                  <div className="is-text">
                    <div className="form-group">
                      <input
                        value={addressUpdate}
                        className="form-control"
                        onChange={handleAddressUpdate}
                        placeholder="Số nhà, toà nhà, tên đường"
                      />
                    </div>
                  </div>
                  <div className="is-row clearfix">
                    <div className="form-group is-dropdown-nav">
                      <select
                        value={provinceIdUpdate}
                        onChange={handleProvinceUpdate}
                        className={`form-control ${provinceIdUpdate ? 'active' : ''}`}
                      >
                        <option value={0}>Tỉnh/Thành phố</option>
                        {provincelist.map((s) => (
                          <option key={parseInt(s.id, 10)} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group is-dropdown-nav">
                      <select
                        value={districtIdUpdate}
                        onChange={handleDistrictUpdate}
                        className={`form-control ${districtIdUpdate ? 'active' : ''}`}
                      >
                        <option value={0}>Quận/Huyện</option>
                        {districtListUpdate.map((s) => (
                          <option key={parseInt(s.id, 10)} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group is-dropdown-nav">
                      <select
                        value={wardIdUpdate}
                        onChange={handleWardUpdate}
                        className={`form-control ${wardIdUpdate ? 'active' : ''}`}
                      >
                        <option value={0}>Phường/Xã</option>
                        {wardListUpdate.map((s) => (
                          <option key={parseInt(s.id, 10)} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
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
        <Modal show={modalGetPoint} onHide={handleCloseGetPoint} centered className="m-modal-charity is-qa">
          <Modal.Body>
            <div className="m-modal-charity__input">
              <div className="m-modaltitle">Thông báo</div>
              <div className="m-modalbody">
                Bạn có muốn đổi ưu đãi này với {numeral(voucherInfo.paymentCash ?? 0).format('0,0')} Vnđ?
              </div>
            </div>
            <div className="m-modal-charity__btn">
              {/* <button onClick={payVoucher} style={{ background: '#ee0033' }}> */}
              <button onClick={payVoucher} style={{ background: '#141ed2' }}>
                Đồng ý
              </button>
              <button onClick={handleCloseGetPoint} style={{ background: '#818285' }}>
                Huỷ
              </button>
            </div>
            {loading ? <PageLoadingcss style={{ height: '30px' }} /> : null}
          </Modal.Body>
        </Modal>
        <Modal show={modalPayPoint} onHide={handleClosePayPoint} centered className="m-modal-charity is-qa">
          <Modal.Body>
            <div className="m-modal-charity__input">
              <div className="m-modaltitle">Thông báo</div>
              <div className="m-modalbody">
                Bạn cần thêm {numeral(voucherInfo.paymentCash - existingPoints ?? 0).format('0,0')} điểm để đổi ưu đãi
                này.
                <br />
                {/* Bạn có muốn thanh toán online{' '}
                {numeral(voucherInfo.paymentPoint - existingPoints ?? 0).format(
                  '0,0'
                )}{' '}
                vnđ? */}
              </div>
            </div>
            <div className="m-modal-charity__btn" style={{ justifyContent: 'center' }}>
              {/* <button
                onClick={() => router.push('/thanh-toan-online')}
                style={{ background: '#F58323' }}
              >
                Thanh toán
              </button> */}
              <button onClick={handleClosePayPoint} style={{ background: '#818285' }}>
                Đóng
              </button>
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={modalQRCode} onHide={handleCloseQRCode} centered className="m-accumulatepoint-modal">
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
                  value={orderItemInfos?.code?.code ?? ''}
                  displayValue={true}
                  background={'transparent'}
                  height={50}
                  width={1.2}
                  fontSize={13}
                  textMargin={2}
                  textSpacing={5}
                />
              </div>
              <div className="m-accumulatepoint-modal__content__qrcode">
                <QRCode value={orderItemInfos?.code?.code ?? ''} bgColor={'transparent'} size={190} />
              </div>
              <button onClick={handleCloseQRCode} className="m-accumulatepoint-modal__content__btn">
                <span>Đóng</span>
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  authStore: store?.authStore,
  cartStore: store?.cartStore,
  loading: store.loading,
}))(observer(PageMobile))
