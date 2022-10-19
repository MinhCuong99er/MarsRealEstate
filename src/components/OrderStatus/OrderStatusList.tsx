import React, { FC, useState } from 'react'
import numeral from 'numeral'
import get from 'lodash/get'
import { OrderShipItem } from '@src/interfaces/Product'
import PageLoading from '@src/helpers/PageLoading'
import moment from 'dayjs'
import { Modal } from 'react-bootstrap'

interface OrderStatusListProps {
  loading?: boolean
  data: Array<OrderShipItem>
  lastElementRef: (node: any) => void
  isMobile: boolean
}

const OrderStatusItem = ({
  item,
  orderItemInfos,
  setShowDataOrder,
  setModalShowOrder,
}: {
  item: OrderShipItem
  orderItemInfos
  setShowDataOrder: (order: any) => void
  setModalShowOrder: (visibile: boolean) => void
}) => (
  <div
    className="md-voucher-onelist__item"
    onClick={() => {
      setModalShowOrder(true)
      setShowDataOrder(item)
    }}
  >
    <div className="is-left is-statusbox">
      <div className="is-imgbox">
        <div className="is-img">
          <img src={get(orderItemInfos, 'images[0]', '') || '/images/product.jpg'} />
        </div>
      </div>
      <div className="is-des is-statusbox">
        <b className="c-title-hid">{get(orderItemInfos, 'name', {}) || ''}</b>
        <span>
          {get(orderItemInfos, 'attribute', {}) || ''}: {get(orderItemInfos, 'attributeValue', {}) || ''}
        </span>
        <span>Thời gian đặt: {moment(get(item, 'createdAt', '')).format('HH:mm DD-MM-YYYY')}</span>
      </div>
    </div>
    <div className="is-right is-statusbox">
      <div className="is-status">Mã đơn: {get(item, 'orderId', {}) || ''}</div>
      {get(orderItemInfos, 'payment', '') === 'point' ? (
        <>
          <div className="is-status">
            Số điểm đổi:{' '}
            <b>
              {numeral(get(orderItemInfos, 'itemPrice', '')).format('#,#')} Vnđ
              {/* <span className="c-pointlogo">L</span> */}
            </b>
          </div>
          <div className="is-status">
            Tiền ship: <b>{numeral(get(item, 'shipMoney', '')).format('#,#')} Vnđ</b>
          </div>
          {/* <div className="is-status">
            Tổng điểm:{' '}
            <b>
              {numeral(get(item, 'mpoint', '')).format('#,#')}{' '}
              <span className="c-pointlogo">đ</span>
            </b>
          </div> */}
        </>
      ) : (
        <>
          <div className="is-status">
            Số tiền đổi: <b>{numeral(get(item, 'moneyCash', '')).format('#,#')} Vnđ</b>
          </div>
          <div className="is-status">
            Tiền ship: <b>{numeral(get(item, 'shipMoney', '')).format('#,#')} Vnđ</b>
          </div>
          <div className="is-status">
            Tổng tiền: <b>{numeral(get(orderItemInfos, 'totalPrice', '')).format('#,#')} Vnđ</b>
          </div>
        </>
      )}
    </div>
  </div>
)

const OrderStatusList: FC<OrderStatusListProps> = (props: OrderStatusListProps) => {
  const { data, loading, lastElementRef, isMobile } = props
  const [showDataOrder, setShowDataOrder] = useState<any>({})
  const [modalShowOrder, setModalShowOrder] = useState(false)
  const handleCloseShowOrder = () => setModalShowOrder(false)

  const mapInStatus = new Map([
    ['wait_for_admin_confirm', 'Chờ xác nhận'],
    ['shipping', 'Đang giao'],
    ['completed', 'Hoàn thành'],
    ['canceled', 'Đã hủy'],
  ])
  const mapInBackgroundColorStatus = new Map([
    ['wait_for_admin_confirm', 'yellow'],
    ['shipping', 'gray'],
    ['completed', 'green'],
    ['canceled', 'red'],
  ])

  return (
    <>
      {data?.length <= 0 && !loading ? (
        <div className="md-ordernone">
          <div className="is-img">
            {isMobile ? <img src="/images/order-none.png" /> : <img src="/images/order-none.png" />}
            <span>Chưa có đơn</span>
          </div>
        </div>
      ) : !loading ? (
        <div className="md-voucher-onelist">
          <ul className="clearfix">
            {(data || []).map((item, idx) => {
              const orderItemInfos = get(item, 'orderItemInfos[0]', {}) || ''
              return (
                <li key={idx} ref={data.length == idx + 1 ? lastElementRef : null}>
                  <OrderStatusItem
                    item={item}
                    orderItemInfos={orderItemInfos}
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
            <b className="m-orderstatus-modal__title">Thông tin đơn hàng</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="statusbox">
            <b>Trạng thái đơn hàng</b>
            <span
              className="is-status"
              style={{
                color: 'white',
                backgroundColor: mapInBackgroundColorStatus.get(get(showDataOrder, 'status', '') || ''),
              }}
            >
              {mapInStatus.get(get(showDataOrder, 'status', '') || '')}
            </span>
          </div>
          <div className="statusbox">
            <b>Địa chỉ nhận hàng</b>
            <span>{get(showDataOrder, 'receiveName', '') || ''}</span>
            <span>{get(showDataOrder, 'receivePhone', '') || ''}</span>
            <span>{get(showDataOrder, 'receiveAddress', '') || ''}</span>
          </div>
          <div className="m-orderstatus-modal__id statusbox">
            <b>Mã đơn</b>
            <span>{get(showDataOrder, 'orderId', '') || ''}</span>
          </div>
          <div className="m-orderstatus-modal__order statusbox">
            <div className="m-orderstatus-modal__order__img">
              <img src={get(showDataOrder, 'orderItemInfos[0].images[0]', '') || ''} />
            </div>
            <div className="m-orderstatus-modal__order__info">
              <b>{get(showDataOrder, 'orderItemInfos[0].name', '') || ''}</b>
              <span>
                {get(showDataOrder, 'orderItemInfos[0].attribute', '') || ''}:{' '}
                {get(showDataOrder, 'orderItemInfos[0].attributeValue', '') || ''}
              </span>
            </div>
          </div>
          {/* <div className="statusbox">
            <b>Phương thức thanh toán</b>
            <span>{get(showDataOrder, 'paymentMethodShip', '') || ''}</span>
          </div> */}
          {get(showDataOrder, 'orderItemInfos[0].payment', '') === 'point' ? (
            <div className="m-orderstatus-modal__money statusbox">
              <div className="m-orderstatus-modal__money__item">
                <b>Số điểm đổi</b>
                <span>
                  {numeral(get(showDataOrder, 'orderItemInfos[0].itemPrice', '')).format('#,#')} Vnđ
                  {/* <span className="c-pointlogo">L</span> */}
                </span>
              </div>
              <div className="m-orderstatus-modal__money__item">
                <b>Tiền ship</b>
                <span>{numeral(get(showDataOrder, 'shipMoney', '')).format('#,#')} Vnđ</span>
              </div>
              {/* <div className="m-orderstatus-modal__money__item">
                <b>Tổng điểm</b>
                <span>
                  {numeral(get(showDataOrder, 'mpoint', '')).format('#,#')}{' '}
                  <span className="c-pointlogo">đ</span>
                </span>
              </div> */}
            </div>
          ) : (
            <div className="m-orderstatus-modal__money statusbox">
              <div className="m-orderstatus-modal__money__item">
                <b>Số tiền đổi</b>
                <span>{numeral(get(showDataOrder, 'moneyCash', '')).format('#,#')} Vnđ</span>
              </div>
              <div className="m-orderstatus-modal__money__item">
                <b>Tiền ship</b>
                <span>{numeral(get(showDataOrder, 'shipMoney', '')).format('#,#')} Vnđ</span>
              </div>
              <div className="m-orderstatus-modal__money__item">
                <b>Tổng tiền</b>
                <span>{numeral(get(showDataOrder, 'orderItemInfos[0].totalPrice', '')).format('#,#')} Vnđ</span>
              </div>
            </div>
          )}
          {get(showDataOrder, 'status', '') === 'canceled' ? (
            <div className="statusbox">
              <b>Thời gian hủy</b>
              <span>{moment(get(showDataOrder, 'createdAt', '')).format('HH:mm DD-MM-YYYY')}</span>
            </div>
          ) : (
            <div className="statusbox">
              <b>Thời gian đặt: </b>
              <span>{moment(get(showDataOrder, 'createdAt', '')).format('HH:mm DD-MM-YYYY')}</span>
            </div>
          )}
          {/* <button
            onClick={handleCloseShowOrder}
            className="m-accumulatepoint-modal__content__btn"
          >
            <span>Đóng</span>
          </button> */}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default OrderStatusList
