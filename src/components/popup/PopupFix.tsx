import React, { FC } from 'react'
import { Modal } from 'react-bootstrap'

interface PopupFixProps {
  url: string
  openPopupFix: boolean
  setOpenPopupFix: any
}

const PopupFix: FC<PopupFixProps> = (props: PopupFixProps) => {
  const { openPopupFix, setOpenPopupFix, url } = props
  return (
    <>
      <Modal
        show={openPopupFix}
        // onHide={() => setOpenPopupFix(false)}
        centered
        className="m-modal-fix"
      >
        <Modal.Body>
          <div className="c-button-close" onClick={() => setOpenPopupFix(false)}>
            <i className="bi bi-x-lg"></i>
          </div>
          <iframe src={url} />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default PopupFix
