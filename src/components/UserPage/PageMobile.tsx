import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import UserPageInfoTop from './UserPageInfoTop'
// import UpdatePhoneBox from './UpdatePhoneBox'
import MenuBoxMobile from './MenuBoxMobile'
// import FooterMobile from '@src/components/common/FooterMobile'
// import UpdateAddressBox from './UpdateAddressBox'
import { AuthHydration } from '@src/stores/auth.store'

interface PageMobileProps {
  authStore?: AuthHydration
  loading?: boolean
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { authStore } = props

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={'Tài khoản'} />
        <div className="m-user-bgtop">
          <div className="container">
            <UserPageInfoTop authStore={authStore} />
          </div>
        </div>
        {/* <UpdatePhoneBox authStore={authStore} loading={props.loading} /> */}
        {/* <UpdateAddressBox authStore={authStore} /> */}
        <MenuBoxMobile />
        {/* <FooterMobile activeMenu={4} /> */}
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
  loading: store?.loading,
}))(observer(PageMobile))
