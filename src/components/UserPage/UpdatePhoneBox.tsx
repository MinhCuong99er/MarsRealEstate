import { RULE_OTP, RULE_PHONE_OTP } from '@src/contains/contants'
import { toastUtil } from '@src/helpers/Toast'
import { AuthHydration } from '@src/stores/auth.store'
import { flowResult } from 'mobx'
import React, { FC, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'

interface UpdatePhoneBoxProps {
  authStore?: AuthHydration
  loading?: boolean
}

const UpdatePhoneBox: FC<UpdatePhoneBoxProps> = (props: UpdatePhoneBoxProps) => {
  const { authStore } = props

  const [modalSuccess, setModalSuccess] = useState<{
    show: boolean
    title: any
    content: any
  }>({
    show: false,
    title: '',
    content: '',
  })
  const [linkTranserObject, setLinkTranferObject] = useState<{
    phone: string
    otp: string
  }>({
    phone: '',
    otp: '',
  })
  const [error, setError] = useState<
    Array<{
      name: string
      isValid?: string
      message?: ''
      disabled: boolean
    }>
  >([
    { name: 'phone', disabled: false },
    { name: 'otp', disabled: true },
  ])
  const [timer, setTimer] = useState<any>(0)
  const errOtp = error.find((i) => i.name == 'otp')
  const errPhone = error.find((i) => i.name == 'phone')

  const handleCloseModalSuccess = () =>
    setModalSuccess({
      show: false,
      title: '',
      content: '',
    })

  const setErr = (type) => {
    if (type == 'phone') {
      setError((origin: any) => {
        return origin.map((i) => {
          if (i.name == 'phone') {
            return {
              ...i,
              isValid: 'false',
              message: RULE_PHONE_OTP.message,
            }
          }
          return i
        })
      })
    } else if (type == 'otp') {
      setError((origin: any) => {
        return origin.map((i) => {
          if (i.name == 'otp') {
            return {
              ...i,
              isValid: 'false',
              message: RULE_OTP.message,
            }
          }
          return i
        })
      })
    }
  }

  const checkError = ({ name, value }) => {
    switch (name) {
      case 'phone':
        if (!value || !RULE_PHONE_OTP.pattern.test(value)) {
          setErr('phone')
        } else {
          setError((origin: any) => {
            return origin.map((i) => {
              if (i.name == 'phone') {
                return {
                  ...i,
                  isValid: 'true',
                  message: '',
                }
              }
              return i
            })
          })
        }
        break
      case 'otp':
        if (!value || !RULE_OTP.pattern.test(value)) {
          setErr('otp')
        } else {
          setError((origin: any) => {
            return origin.map((i) => {
              if (i.name == 'otp') {
                return {
                  ...i,
                  isValid: 'true',
                  message: '',
                  disabled: false,
                }
              }
              return i
            })
          })
        }
        break
      default:
        break
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name
    const value = e.target.value
    checkError({ name, value })
    setLinkTranferObject((origin) => ({
      ...origin,
      [name]: value,
    }))
  }

  const doLinkExchange = async () => {
    if (errPhone.isValid == 'true') {
      const res: any = await flowResult<any>(authStore?.linkExchange(linkTranserObject.phone))
      if (res.errorCode) {
        toastUtil.error(res.message)
        setTimer(60)
        // @ts-ignore
        localStorage.setItem('timer', 60)
      } else {
        setError((origin: any) => {
          return origin.map((i) => {
            if (i.name == 'otp') {
              return {
                ...i,
                disabled: false,
              }
            }
            if (i.name == 'phone') {
              return {
                ...i,
                disabled: true,
              }
            }
            return i
          })
        })
      }
    }
  }

  const doVerifyLinkExchange = async () => {
    const hasErr = error.find((i) => i.isValid != 'true')
    if (!hasErr) {
      const res: any = await flowResult<any>(
        authStore?.verifyLinkExchange(linkTranserObject.phone, linkTranserObject.otp)
      )
      if (res.code == 0) {
        setModalSuccess({
          show: true,
          title: 'THÀNH CÔNG',
          content: 'Thực hiện liên kết số điện thoại thành công',
        })
        setError((origin: any) => {
          return origin.map((i) => {
            if (i.name == 'otp') {
              return {
                ...i,
                disabled: true,
              }
            }
            if (i.name == 'phone') {
              return {
                ...i,
                disabled: false,
              }
            }
            return i
          })
        })
      } else {
        toastUtil.error(res.message)
      }
    }
  }

  const countTimer = () => {
    if (timer <= 0 && timer !== undefined) {
      // @ts-ignore
      localStorage.removeItem('timer')
    } else {
      setTimer(timer - 1)
      // @ts-ignore
      localStorage.setItem('timer', timer - 1)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('timer')) {
      setTimer(localStorage.getItem('timer'))
    } else {
      setTimer(0)
    }
  }, [])

  useEffect(() => {
    if (timer !== undefined && timer !== 0) {
      // @ts-ignore
      setTimeout(() => {
        countTimer()
      }, 1000)
    }
  }, [timer])

  return (
    <div className="md-userpage-phonebox">
      <div className="md-userpage-phonebox__box">
        <div className="is-top">
          {authStore?.isLinkExchangePhone
            ? `Bạn đã liên kết số điện thoại: ${authStore?.auth?.phone ?? ''}`
            : 'Vui lòng cập nhật số điện thoại để sử dụng chức năng tích điểm liên kết'}
        </div>
        <div className="is-des">Lưu ý: Chỉ được liên kết 1 lần duy nhất</div>
        {!authStore?.isLinkExchangePhone ? (
          <div className="is-row">
            <div className="form-group">
              <input
                name="phone"
                placeholder="Số điện thoại"
                value={linkTranserObject.phone}
                onChange={onChange}
                // disabled={errPhone.disabled}
                className={`form-control ${
                  error.find((i) => i.name == 'phone')?.isValid === 'false'
                    ? 'is-invalid'
                    : error.find((i) => i.name == 'phone')?.isValid === 'true'
                    ? 'is-valid'
                    : ''
                }`}
                aria-describedby="validationPhoneFeedback"
              />
              <div id="validationPhoneFeedback" className="invalid-feedback">
                {error.find((i) => i.name == 'phone')?.message}
              </div>
              {errPhone.isValid == 'true' && !errPhone.disabled && !timer && (
                <button className="btn" onClick={doLinkExchange}>
                  {props.loading && (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      &nbsp;
                    </>
                  )}
                  Gửi
                </button>
              )}
            </div>
            <div className="form-group">
              <input
                name="otp"
                placeholder="OTP"
                value={linkTranserObject.otp}
                onChange={onChange}
                disabled={errOtp.disabled}
                className={`form-control ${
                  error.find((i) => i.name == 'otp')?.isValid === 'false'
                    ? 'is-invalid'
                    : error.find((i) => i.name == 'otp')?.isValid === 'true'
                    ? 'is-valid'
                    : ''
                }`}
                aria-describedby="validationOtpFeedback"
              />
              <div id="validationOtpFeedback" className="invalid-feedback">
                {error.find((i) => i.name == 'otp')?.message}
              </div>
              {errPhone.isValid == 'true' && errOtp.isValid == 'true' && (
                <button className="btn" onClick={doVerifyLinkExchange}>
                  {props.loading && (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      &nbsp;
                    </>
                  )}
                  Gửi
                </button>
              )}
            </div>
            {timer ? <div style={{ color: 'red' }}>Bạn hãy chờ {timer}s để tiếp tục lấy otp</div> : null}
          </div>
        ) : null}
      </div>
      <Modal show={modalSuccess.show} onHide={handleCloseModalSuccess} centered className="m-modal-charity is-error">
        <Modal.Body>
          <div className="m-modal-charity__input">
            <div className="m-modalbody">
              {modalSuccess.title}
              <br />
              <div
                dangerouslySetInnerHTML={{
                  __html: `${modalSuccess.content}`,
                }}
              />
            </div>
          </div>
          <div className="m-modal-charity__btn">
            <button onClick={handleCloseModalSuccess} style={{ background: '#818285' }}>
              Đóng
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default UpdatePhoneBox
