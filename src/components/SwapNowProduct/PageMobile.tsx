import React, { FC, useEffect, useState } from 'react'
import { flowResult, toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import Modal from 'react-bootstrap/Modal'
import { useRouter } from 'next/router'
import numeral from 'numeral'
import { toastUtil } from '@src/helpers/Toast'
import CartStore from '@src/stores/cart.store'
import get from 'lodash/get'
import moment from 'dayjs'
import province from '@src/helpers/dataMap/province.json'
import district from '@src/helpers/dataMap/district.json'
import ward from '@src/helpers/dataMap/ward.json'
import PageLoadingcss from '@src/helpers/PageLoadingcss'
import { RootStoreHydration } from '@src/stores/RootStore'
import { RULE_PHONE, RULE_EMAIL } from '@src/contains/contants'
import { PAYMENT_METHOD } from '@src/interfaces/enums'
import helper from '@src/helpers/helper'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

const provincelist = province.RECORDS
const districtlistAll = district.RECORDS
const wardlistAll = ward.RECORDS

interface PageMobileProps {
  productStore?: {
    detail?: any
    productTypeInfo?: any
  }
  authStore?: {
    auth?: any
    token?: any
  }
  cartStore?: CartStore
  loading?: boolean
  store?: RootStoreHydration
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { productStore, authStore, cartStore, loading, store } = props
  console.log('🚀 ~ file: PageDesktop.tsx ~ line 22 ~ authStore', toJS(productStore))
  const router = useRouter()
  const { typeId } = router.query ?? {}

  const productDetailData = productStore.detail
  const productTypeInfo = productDetailData.productTypeInfo
  const productFilter = toJS(productDetailData?.productInfos?.find((item) => item.id == typeId))
  const authInfo = get(authStore, 'auth', {}) || {}
  const productInfo = productFilter
  const storeInfo = get(productDetailData, 'storeInfo', {}) || {}

  const [modalUpdateAddress, setModalUpdateAddress] = useState(false)
  const handleCloseUpdateAddress = () => {
    setNameUpdate(name)
    setModalUpdateAddress(false)
    setAddressUpdate(address)
    setPhoneUpdate(phone)
    setEmailUpdate(email)
    setProvinceIdUpdate(provinceId)
    setDistrictIdUpdate(districtId)
    setWardIdUpdate(wardId)
  }

  const [modalGetPoint, setModalGetPoint] = useState(false)
  const handleCloseGetPoint = () => setModalGetPoint(false)

  const [modalPayPoint, setModalPayPoint] = useState(false)
  const handleClosePayPoint = () => setModalPayPoint(false)

  const [note, setNote] = useState('')
  const [existingPoints, setExistingPoints] = useState<number>(
    productTypeInfo?.payment === 'cash' ? 0 : productInfo?.paymentPoint
  )

  const [name, setName] = useState<string>(authStore?.auth?.name ?? '')
  const [address, setAddress] = useState<string>(authStore?.auth?.address ?? '')
  const [phone, setPhone] = useState<string>(authStore?.auth?.phone ?? '')
  const [email, setEmail] = useState<string>(authStore?.auth?.email ?? '')

  const [provinceId, setProvinceId] = useState<number>(authStore?.auth?.provinceId ?? 0)
  const [districtId, setDistrictId] = useState<number>(authStore?.auth?.districtId ?? 0)
  // const [districtList, setDistrictList] = useState([])
  const [wardId, setWardId] = useState<number>(authStore?.auth?.wardId ?? 0)
  // const [wardList, setWardList] = useState([])

  const [nameUpdate, setNameUpdate] = useState<string>(authStore?.auth?.name ?? '')
  const [addressUpdate, setAddressUpdate] = useState<string>(authStore?.auth?.address ?? '')
  const [phoneUpdate, setPhoneUpdate] = useState<string>(authStore?.auth?.phone ?? '')
  const [emailUpdate, setEmailUpdate] = useState<string>(authStore?.auth?.email ?? '')
  const [provinceIdUpdate, setProvinceIdUpdate] = useState<number>(authStore?.auth?.provinceId ?? 0)
  const [districtIdUpdate, setDistrictIdUpdate] = useState<number>(authStore?.auth?.districtId ?? 0)
  const [districtListUpdate, setDistrictListUpdate] = useState([])
  const [wardIdUpdate, setWardIdUpdate] = useState<number>(authStore?.auth?.wardId ?? 0)
  const [wardListUpdate, setWardListUpdate] = useState([])
  const [activeButtonPay, setActiveButtonPay] = useState<boolean>(true)

  const [provinceUser] = provincelist.filter((item) => parseInt(item.id) === provinceId)
  const [districtUser] = districtlistAll.filter((item) => parseInt(item.id) === districtId)
  const [wardUser] = wardlistAll.filter((item) => parseInt(item.id) === wardId)
  const [shippingService, setShippingService] = useState<any>([])
  const [shipSelect, setShipSelect] = useState(0)
  const [methodPayment, setMethodPayment] = useState<PAYMENT_METHOD>(PAYMENT_METHOD.COD)

  const updateNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setNote(val)
  }
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
  //   if (existingPoints > productInfo?.paymentPoint) {
  //     setExistingPoints(productInfo?.paymentPoint ?? 0)
  //   }
  // }, [existingPoints])

  const handleNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setNameUpdate(val)
  }
  const handleAddressUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAddressUpdate(val)
  }
  const handlePhoneUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setPhoneUpdate(val)
  }
  const handleEmailUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEmailUpdate(val)
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
    if (!nameUpdate || !addressUpdate || !phoneUpdate || !provinceIdUpdate || !districtIdUpdate || !wardIdUpdate) {
      toastUtil.error('Vui lòng cập nhập các trường cần thay đổi thông tin')
    } else if (!RULE_PHONE.pattern.test(phoneUpdate)) {
      toastUtil.error('Quý khách vui lòng điền đúng số điện thoại của người nhận.')
    } else if (emailUpdate && !RULE_EMAIL.pattern.test(emailUpdate)) {
      toastUtil.error('Quý khách vui lòng điền đúng địa chỉ email của người nhận.')
    } else {
      setNameUpdate(nameUpdate)
      setAddressUpdate(addressUpdate)
      setPhoneUpdate(phoneUpdate)
      setEmailUpdate(emailUpdate)
      setProvinceIdUpdate(provinceIdUpdate)
      setDistrictIdUpdate(districtIdUpdate)
      setWardIdUpdate(wardIdUpdate)
      setModalUpdateAddress(false)
      setName(nameUpdate)
      setAddress(addressUpdate)
      setPhone(phoneUpdate)
      setEmail(emailUpdate)
      setProvinceId(provinceIdUpdate)
      setDistrictId(districtIdUpdate)
      setWardId(wardIdUpdate)
      setShipSelect(0)
    }
  }
  const openUpdateAddress = () => {
    setModalUpdateAddress(true)
  }
  const openUsingPoint = () => {
    // if (existingPoints >= productInfo.paymentPoint) {
    setModalGetPoint(true)
    // } else {
    //   setModalPayPoint(true)
    // }
  }

  const dataGenerateCheck = () => {
    const { typeId } = router.query ?? {}
    const discountCode = ''
    const params = {
      discountCode,
      districtId: districtId,
      listOrderItems: [
        {
          type: 'product',
          typeId: typeId ? Number(typeId) : Number(productInfo.id),
          quantity: 1,
        },
      ],
      mpoint: 0,
      provinceId: provinceId,
      storeOrders: [],
      wardId: wardId,
    }
    return params
  }
  const dataGeneratePay = () => {
    const { typeId } = router.query ?? {}
    const discountCode = ''
    const params = {
      address: address || '',
      discountCode,
      districtId: districtId,
      listOrderItems: [
        {
          type: 'product',
          typeId: typeId ? Number(typeId) : Number(productInfo.id),
          quantity: 1,
        },
      ],
      methodPayment: methodPayment,
      mpoint: existingPoints ? existingPoints : 0,
      provinceId: provinceId,
      receiveEmail: email || authInfo?.email || '',
      receiveName: name || authInfo?.name,
      receivePhone: phone || authInfo?.phone,
      storeOrders: [
        {
          storeId: Number(storeInfo?.id),
          codeShip: shippingService[shipSelect]?.code?.toString(),
          note: note,
        },
      ],
      wardId: wardId,
    }
    return params
  }
  const caculateOrder = async () => {
    setShippingService([])
    if (!provinceId && !districtId && !wardId) {
      toastUtil.error('Thiếu thông tin địa chỉ cần thiết. Vui lòng cập nhật thông tin địa chỉ!')
    } else {
      const params = dataGenerateCheck()
      const resCaculateOrder = await flowResult<any>(cartStore.calculatePrice?.(params))
      if (resCaculateOrder?.code != 0) {
        toastUtil.error(resCaculateOrder?.message || 'Hệ thống đang bận, vui lòng thực hiện sau')
      } else {
        if (Object.values(resCaculateOrder.shippingService).length > 0) {
          setShippingService(Object.values(resCaculateOrder.shippingService)[0])
        }
      }
    }
  }
  useEffect(() => {
    setTimeout(() => {
      if (authStore && authStore.token) {
        caculateOrder()
      }
    }, 500)
  }, [provinceId, districtId, wardId])

  const payProduct = async () => {
    if (activeButtonPay) {
      setActiveButtonPay(false)
      if (!address || !provinceId || !districtId || !wardId || !phone) {
        toastUtil.error('Thiếu thông tin cần thiết!')
      } else {
        const params = dataGeneratePay()
        const resPayOrder = await flowResult<any>(cartStore.checkoutProduct?.(params))
        if (resPayOrder?.code && resPayOrder?.code != 0) {
          toastUtil.error(resPayOrder?.message || 'Hệ thống đang bận, vui lòng thực hiện sau')
          handleCloseGetPoint()
        } else {
          if (resPayOrder?.pay?.code != 0) {
            toastUtil.error(resPayOrder?.pay?.message || 'Hệ thống đang bận, vui lòng thực hiện sau')
            handleCloseGetPoint()
          } else {
            if (resPayOrder?.pay?.vnpUrl) {
              window.location.href = resPayOrder?.pay?.vnpUrl
            } else {
              toastUtil.success(resPayOrder?.pay?.message || 'Đổi sản phẩm thành công !')
              router.push('/trang-thai-don-hang')
            }
            handleCloseGetPoint()
            // setModalQRCode(true)
            // setTimeout(() => {
            //   router.push('/uu-dai-cua-toi')
            // }, 1000)
          }
        }
      }
      setActiveButtonPay(true)
      store?.setLoader(false)
    }
  }

  if (!authStore || !authStore.token) {
    return (
      <React.Fragment>
        <h1>Bạn không có quyền xem trang này!</h1>
      </React.Fragment>
    )
  }

  return (
    <>
      <div className="m-body">
        <HeaderMobile title={`Đổi sản phẩm ngay`} />
        <div className="m-swap-now">
          <div className="m-swap-now__address">
            <div className="m-swap-now__address__title">
              <span>Địa chỉ nhận hàng</span>
            </div>
            <div className="m-swap-now__address__content">
              <div className="m-swap-now__address__content__text">
                <span className="is-content">
                  {name || get(authInfo, 'name', {}) || ''}
                  {phone && name ? ' - ' : ''}
                  {phone || get(authInfo, 'phone', {}) || ''}
                  {phone && email ? <br /> : null}
                  {email}
                  <br />
                  <br />
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
                </span>
                <i onClick={openUpdateAddress}>Cập nhật</i>
              </div>
              <div className="m-swap-now__address__content__text">
                <span className="is-textbox">Ghi chú:</span>
                <input type="text" value={note} onChange={updateNote} placeholder="VD: Giao vào giờ hành chính"></input>
              </div>
            </div>
          </div>
          <div className="m-swap-now__product">
            <div className="m-swap-now__product__title">
              <div className="m-swap-now__product__title__top">
                <span>Sản phẩm</span>
              </div>
              <div className="m-swap-now__product__title__bot">
                <div className="m-swap-now__product__title__bot__left">
                  {productInfo?.images?.length != 0 ? (
                    <img src={get(productInfo, 'images[0]', {}) || ''} />
                  ) : (
                    <img src={get(productTypeInfo, 'images[0]', {}) || ''} />
                  )}
                </div>
                <div className="m-swap-now__product__title__bot__right">
                  <div className="m-swap-now__product__title__bot__right__title">
                    <span>{get(productInfo, 'name', {}) || ''}</span>
                  </div>
                  <div style={{ marginTop: '15px' }} className="m-swap-now__product__title__bot__right__point">
                    <i>{numeral(productInfo.paymentCash ?? 0).format('0,0')} Vnđ</i>
                    {/* {existingPoints == 0 ? (
                      <span>&nbsp;Vnđ</span>
                    ) : ( */}
                    {/* <span className="c-pointlogo">L</span> */}
                    {/* )} */}
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
                        // if (existingPoints == 0) {
                        //   if (authInfo?.point >= productInfo?.paymentPoint) {
                        //     setExistingPoints(productInfo?.paymentPoint ?? 0)
                        //   } else {
                        //     toastUtil.error('Bạn không đủ điểm để đổi')
                        //   }
                        // } else {
                        //   setExistingPoints(0)
                        // }
                        if (productTypeInfo?.payment === 'cash') {
                          toastUtil.error('Sản phẩm này chỉ được thanh toán bằng tiền')
                        } else if (productTypeInfo?.payment === 'point') {
                          toastUtil.error('Sản phẩm này chỉ được thanh toán bằng điểm')
                        } else {
                          if (existingPoints == 0) {
                            setExistingPoints(productInfo?.paymentPoint ?? 0)
                          } else {
                            setExistingPoints(0)
                          }
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
                <span>Tổng {existingPoints == 0 ? 'tiền' : 'điểm'} sản phẩm</span>
                <span>
                  {numeral(productInfo.paymentCash ?? 0).format('0,0')} {existingPoints == 0 ? 'Vnđ' : 'điểm'}
                </span>
              </div>
              {/* <div className="is-info-point">
                <span>Khuyến mại</span>
                <span>0 {existingPoints == 0 ? 'Vnđ' : 'điểm'}</span>
              </div>
              <div className="is-info-point">
                <span>Sử dụng {existingPoints == 0 ? 'tiền' : 'điểm'}</span>
                <span style={{ fontWeight: 600 }}>
                  -{' '}
                  {existingPoints == 0
                    ? numeral(productInfo?.paymentPoint ?? 0).format('0,0')
                    : numeral(existingPoints ?? 0).format('0,0')}{' '}
                  {existingPoints == 0 ? 'Vnđ' : 'điểm'}
                </span>
              </div> */}
            </div>
          </div>
          <div className="m-swap-now__product">
            <div className="m-swap-now__product__mid">
              <div className="m-swap-now__product__mid__left">
                <span>Phương thức thanh toán</span>
                <span style={{ marginTop: 10, fontWeight: 500 }}>{helper.showPaymentMethod(methodPayment)}</span>
              </div>
              <div className="m-swap-now__product__mid__right">
                <div className="is-flex">
                  <label className="c-switch">
                    <input
                      type="checkbox"
                      checked={methodPayment == PAYMENT_METHOD.COD ? true : false}
                      onClick={() => {
                        if (methodPayment == PAYMENT_METHOD.COD) {
                          setMethodPayment(PAYMENT_METHOD.ONLINE)
                        } else {
                          setMethodPayment(PAYMENT_METHOD.COD)
                        }
                      }}
                    />
                    <span className="c-cslider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {shippingService.length > 0 ? (
            <div className="m-swap-now__bot clearfix">
              <div className="m-swap-now__bot__title">
                <span>Đơn vị vận chuyển</span>
                {/* <a href="/">Thay đổi</a> */}
              </div>
              {shippingService?.map((item, index) => {
                return (
                  <label className="m-swap-now__bot__content" key={index}>
                    <div className="m-swap-now__bot__content__left">
                      <input
                        type="radio"
                        checked={shipSelect == index ? true : false}
                        value={index}
                        name="shipservice"
                        onClick={() => setShipSelect(index)}
                      />
                      <span></span>
                    </div>
                    <div className="m-swap-now__bot__content__right">
                      <div className="m-swap-now__bot__content__right__img">
                        <img src={item?.carrier_info?.image_url} alt="img" width={30} height={30} />
                      </div>
                      <div className="m-swap-now__bot__content__right__text">
                        <span style={{ fontWeight: 600 }}>{item?.carrier_info?.name}</span>
                        {!get(item, 'estimated_delivery_at', '') ? null : (
                          <span style={{ fontSize: '12px' }}>
                            Dự kiến giao hàng vào {moment(get(item, 'estimated_delivery_at', '')).format('DD-MM-YYYY')}
                          </span>
                        )}
                      </div>
                      <div className="m-swap-now__bot__content__right__price">
                        <span>{numeral(item?.fee ?? 0).format('0,0')} Vnđ</span>
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
          ) : null}
          {loading ? <PageLoadingcss style={{ height: 80, marginTop: 15 }} /> : null}
        </div>
        {shippingService.length >= 1 ? (
          <div className="m-swap-now__btn" onClick={openUsingPoint}>
            <button>Thanh toán ngay</button>
          </div>
        ) : null}
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
                        value={nameUpdate}
                        className="form-control"
                        onChange={handleNameUpdate}
                        placeholder="Tên người nhận"
                      />
                    </div>
                  </div>
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
                  <div className="is-text">
                    <div className="form-group">
                      <input
                        value={phoneUpdate}
                        className="form-control"
                        onChange={handlePhoneUpdate}
                        placeholder="Số điện thoại"
                      />
                    </div>
                  </div>
                  <div className="is-text">
                    <div className="form-group">
                      <input
                        value={emailUpdate}
                        className="form-control"
                        onChange={handleEmailUpdate}
                        placeholder="Email"
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
                Bạn có muốn mua sản phẩm này với{' '}
                {existingPoints == 0
                  ? numeral(productInfo?.paymentCash ?? 0).format('0,0')
                  : numeral(existingPoints ?? 0).format('0,0')}{' '}
                {existingPoints == 0 ? 'Vnđ' : 'điểm'} và sử dụng{' '}
                {numeral(shippingService[shipSelect]?.fee ?? 0).format('0,0')} {existingPoints == 0 ? 'Vnđ' : 'Vnđ'} làm
                phí ship
              </div>
            </div>
            <div className="m-modal-charity__btn">
              {/* <button onClick={payProduct} style={{ background: '#ee0033' }}> */}
              <button onClick={payProduct} style={{ background: '#141ed2' }}>
                Đồng ý
              </button>
              <button onClick={handleCloseGetPoint} style={{ background: '#818285' }}>
                Huỷ
              </button>
            </div>
            {loading ? <PageLoadingcss style={{ height: 50, marginTop: 15 }} /> : null}
          </Modal.Body>
        </Modal>
        <Modal show={modalPayPoint} onHide={handleClosePayPoint} centered className="m-modal-charity is-qa">
          <Modal.Body>
            <div className="m-modal-charity__input">
              <div className="m-modaltitle">Thông báo</div>
              <div className="m-modalbody">
                Bạn cần thêm {numeral(productInfo.paymentPoint - existingPoints ?? 0).format('0,0')} điểm để đổi sản
                phẩm này.
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
      </div>
    </>
  )
}

export default inject(({ store }) => ({
  productStore: store?.productStore,
  authStore: store?.authStore,
  cartStore: store?.cartStore,
  loading: store.loading,
  store,
}))(observer(PageMobile))
