import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
// import FooterMobile from '@src/components/common/FooterMobile'
import Modal from 'react-bootstrap/Modal'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import get from 'lodash/get'
import numeral from 'numeral'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PopupShowQRCodeProps {
  codeInfo?: any
  modalQRCode: boolean
  setModalQRCode: any
}

const PopupShowQRCode: FC<PopupShowQRCodeProps> = (props: PopupShowQRCodeProps) => {
  const { modalQRCode, setModalQRCode, codeInfo } = props
  const handleCloseQRCode = () => setModalQRCode(false)
  return (
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
              value={get(codeInfo, 'code', '')}
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
            <QRCode value={get(codeInfo, 'code', '')} bgColor={'transparent'} size={190} />
          </div>
          {codeInfo && codeInfo?.linkPartner && codeInfo?.linkPartner != '' ? (
            <div>
              <a href={get(codeInfo, 'linkPartner', '')} target="_blank" rel="noreferrer">
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
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  loading: store.loading,
}))(observer(PopupShowQRCode))
