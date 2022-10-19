import React, { FC, useEffect } from 'react'
// import HeaderMobile from '@src/components/common/HeaderMoblie'
import FooterMobile from '@src/components/common/FooterMobile'
import { observer, inject } from 'mobx-react'
import { AuthHydration } from '@src/stores/auth.store'
// import Config from '@src/contains/Config'
import { reaction } from 'mobx'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import { NOTIFICATION_TYPE } from '@src/interfaces/enums'
import isEqual from 'lodash/isEqual'
import NotificationList from './NotificationList'
// import { toastUtil } from '@src/helpers/Toast'
// import { useRouter } from 'next/router'

interface PageMobileProps {
  authStore?: AuthHydration
  loading?: boolean
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { authStore, loading } = props
  const disposers = []
  // const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // $('.container').css({ background: 'red' })
    }
    // handleShowSuccess()
    // getListNotificationAll()
  }, [])

  // const getListNotificationAll = async () => {
  //   const data = {
  //     skip: 0,
  //     limit: Config.PAGE_SIZE,
  //   }
  //   const getListNotificationAll = await flowResult<any>(authStore.getListNotificationAll?.(data))
  //   if (getListNotificationAll?.code == 0) {
  //     console.log(
  //       '🚀 ~ file: PageDesktop.tsx ~ line 41 ~ getListNotificationAll ~ getListNotificationAll',
  //       getListNotificationAll
  //     )
  //   } else {
  //     toastUtil.error(getListNotificationAll?.message)
  //     router.back()
  //   }
  //   changeNotifictionType(NOTIFICATION_TYPE.ALL)
  // }

  const handleLoadMore = () => {
    authStore?.loadMoreNotification()
  }
  const hasMoreItems = authStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  const changeNotifictionType = (vType: NOTIFICATION_TYPE) => {
    authStore.setNotificationType(vType)
  }

  React.useEffect(() => {
    disposers.push(
      reaction(
        () => authStore.isChangeNotificationType,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            authStore?.filterNotification()
          }
        }
      )
    )
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])

  return (
    <React.Fragment>
      <div className="m-body">
        {/* <HeaderMobile title={'THÔNG BÁO'} /> */}
        <div className="m-myvoucher">
          <div className="m-myvoucher__tab is-large">
            <ul className="clearfix">
              <li
                className={`${authStore?.notificationType == NOTIFICATION_TYPE.ALL ? 'active' : ''}`}
                onClick={() => changeNotifictionType(NOTIFICATION_TYPE.ALL)}
              >
                <span>Hệ thống</span>
              </li>
              <li
                className={`${authStore?.notificationType == NOTIFICATION_TYPE.PERSONAL ? 'active' : ''}`}
                onClick={() => changeNotifictionType(NOTIFICATION_TYPE.PERSONAL)}
              >
                <span>Khuyến mãi</span>
              </li>
            </ul>
          </div>
          <NotificationList
            lastElementRef={lastElementRef}
            data={authStore?.activeNotificationArr}
            loading={loading}
            isMobile={true}
          />
        </div>
        <FooterMobile activeMenu={3} />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
  loading: store.loading,
}))(observer(PageMobile))
