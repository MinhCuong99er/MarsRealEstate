import React, { FC, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import { AuthHydration } from '@src/stores/auth.store'
import Config from '@src/contains/Config'
import { flowResult, reaction } from 'mobx'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import { ORDER_ITEM_STATUS } from '@src/interfaces/enums'
import isEqual from 'lodash/isEqual'
import OrderStatusList from './OrderStatusList'

interface PageDesktopProps {
  authStore?: AuthHydration
  loading?: boolean
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const { authStore, loading } = props
  const disposers = []

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // $('.container').css({ background: 'red' })
    }
    // handleShowSuccess()
    listOrderShipsWaitForAdminConfirm()
  }, [])

  const listOrderShipsWaitForAdminConfirm = async () => {
    const data = {
      skip: 0,
      limit: Config.PAGE_SIZE,
    }
    const resListOrderShipsWaitForAdminConfirm = await flowResult<any>(
      authStore.getListOrderShipsWaitForAdminConfirm?.(data)
    )
    if (resListOrderShipsWaitForAdminConfirm?.code == 0) {
      console.log(
        '🚀 ~ file: PageDesktop.tsx ~ line 41 ~ listOrderShipsWaitForAdminConfirm ~ resListOrderShipsWaitForAdminConfirm',
        resListOrderShipsWaitForAdminConfirm
      )
    }
    changeOrderItemsUsed(ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM)
  }

  const handleLoadMore = () => {
    authStore?.loadMoreOrderItems()
  }
  const hasMoreItems = authStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  const changeOrderItemsUsed = (vType: ORDER_ITEM_STATUS) => {
    authStore.setOrderItemType(vType)
  }

  React.useEffect(() => {
    disposers.push(
      reaction(
        () => authStore.isChangeOrderItemType,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            authStore?.filterOrderItem()
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
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <div className="container">
            <div className="m-myvoucher">
              <div className="m-myvoucher__tab is-4">
                <ul className="clearfix">
                  <li
                    className={`${
                      authStore?.orderItemType == ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM ? 'active' : ''
                    }`}
                    onClick={() => changeOrderItemsUsed(ORDER_ITEM_STATUS.WAIT_FOR_ADMIN_CONFIRM)}
                  >
                    <span>Chờ xác nhận</span>
                  </li>
                  <li
                    className={`${authStore?.orderItemType == ORDER_ITEM_STATUS.SHIPPING ? 'active' : ''}`}
                    onClick={() => changeOrderItemsUsed(ORDER_ITEM_STATUS.SHIPPING)}
                  >
                    <span>Đang giao</span>
                  </li>
                  <li
                    className={`${authStore?.orderItemType == ORDER_ITEM_STATUS.COMPLETED ? 'active' : ''}`}
                    onClick={() => changeOrderItemsUsed(ORDER_ITEM_STATUS.COMPLETED)}
                  >
                    <span>Hoàn thành</span>
                  </li>
                  <li
                    className={`${authStore?.orderItemType == ORDER_ITEM_STATUS.CANCELED ? 'active' : ''}`}
                    onClick={() => changeOrderItemsUsed(ORDER_ITEM_STATUS.CANCELED)}
                  >
                    <span>Đã huỷ</span>
                  </li>
                </ul>
              </div>
              <OrderStatusList
                lastElementRef={lastElementRef}
                data={authStore?.activeOrderItemArr}
                loading={loading}
                isMobile={false}
              />
            </div>
          </div>
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
  loading: store.loading,
}))(observer(PageDesktop))
