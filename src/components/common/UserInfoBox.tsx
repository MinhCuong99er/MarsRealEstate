import { AuthHydration } from '@src/stores/auth.store'
import React, { FC, useState } from 'react'
import numeral from 'numeral'
import PopupAccumulatePoint from './PopupAccumulatePoint'
import { useRouter } from 'next/router'
import { flowResult } from 'mobx'
import { inject, observer } from 'mobx-react'
import RootStore from '@src/stores/RootStore'
import GlobalStore from '@src/stores/global.store'
import { toastUtil } from '@src/helpers/Toast'
// import { TierInfos } from '@src/interfaces/User'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface UserInfoBoxProps {
  authStore?: AuthHydration
  globalStore?: GlobalStore
}

const UserInfoBox: FC<UserInfoBoxProps> = (props: UserInfoBoxProps) => {
  const { authStore, globalStore } = props
  const userInfo = authStore?.auth
  // console.log(`🚀 ~ file: UserInfoBox.tsx ~ line 17 ~ authStore`, toJS(authStore))
  const router = useRouter()
  const [modalAccumulatePoint, setModalAccumulatePoint] = React.useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const doAccumulatePoint = async () => {
    const rs = await flowResult<any>(globalStore.getTransactionCode())
    if (!rs.errorCode) {
      setModalAccumulatePoint(true)
      setTimeLeft(rs.data.ttl)
    } else {
      toastUtil.error(rs.message)
    }
  }

  return (
    <>
      <div className="c-user-info-box-container">
        <div className="c-user-info-detail">
          <span className="c-user-info-detail__name">
            <span>Mã hội viên: </span>
            <span className="c-id">{userInfo?.phone}</span>
          </span>
          {/* &nbsp; | &nbsp; */}
          {/* <span className="c-user-info-detail__point">
            <span>
              <img src="/images/mpoint-logo.png" alt="mpoint" height={15} width={15} />
            </span>
            <span className="c-pointlogo" style={{ width: 16, height: 16 }}>
              L
            </span>
            <span>Vnđ</span>
            &nbsp;
            <span>{numeral(userInfo?.point).format('0,0')}</span>
          </span> */}
        </div>
        <div className="c-user-info-icon">
          <ul className="clearfix">
            {/* <li onClick={() => doAccumulatePoint()}>
              <i className="bi bi-qr-code"></i>
              <span>Mã giao dịch</span>
            </li> */}
            <li onClick={() => router.push('/lich-su-giao-dich')}>
              <i className="bi bi bi-gift"></i>
              <span>Lịch sử giao dịch</span>
            </li>
            {/* <li onClick={() => router.push('/tai-khoan')}>
              <i className="bi bi-person" style={{ fontSize: 28 }}></i>
              <span>Thông tin hội viên</span>
            </li> */}
          </ul>
          {/* <span
            className="c-user-info-icon__qr"
            onClick={() => {
              setModalAccumulatePoint(true)
            }}
          >
            <i className="bi bi-qr-code"></i>
            <p>Mã giao dịch</p>
          </span>
          <span className="c-user-info-icon__gift">
            <i className="bi bi-gift"></i>
            <p>Lịch sử giao dịch</p>
          </span>
          <span className="c-user-info-icon__user">
            <i className="bi bi-person"></i>
            <p>Thông tin hội viên</p>
          </span> */}
        </div>
      </div>
      <PopupAccumulatePoint
        modalAccumulatePoint={modalAccumulatePoint}
        setModalAccumulatePoint={setModalAccumulatePoint}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
      />
    </>
  )
}

export default inject(({ store }: { store: RootStore }) => ({
  authStore: store?.authStore,
  globalStore: store.globalStore,
}))(observer(UserInfoBox))
