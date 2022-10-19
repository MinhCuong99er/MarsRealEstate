import { AuthHydration } from '@src/stores/auth.store'
import { inject, observer } from 'mobx-react'
import React, { FC, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { TierInfos } from '@src/interfaces/User'
interface RankInfoBoxProps {
  authStore?: AuthHydration
}

const RankInfoBox: FC<RankInfoBoxProps> = (props: RankInfoBoxProps) => {
  const { authStore } = props
  const [tabActive, setTabActive] = useState(0)
  return (
    <div className="md-rankinfo">
      <div className="md-rankinfo__box">
        <b className="is-title">{`Điều kiện nâng hạng & quyền lợi`}</b>
        <div className="is-tab">
          <ul className="clearfix">
            {authStore?.tierInfos?.map((item: TierInfos, idx: number) => (
              <li
                key={`rank-${item.id}`}
                className={`${tabActive == idx && !isMobile ? 'active' : ''}`}
                onClick={() => setTabActive(idx)}
                style={{
                  width: `${100 / authStore?.tierInfos.length}%`,
                }}
              >
                <span className={`${tabActive == idx && isMobile ? 'active' : ''}`}>{item.name}</span>
              </li>
            ))}
            {/* <li
              className={`${tabActive == 0 ? 'active' : ''}`}
              onClick={() => setTabActive(0)}
            >
              <span>Silver</span>
            </li>
            <li
              className={`${tabActive == 1 ? 'active' : ''}`}
              onClick={() => setTabActive(1)}
            >
              <span>Gold</span>
            </li>
            <li
              className={`${tabActive == 2 ? 'active' : ''}`}
              onClick={() => setTabActive(2)}
            >
              <span>Diamond</span>
            </li> */}
          </ul>
          {authStore?.tierInfos?.[tabActive] && (
            <div className="is-tabcontent">
              <span className="is-title">{authStore?.tierInfos?.[tabActive]?.name}</span>
              <div
                className="is-content"
                dangerouslySetInnerHTML={{
                  __html: `${authStore?.tierInfos?.[tabActive].description ?? ''}`,
                }}
              />
              {/* <div className="is-content">
                <b>Điều kiện:</b>
                <span>
                  Khách hàng tích đủ 50.000 điểm khi sử dụng voucher ưu đãi
                  trong chương trình Loyalty của VNDirect.
                </span>
              </div>
              <div className="is-content">
                <b>Quyền lợi:</b>
                <span>
                  Nhận được các ưu đãi độc quyền Cho khách hàng với nhiều ưu đãi
                  hấp dẫn của nhiều thương hiệu nổi tiếng.{' '}
                </span>
              </div> */}
            </div>
          )}
          {/* {tabActive == 0 ? (
            <div className="is-tabcontent">
              <span className="is-title">Hạng Bạc</span>
              <div className="is-content">
                <b>Điều kiện:</b>
                <span>
                  Khách hàng tích đủ 50.000 điểm khi sử dụng voucher ưu đãi
                  trong chương trình Loyalty của VNDirect.
                </span>
              </div>
              <div className="is-content">
                <b>Quyền lợi:</b>
                <span>
                  Nhận được các ưu đãi độc quyền Cho khách hàng với nhiều ưu đãi
                  hấp dẫn của nhiều thương hiệu nổi tiếng.{' '}
                </span>
              </div>
            </div>
          ) : null}
          {tabActive == 1 ? (
            <div className="is-tabcontent">
              <span className="is-title">Hạng Vàng</span>
              <div className="is-content">
                <b>Điều kiện:</b>
                <span>
                  Khách hàng tích đủ 500.000 điểm khi sử dụng voucher ưu đãi
                  trong chương trình Loyalty của VNDirect.
                </span>
              </div>
              <div className="is-content">
                <b>Quyền lợi:</b>
                <span>
                  Nhận được các ưu đãi độc quyền Cho khách hàng với nhiều ưu đãi
                  hấp dẫn của nhiều thương hiệu nổi tiếng.{' '}
                </span>
              </div>
            </div>
          ) : null}
          {tabActive == 2 ? (
            <div className="is-tabcontent">
              <span className="is-title">Hạng Kim cương</span>
              <div className="is-content">
                <b>Điều kiện:</b>
                <span>
                  Khách hàng tích đủ 2.000.000 điểm khi sử dụng voucher ưu đãi
                  trong chương trình Loyalty của VNDirect.
                </span>
              </div>
              <div className="is-content">
                <b>Quyền lợi:</b>
                <span>
                  Nhận được các ưu đãi độc quyền Cho khách hàng với nhiều ưu đãi
                  hấp dẫn của nhiều thương hiệu nổi tiếng.{' '}
                </span>
              </div>
            </div>
          ) : null} */}
        </div>
      </div>
    </div>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
}))(observer(RankInfoBox))
