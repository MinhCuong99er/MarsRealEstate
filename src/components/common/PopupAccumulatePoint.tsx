import { AuthHydration } from '@src/stores/auth.store'
import React, { FC, useState, useEffect } from 'react'
// import PopupShowQrCode from '../SwapGift/PopupShowQrCode'
import Modal from 'react-bootstrap/Modal'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import Link from 'next/link'
import numeral from 'numeral'
import { observer, inject } from 'mobx-react'
import { toastUtil } from '@src/helpers/Toast'
import GlobalStore from '@src/stores/global.store'
import RootStore from '@src/stores/RootStore'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PopupAccumulatePointProps {
  authStore?: AuthHydration
  modalAccumulatePoint: boolean
  setModalAccumulatePoint: any
  globalStore?: GlobalStore
  timeLeft?: any
  setTimeLeft?: any
}

const PopupAccumulatePoint: FC<PopupAccumulatePointProps> = (props: PopupAccumulatePointProps) => {
  const { authStore, modalAccumulatePoint, setModalAccumulatePoint, globalStore, timeLeft, setTimeLeft } = props
  const [modalPayPoint, setModalPayPoint] = useState(false)

  // useEffect(() => {
  //   if (modalAccumulatePoint) {
  //     setTimeLeft(60)
  //   }
  // }, [modalAccumulatePoint])

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

  const handleCloseAccumulatePoint = () => {
    authStore?.getCustomerInfo()
    setModalAccumulatePoint(false)
  }

  return (
    <>
      <Modal
        show={modalAccumulatePoint}
        onHide={handleCloseAccumulatePoint}
        centered
        className="m-accumulatepoint-modal"
      >
        <Modal.Body>
          <div className="m-accumulatepoint-modal__title">
            <div className="m-accumulatepoint-modal__title__left">
              <span>Mã giao dịch</span>
            </div>
            <div className="m-accumulatepoint-modal__title__right">
              <span>Số điểm hiện có</span>
              <span>{numeral(authStore?.auth?.point ?? 0).format('#,#')}</span>
            </div>
          </div>

          <div className="m-accumulatepoint-modal__content">
            {authStore?.auth?.phone ? (
              <>
                <div className="m-accumulatepoint-modal__content__text">
                  <span>
                    Quý khách vui lòng đưa mã cho <br />
                    nhân viên thu ngân để tích thêm điểm
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
    </>
  )
}

export default inject(({ store }: { store: RootStore }) => ({
  authStore: store?.authStore,
  globalStore: store.globalStore,
}))(observer(PopupAccumulatePoint))
