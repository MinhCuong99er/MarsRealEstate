import React, { FC, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import Link from 'next/link'
import { flowResult } from 'mobx'
import { observer, inject } from 'mobx-react'
import { VoucherHydration } from '@src/stores/voucher.store'
import { toastUtil } from '@src/helpers/Toast'
import { AuthHydration } from '@src/stores/auth.store'
import GlobalStore from '@src/stores/global.store'
import numeral from 'numeral'
numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface MenuMobileProps {
  authStore?: AuthHydration
  voucherStore?: VoucherHydration
  globalStore?: GlobalStore
}

const MenuMobile: FC<MenuMobileProps> = (props: MenuMobileProps) => {
  const { voucherStore, authStore, globalStore } = props
  const [modalGetPoint, setModalGetPoint] = useState(false)
  const [modalAccumulatePoint, setModalAccumulatePoint] = useState(false)
  const [modalPayPoint, setModalPayPoint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

  const [code, setCode] = useState<string>('')

  const handleCloseGetPoint = () => {
    setModalGetPoint(false)
    setCode('')
  }
  const handleCloseAccumulatePoint = () => {
    authStore?.getCustomerInfo()
    setModalAccumulatePoint(false)
  }
  const handleClosePayPoint = () => {
    authStore?.getCustomerInfo()
    setModalPayPoint(false)
  }

  const updateCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCode(val)
  }

  const codeToPoint = async () => {
    if (!code) {
      toastUtil.error('Vui lòng cập nhập code để đổi thành điểm')
    } else {
      const resCode = await flowResult<any>(voucherStore.reChargeByCode?.(code))
      console.log('🚀 ~ file: MenuMobile.tsx ~ line 41 ~ codeToPoint ~ resCode', resCode)
      if (resCode?.errorCode) {
        toastUtil.error(resCode?.message || 'Hệ thống bận, vui lòng quay lại sau')
      } else {
        toastUtil.success(resCode?.message || 'Thành công')
        handleCloseGetPoint()
      }
    }
  }

  const doAccumulatePoint = async () => {
    // const rs = await flowResult<any>(globalStore.getTransactionCode())
    // if (!rs.errorCode) {
    //   setModalAccumulatePoint(true)
    //   setTimeLeft(rs.data.ttl)
    // } else {
    //   toastUtil.error(rs.message)
    // }
    setModalAccumulatePoint(true)
    setTimeLeft(60)
  }

  // const doPayPoint = async () => {
  //   const rs = await flowResult<any>(globalStore.getTransactionCode())
  //   if (!rs.errorCode) {
  //     setModalPayPoint(true)
  //     setTimeLeft(rs.data.ttl)
  //   } else {
  //     toastUtil.error(rs.message)
  //   }
  // }

  useEffect(() => {
    if ((timeLeft === 0 && modalPayPoint) || (timeLeft === 0 && modalAccumulatePoint)) {
      toastUtil.error('Code đã hết hiệu lực')
      setModalAccumulatePoint(false)
      setModalPayPoint(false)
      setTimeLeft(null)
    }
    // exit early when we reach 0
    if (!timeLeft) return
    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId)
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft])

  return (
    <>
      <div className="m-menu">
        <div className="container">
          <div className="m-menu__list">
            <ul className="clearfix">
              {/* <li onClick={() => setModalGetPoint(true)}>
                <img src="/images/cong-diem.png?v=1.2" />
                <span>
                  Nhập mã
                  <br />
                  nạp điểm
                </span>
              </li> */}
              <li onClick={() => doAccumulatePoint()}>
                <img src="/images/tich-diem.png?v=1.2" />
                <span>
                  Mã giao dịch
                  {/* <br />
                  tại cửa hàng */}
                </span>
              </li>
              {/* <li>
                <img src="/images/thanh-toan-bang-diem.png?v=1.1" />
                <span>
                  Thanh toán
                  <br />
                  bằng điểm
                </span>
              </li> */}
              {/* <li>
                <Link href="/tang-diem-cho-ban">
                  <a
                    style={{
                      textDecoration: 'none',
                    }}
                  >
                    <img src="/images/tang-diem-menu.png?v=1.2" />
                    <span>
                      Tặng điểm
                      <br />
                      cho bạn
                    </span>
                  </a>
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
      {/* modal nạp điểm */}
      <Modal show={modalGetPoint} onHide={handleCloseGetPoint} centered className="m-getpoint-modal">
        <Modal.Body>
          <div className="m-getpoint-modal__title">
            <span>Nhập mã nhận điểm</span>
          </div>
          <div className="m-getpoint-modal__content">
            <label>Vui lòng nhập mã voucher đính kèm trên sản phẩm</label>
            <input type="text" value={code} onChange={updateCode} />
          </div>
          <div className="m-getpoint-modal__btn">
            <div className="m-getpoint-modal__btn__left" onClick={() => codeToPoint()}>
              Xác nhận
            </div>
            <div onClick={handleCloseGetPoint} className="m-getpoint-modal__btn__right">
              Huỷ
            </div>
          </div>
          <div className="m-getpoint-modal__bot">
            <span>Mọi thắc mắc vui lòng liên hệ hotline</span>
          </div>
        </Modal.Body>
      </Modal>
      {/* modal tích điểm */}
      <Modal
        show={modalAccumulatePoint}
        onHide={handleCloseAccumulatePoint}
        centered
        className="m-accumulatepoint-modal"
      >
        <Modal.Body>
          <div className="m-accumulatepoint-modal__title">
            <div className="m-accumulatepoint-modal__title__left">
              <span>Tích điểm</span>
            </div>
            <div className="m-accumulatepoint-modal__title__right">
              <span>Số điểm hiện có</span>
              <span>{numeral(authStore?.auth?.point ?? 0).format('#,#')}</span>
            </div>
          </div>

          <div className="m-accumulatepoint-modal__content">
            {!authStore?.auth?.phone ? (
              <>
                <div className="m-accumulatepoint-modal__content__text">
                  <span>
                    Quý khách vui lòng đưa mã cho <br />
                    nhân viên thu ngân để tích thêm điểm
                  </span>
                </div>
                <div className="m-accumulatepoint-modal__content__barcode">
                  <Barcode
                    value={'391BA20F'}
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
                  <QRCode value={'391BA20F'} bgColor={'transparent'} size={190} />
                  <span>
                    Mã này mô phỏng số điện thoại của bạn,
                    <br /> bạn cũng có thể sử dụng số điện thoại để tích điểm
                  </span>
                  <br />
                  {timeLeft ? (
                    <span style={{ fontSize: 18 }}>
                      Còn <b>{timeLeft ?? ''}</b>s
                    </span>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="m-accumulatepoint-modal__content__text">
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
            <button onClick={handleCloseAccumulatePoint} className="m-accumulatepoint-modal__content__btn">
              <span>Đóng</span>
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {/* modal thanh toán bằng điểm */}
      <Modal show={modalPayPoint} onHide={handleClosePayPoint} centered className="m-accumulatepoint-modal">
        <Modal.Body>
          <div className="m-accumulatepoint-modal__title">
            <div className="m-accumulatepoint-modal__title__left">
              <span>Thanh toán bằng điểm</span>
            </div>
            <div className="m-accumulatepoint-modal__title__right">
              <span>Số điểm hiện có</span>
              <span>{numeral(authStore?.auth?.point ?? 0).format('#,#')}</span>
            </div>
          </div>
          <div className="m-accumulatepoint-modal__content">
            {!authStore?.auth?.phone ? (
              <>
                <div className="m-accumulatepoint-modal__content__text">
                  <span>
                    Quý khách vui lòng đưa mã cho <br />
                    nhân viên thu ngân để sử dụng điểm
                  </span>
                </div>
                <div className="m-accumulatepoint-modal__content__barcode">
                  <Barcode
                    value={globalStore?.transactionCode?.code ?? ''}
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
                  <QRCode value={globalStore?.transactionCode?.code ?? ''} bgColor={'transparent'} size={190} />
                </div>
                <br />
                {timeLeft ? (
                  <span style={{ fontSize: 18, display: 'block' }}>
                    Còn <b>{timeLeft ?? ''}</b>s
                  </span>
                ) : null}
              </>
            ) : (
              <div className="m-accumulatepoint-modal__content__text">
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
            <button onClick={handleClosePayPoint} className="m-accumulatepoint-modal__content__btn">
              <span>Đóng</span>
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
  voucherStore: store?.voucherStore,
  globalStore: store.globalStore,
}))(observer(MenuMobile))
