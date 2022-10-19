import { AuthHydration } from '@src/stores/auth.store'
import React, { FC } from 'react'
import numeral from 'numeral'
// import { TierInfos } from '@src/interfaces/User'

numeral.zeroFormat('0')
numeral.nullFormat('N/A')
interface UserPageInfoTopProps {
  authStore?: AuthHydration
}

const UserPageInfoTop: FC<UserPageInfoTopProps> = (props: UserPageInfoTopProps) => {
  const { authStore } = props
  return (
    <div className="md-userpage-infotop">
      <div className="md-userpage-infotop__box">
        <div className="is-top">
          <b className="is-name">
            {authStore?.auth?.name ?? ''}
            {authStore?.auth?.phone ? ' - ' : ''}
            {authStore?.auth?.phone ?? ''}
          </b>
          {/* <span className="is-rank">
            Xếp hạng: <b>{authStore?.currentTier?.name ?? 'N/A'}</b>
          </span> */}
        </div>
        {/* <div className="is-rankline">
          <div className="is-rankline__line">
            <span style={{ width: `${authStore?.currentTierProcess}%` }}></span>
            <div className="is-item is-none">
              <i className="rank-item"></i>
            </div>
            {(authStore.tierInfos ?? []).map((item: TierInfos, idx: number) => {
              const styleRankLine: Record<string, any> = {}
              if (idx < authStore.tierInfos?.length) {
                styleRankLine.left = `${authStore?.percentTierBetween * idx}%`
              }
              if (idx == authStore.tierInfos?.length - 1) {
                styleRankLine.left = 'auto'
                styleRankLine.right = '0'
              }
              return (
                <div key={item.id} className="is-item" style={styleRankLine}>
                  <b>{item.name}</b>
                  <i className="rank-item"></i>
                </div>
              )
            })}
          </div>
        </div> */}
        {/* <div
          className="is-need"
          dangerouslySetInnerHTML={{
            __html: authStore?.calculateTier?.tierMessage ?? '',
          }}
        ></div> */}
        <div className="is-point">
          <span>Điểm khả dụng</span>
          <b>
            {numeral(authStore?.auth?.point ?? '0').format('0,0')} Vnđ
            {/* <span className="c-pointlogo">L</span> */}
          </b>
        </div>
      </div>
    </div>
  )
}

export default UserPageInfoTop
