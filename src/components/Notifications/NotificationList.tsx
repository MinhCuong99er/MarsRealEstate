import React, { FC, useState } from 'react'
import get from 'lodash/get'
import PageLoading from '@src/helpers/PageLoading'
import moment from 'dayjs'
import { Modal } from 'react-bootstrap'
import { flowResult, toJS } from 'mobx'
import { AuthHydration } from '@src/stores/auth.store'
import { observer, inject } from 'mobx-react'
import { useRouter } from 'next/router'

interface OrderStatusListProps {
  loading?: boolean
  data: Array<any>
  lastElementRef: (node: any) => void
  isMobile: boolean
  authStore?: AuthHydration
}

const OrderStatusItem = ({
  item,
  router,
  notificationType,
  updateIsRead,
  setShowDataOrder,
  setModalShowOrder,
}: {
  item: any
  router: any
  notificationType: string
  updateIsRead: (order: any) => void
  setShowDataOrder: (order: any) => void
  setModalShowOrder: (visibile: boolean) => void
}) => (
  <div
    className="md-voucher-onelist__item"
    onClick={() => {
      if (!item.isRead) updateIsRead(item?.id)
      if (item?.action === 'product' || item?.action === 'voucher') {
        router.push(item?.action === 'product' ? `/doi-qua/san-pham/${item?.data}` : `/doi-qua/${item?.data}`)
      } else {
        setModalShowOrder(true)
        setShowDataOrder(item)
      }
    }}
  >
    <div className="is-left is-full">
      {notificationType == '2' ? (
        <div className="is-imgbox">
          <div className="is-img">
            <img src={get(item, 'image', {}) || ''} />
          </div>
        </div>
      ) : null}
      <div className="is-des is-statusbox">
        <b className="c-title-hid is-secondary">{get(item, 'title', {}) || ''}</b>
        <span>{get(item, 'body', {}) || ''}</span>
        <span>Thời gian: {moment(get(item, 'createdAt', '')).format('HH:mm DD-MM-YYYY')}</span>
      </div>
      {item?.isRead ? <span className="is-check">Đã xem</span> : null}
    </div>
  </div>
)

const NotificationList: FC<OrderStatusListProps> = (props: OrderStatusListProps) => {
  const { data, loading, lastElementRef, isMobile, authStore } = props
  const router = useRouter()
  const [showDataOrder, setShowDataOrder] = useState<any>({})
  const [modalShowOrder, setModalShowOrder] = useState(false)
  const handleCloseShowOrder = () => setModalShowOrder(false)

  const updateIsRead = async (id) => {
    const resUpdateIsRead = await flowResult<any>(authStore.updateIsRead?.(id))
    console.log('🚀 ~ file: HeaderHomeDesktop.tsx ~ line 51 ~ updateIsRead ~ resUpdateIsRead', toJS(resUpdateIsRead))
  }

  return (
    <>
      {data?.length <= 0 && !loading ? (
        <div className="md-ordernone">
          <div className="is-img">
            {isMobile ? <img src="/images/order-none.png" /> : <img src="/images/order-none.png" />}
            <span>Chưa có thông báo</span>
          </div>
        </div>
      ) : !loading ? (
        <div className="md-voucher-onelist">
          <ul className="clearfix">
            {(data || []).map((item, idx) => {
              return (
                <li key={idx} ref={data.length == idx + 1 ? lastElementRef : null}>
                  <OrderStatusItem
                    item={item}
                    router={router}
                    notificationType={authStore?.notificationType}
                    updateIsRead={updateIsRead}
                    setModalShowOrder={setModalShowOrder}
                    setShowDataOrder={setShowDataOrder}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
      {loading ? <PageLoading style={{ height: '150px' }} /> : null}
      <Modal show={modalShowOrder} onHide={handleCloseShowOrder} centered className="m-orderstatus-modal is-maxwidth">
        <Modal.Header closeButton>
          <Modal.Title>
            <b className="m-orderstatus-modal__title">Thông báo</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="statusbox">
            <b>{get(showDataOrder, 'title', '') || ''}</b>
            <span>{get(showDataOrder, 'data', '') || ''}</span>
            <span>{get(showDataOrder, 'body', '') || ''}</span>
            <span>Thời gian: {moment(get(showDataOrder, 'createdAt', '')).format('HH:mm DD-MM-YYYY')}</span>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
}))(observer(NotificationList))
