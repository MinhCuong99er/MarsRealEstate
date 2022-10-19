import React, { FC, useEffect, useState } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import Modal from 'react-bootstrap/Modal'
import { RootStoreHydration } from '@src/stores/RootStore'
import numeral from 'numeral'
import { AuthHydration } from '@src/stores/auth.store'
import { ITranferObject } from '@src/interfaces/dto/user.dto'
import { flowResult, reaction } from 'mobx'
import isEqual from 'lodash/isEqual'
import { RULE_PHONE, RULE_POINT } from '@src/contains/contants'
import { NextRouter, useRouter } from 'next/router'
import Breadcrumb from '@src/components/common/Breadcrumb'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')
interface PageDesktopProps {
  authStore?: AuthHydration
  loading?: boolean
  store?: RootStoreHydration
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const disposers = []
  const { authStore, loading, store } = props
  const router: NextRouter = useRouter()
  const [transferObject, setTranferObject] = useState<ITranferObject>({
    phone: '',
    point: null,
    description: '',
  })
  const [error, setError] = useState<
    Array<{
      name: string
      isValid?: string
      message?: ''
    }>
  >([{ name: 'phone' }, { name: 'point' }])
  const [modalSuccess, setModalSuccess] = useState<{
    show: boolean
    title: any
    content: any
  }>({
    show: false,
    title: '',
    content: '',
  })
  const [modalError, setModalError] = useState(false)
  const [modalQA, setModalQA] = useState(false)
  const handleCloseModalSuccess = () =>
    setModalSuccess({
      show: false,
      title: '',
      content: '',
    })
  const handleCloseModalError = () => setModalError(false)
  const handleCloseModalQA = () => setModalQA(false)

  const setErr = (type) => {
    if (type == 'phone') {
      setError((origin: any) => {
        return origin.map((i) => {
          if (i.name == 'phone') {
            return {
              ...i,
              isValid: 'false',
              message: RULE_PHONE.message,
            }
          }
          return i
        })
      })
    } else if (type == 'point') {
      setError((origin: any) => {
        return origin.map((i) => {
          if (i.name == 'point') {
            return {
              ...i,
              isValid: 'false',
              message: RULE_POINT.message,
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
        if (!value || !RULE_PHONE.pattern.test(value)) {
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
      case 'point':
        if (!value || !RULE_POINT.pattern.test(value) || value > authStore?.auth?.point) {
          setErr('point')
        } else {
          setError((origin: any) => {
            return origin.map((i) => {
              if (i.name == 'point') {
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
      default:
        break
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name
    const value = e.target.value
    checkError({ name, value })
    setTranferObject((origin) => ({
      ...origin,
      [name]: value,
    }))
    if (name == 'phone') {
      store?.setLoader(true)
      authStore.setTransferObject({
        receiver: null,
      })
    }
  }

  const beginTranferPoint = () => {
    if (!authStore.transferObject.point) {
      setErr('point')
    } else {
      const hasErr = error.find((i) => i.isValid == 'false')
      if (!hasErr) {
        setModalQA(true)
      } else {
        setErr(hasErr.name)
      }
    }
  }

  const confirmTranferPoint = async () => {
    setModalQA(false)
    const hasErr = error.find((i) => i.isValid == 'false')
    if (!hasErr) {
      const res = await flowResult<any>(
        authStore.transferPoint({
          receiveId: authStore.transferObject.receiveId,
          point: authStore.transferObject.point,
          description: authStore.transferObject.description,
        })
      )
      if (res.errorCode) {
        setModalSuccess({
          show: true,
          title: 'THẤT BẠI',
          content: res.message,
        })
      } else {
        setTranferObject((origin) => ({
          ...origin,
          phone: '',
          point: 0,
          description: '',
        }))
        setError((origin: any) => {
          return origin.map((i) => {
            if (i.name == 'point') {
              return {
                name: 'point',
              }
            }
            return i
          })
        })
        setModalSuccess({
          show: true,
          title: 'THÀNH CÔNG',
          content: res.message,
        })
      }
    }
  }

  const cancelTranferPoint = () => {
    router.back()
  }

  useEffect(() => {
    const hasTrue = error.find((i) => i.isValid == 'true')
    if (hasTrue) {
      authStore.setTransferObject(transferObject)
    }
  }, [transferObject, error])

  useEffect(() => {
    disposers.push(
      reaction(
        () => authStore.isChangeTransferObject,
        async (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue) && value.phone != prevValue.phone && RULE_PHONE.pattern.test(value.phone)) {
            const res = await flowResult<any>(authStore.checkCustomer(value.phone))
            if (res.errorCode) {
              setModalError(true)
              setError((origin: any) => {
                return origin.map((i) => {
                  if (i.name == 'phone') {
                    return {
                      ...i,
                      isValid: 'false',
                      message: res.message,
                    }
                  }
                  return i
                })
              })
            } else {
              setError((origin: any) => {
                return origin.map((i) => {
                  if (i.name == 'phone') {
                    return {
                      name: 'phone',
                    }
                  }
                  return i
                })
              })
            }
          }
        },
        {
          name: 'check_customer_destop',
          delay: 1000 * 60,
          scheduler: (run) => {
            setTimeout(run, 4000)
          },
        }
      )
    )
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <Breadcrumb nameLink={`Tặng điểm cho bạn`} link={'/tang-diem-cho-ban'} />
          <div className="md-givepoint">
            <div className="container">
              <div className="md-givepoint__box">
                <div className="md-givepoint__title">Tặng điểm cho bạn</div>
                <div className="md-givepoint__point">
                  <span className="is-left">Bạn đang có</span>
                  <span className="is-right">
                    <b>{numeral(authStore?.auth?.point ?? 0).format('#,#')}</b> điểm
                  </span>
                </div>
                <div className="md-givepoint__form">
                  <span className="is-title">Chuyển đến</span>
                  <div className="form-group is-text">
                    {authStore.transferObject?.receiver?.name != '' &&
                      authStore.transferObject?.receiver?.name != null &&
                      authStore.transferObject?.receiver?.name != undefined && (
                        <span className="is-name">{authStore.transferObject?.receiver?.name ?? ''}</span>
                      )}
                    <input
                      name="phone"
                      value={transferObject.phone}
                      placeholder="Nhập mã khách hàng"
                      onChange={onChange}
                      className={`form-control ${
                        error.find((i) => i.name == 'phone')?.isValid === 'false'
                          ? 'is-invalid'
                          : error.find((i) => i.name == 'phone')?.isValid === 'true'
                          ? 'is-valid'
                          : ''
                      }`}
                      type="text"
                      aria-describedby="validationPhoneFeedback"
                    />
                    {loading && (
                      <div className="spinner-wrapper">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      </div>
                    )}
                    <div id="validationPhoneFeedback" className="invalid-feedback">
                      {error.find((i) => i.name == 'phone')?.message}
                    </div>
                  </div>
                  <div className="form-group is-text">
                    <input
                      name="point"
                      value={transferObject.point}
                      placeholder="Nhập số điểm"
                      onChange={onChange}
                      className={`form-control ${
                        error.find((i) => i.name == 'point')?.isValid === 'false'
                          ? 'is-invalid'
                          : error.find((i) => i.name == 'point')?.isValid === 'true'
                          ? 'is-valid'
                          : ''
                      }`}
                      aria-describedby="validationPointFeedback"
                    />
                    <div id="validationPointFeedback" className="invalid-feedback">
                      {error.find((i) => i.name == 'point')?.message}
                    </div>
                  </div>
                  <div className="form-group is-area">
                    <textarea
                      value={transferObject.description}
                      name="description"
                      className="form-control"
                      placeholder="Nội dung thông điệp"
                      onChange={onChange}
                    ></textarea>
                  </div>
                </div>
                <div className="md-givepoint__btn">
                  <button
                    className="btn btn-secondary"
                    onClick={beginTranferPoint}
                    style={{
                      cursor: error.find((i) => i.isValid == 'false') ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Tặng điểm
                  </button>
                  <button className="btn btn-primary" onClick={cancelTranferPoint}>
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterDesktop />
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
        <Modal show={modalError} onHide={handleCloseModalError} centered className="m-modal-charity is-error">
          <Modal.Body>
            <div className="m-modal-charity__input">
              <div className="m-modalbody">
                Không tìm thấy tài khoản này.
                <br />
                Quý khách vui lòng nhập lại
              </div>
            </div>
            <div className="m-modal-charity__btn">
              <button onClick={handleCloseModalError} style={{ background: '#818285' }}>
                Đóng
              </button>
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={modalQA} onHide={handleCloseModalQA} centered className="m-modal-charity is-qa">
          <Modal.Body>
            <div className="m-modal-charity__input">
              <div className="m-modalbody">
                Bạn có chắc tặng {numeral(authStore.transferObject.point).format('#,#')} điểm?
              </div>
            </div>
            <div className="m-modal-charity__btn">
              {/* <button style={{ background: '#ee0033' }} onClick={confirmTranferPoint}> */}
              <button style={{ background: '#141ed2' }} onClick={confirmTranferPoint}>
                Xác nhận
              </button>
              <button onClick={handleCloseModalQA} style={{ background: '#818285' }}>
                Huỷ
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }: { store: RootStoreHydration }) => ({
  authStore: store.authStore,
  loading: store.loading,
  store,
}))(observer(PageDesktop))
