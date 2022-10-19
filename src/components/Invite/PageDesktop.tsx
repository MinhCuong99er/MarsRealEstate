import React, { CSSProperties, FC /* useRef, useState*/ } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import AuthStore from '@src/stores/auth.store'
import get from 'lodash/get'
import { toastUtil } from '@src/helpers/Toast'
import { QRCode } from 'react-qrcode-logo'
import RootStore from '@src/stores/RootStore'
import GlobalStore from '@src/stores/global.store'
import helper from '@src/helpers/helper'
// import { STATE } from '@src/interfaces/enums'
// import { flowResult } from 'mobx'
interface PageDesktopProps {
  authStore?: AuthStore
  globalStore?: GlobalStore
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const { authStore /* globalStore*/ } = props
  // const refCode = useRef<HTMLInputElement>()
  // const [invitePartnerCode, setInvitePartnerCode] = useState<string>('')
  const customerId = get(authStore?.auth, 'vndCustId', '')
  const inviteLink = get(authStore?.auth, 'inviteLink', '')
  const inviteCode = get(authStore?.auth, 'inviteCode', '')
  // const [btnDisable, setBtnDisable] = useState(true)

  // const doInvite = async () => {
  //   if (btnDisable) {
  //     setBtnDisable(false)
  //     if (invitePartnerCode == '') {
  //       if (refCode && refCode.current) refCode.current.focus()
  //       toastUtil.error('Bạn cần nhập mã giới thiệu')
  //     } else {
  //       const rsInvite = await flowResult(
  //         globalStore.putInvite(invitePartnerCode)
  //       )
  //       if ((rsInvite as { errorCode: number; message: string }).errorCode) {
  //         toastUtil.error(rsInvite.message)
  //         setBtnDisable(true)
  //       } else {
  //         toastUtil.success(rsInvite.message)
  //       }
  //     }
  //   }
  // }

  const styleWhenHasInvite: CSSProperties = {}
  if (inviteCode && inviteCode != '') {
    styleWhenHasInvite.width = '100%'
  }

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <div className="container">
            <div className="md-invite">
              <div className="md-invite__title">Happy Client</div>
              <div className="box-myinvide">
                <div className="box-myinvide__qrcode">
                  <div>Quét mã QrCode</div>
                  <div>
                    <QRCode
                      value={inviteLink ?? ''}
                      bgColor={'transparent'}
                      size={150}
                      logoImage={`/logo-qrcode.png`}
                      logoWidth={150 * 0.2}
                      quietZone={3}
                      eyeRadius={2}
                    />
                  </div>
                </div>
                <div className="box-myinvide__code md-invite__item">
                  <div className="is-title">Mã giới thiệu của tôi</div>
                  <div className="is-box">
                    <div className="is-content">
                      <span>Mã giới thiệu của tôi</span>
                      <b className="is-id">{customerId}</b>
                    </div>
                    <div
                      onClick={() => {
                        if (navigator) {
                          helper.testClipboard(customerId)
                          toastUtil.success('Copy mã giới thiệu thành công!')
                        } else {
                          toastUtil.error('Copy không thành công!')
                        }
                      }}
                      className="is-copy"
                    >
                      Sao chép
                    </div>
                  </div>
                </div>
              </div>
              <div className="md-invite__item" style={{ marginTop: '25px' }}>
                <div className="is-box">
                  <div className="is-content">
                    <span>Link giới thiệu của tôi</span>
                    <b>{inviteLink}</b>
                  </div>
                  <div
                    onClick={() => {
                      if (navigator) {
                        helper.testClipboard(inviteLink)
                        toastUtil.success('Copy link giới thiệu thành công!')
                      } else {
                        toastUtil.error('Copy không thành công!')
                      }
                    }}
                    className="is-copy"
                  >
                    Sao chép
                  </div>
                </div>
              </div>
              {/* <div className="md-invite__item">
                <div className="is-title">Mã người giới thiệu</div>
                <div className="is-box">
                  {inviteCode && inviteCode != '' ? (
                    <div
                      className="is-content"
                      style={{
                        ...styleWhenHasInvite,
                      }}
                    >
                      <span>Mã người giới thiệu</span>
                      <b className="is-id">{inviteCode}</b>
                    </div>
                  ) : (
                    <div className="is-invitecode form-group">
                      <input
                        ref={refCode}
                        className="form-control"
                        placeholder="Nhập mã người giới thiệu"
                        value={invitePartnerCode}
                        onChange={(e: any) => {
                          setInvitePartnerCode(e.target.value)
                        }}
                      />
                      {globalStore.stateInvite == STATE.PROCESSING && (
                        <div className="spinner-wrapper">
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </div>
                      )}
                    </div>
                  )}
                  {(!inviteCode || inviteCode == '') && (
                    <div
                      onClick={() => {
                        doInvite()
                      }}
                      className="is-copy"
                    >
                      Thực hiện
                    </div>
                  )}
                </div>
              </div> */}
              <div className="md-invite__item">
                <div className="is-guide">
                  Cảm ơn Bạn đã tin tưởng và đồng hành cùng Mpoint.
                  <br />
                  <br />
                  Nếu Bạn hài lòng với trải nghiệm tại Mpoint, hãy giới thiệu với người thân, bạn bè của mình để cùng
                  tận hưởng những dịch vụ tuyệt vời cùng Mpoint.
                </div>
              </div>
              {/* <div className="md-invite__item">
                <div className="is-box">
                  <div className="is-content">
                    <span>Mã giới thiệu của tôi</span>
                    <b className="is-id">{customerId}</b>
                  </div>
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(customerId)
                      toastUtil.success('Copy mã giới thiệu thành công!')
                    }}
                    className="is-copy"
                  >
                    Sao chép
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }: { store: RootStore }) => ({
  authStore: store?.authStore,
  globalStore: store?.globalStore,
}))(observer(PageDesktop))
