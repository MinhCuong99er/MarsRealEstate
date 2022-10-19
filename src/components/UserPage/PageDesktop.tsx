import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import UserPageInfoTop from './UserPageInfoTop'
import UpdatePhoneBox from './UpdatePhoneBox'
import UpdateAddressBox from './UpdateAddressBox'
import { AuthHydration } from '@src/stores/auth.store'

interface PageDesktopProps {
  authStore?: AuthHydration
  loading?: boolean
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const { authStore } = props

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <UserPageInfoTop authStore={authStore} />
          <UpdatePhoneBox authStore={authStore} loading={props.loading} />
          <UpdateAddressBox authStore={authStore} />
          {/* <RankInfoBox /> */}
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
  loading: store?.loading,
}))(observer(PageDesktop))
