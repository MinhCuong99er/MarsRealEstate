import React, { FC, useEffect, useState } from 'react'
import QrScanner from 'qr-scanner'
import Modal from 'react-bootstrap/Modal'

QrScanner.WORKER_PATH = '/static/lib/qr-scanner-worker.min.js'

interface QrCodeProps {
  isStartScan?: boolean
  hasCamera?: boolean
  setQrCodeScan?: React.Dispatch<React.SetStateAction<any>>
}

const QrCode: FC<QrCodeProps> = (props: QrCodeProps) => {
  const { isStartScan, hasCamera, setQrCodeScan } = props
  const [scannerState, setScannerState] = useState<any>({
    error: undefined,
    result: undefined,
  })
  // const [listCamera, setListCamera] = useState([]);
  let scanner

  const disposeQrScan = () => {
    scanner?.stop()
    scanner?.destroy()
    scanner = null
  }

  useEffect(() => {
    if (isStartScan) {
      if (hasCamera) {
        const video = document.getElementById('cam-qr-result') as HTMLVideoElement
        scanner = new QrScanner(
          video,
          (resultScan) => {
            console.log(`🚀 ~ file: QrCode.tsx ~ line 31 ~ useEffect ~ resultScan`, resultScan)
            setScannerState((prevState) => ({
              ...prevState,
              result: resultScan,
            }))
          },
          (err) => {
            console.log(`🚀 ~ file: QrCode.tsx ~ line 35 ~ useEffect ~ err`, err)
            setScannerState((prevState) => ({ ...prevState, error: err }))
          }
        )
        scanner.start().then(() => {
          // updateFlashAvailability();
          QrScanner.listCameras(true).then((cameras) =>
            cameras.forEach((camera) => {
              console.log(`🚀 ~ file: QrCode.tsx ~ line 46 ~ QrScanner.listCameras ~ camera`, camera)
              /* const option = document.createElement('option');
            option.value = camera.id;
            option.text = camera.label;
            camList.add(option); */
            })
          )
        })
      } else {
        setScannerState((prevState) => ({
          ...prevState,
          result: 'no camera',
        }))
      }
    }
    return () => {
      disposeQrScan()
    }
  }, [isStartScan, hasCamera])

  return (
    <Modal
      show={isStartScan}
      onHide={() => {
        setQrCodeScan((prevState) => ({ ...prevState, isStart: false }))
        disposeQrScan()
      }}
      centered
      className="c-payment-modal c-payment-modal-qrcode"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="qrcode-wrapper" style={{ display: isStartScan ? 'flex' : 'none' }}>
          <video id="cam-qr-result"></video>
        </div>
        <div className="mt-2">
          {scannerState.result ? scannerState.result : <></>}
          {scannerState.error ? scannerState.error : <></>}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default QrCode
