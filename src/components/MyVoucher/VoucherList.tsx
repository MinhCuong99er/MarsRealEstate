import PageLoading from '@src/helpers/PageLoading'
import { Voucher } from '@src/interfaces/Voucher'
import React, { FC } from 'react'
import get from 'lodash/get'

interface VoucherListProps {
  loading?: boolean
  data: Array<Voucher>
  isMobile?: boolean
  lastElementRef: (node: any) => void
}

const MyVoucherItem = ({ item }: { item: Voucher }) => (
  <div className="md-voucher-onelist__item">
    <div className="is-left">
      <div className="is-imgbox">
        <div className="is-img">
          <img src={get(item, 'imagesVoucher[0]', '')} />
        </div>
      </div>
      <div className="is-des">
        <b>{get(item, 'partnerName', '')}</b>
        <span>{get(item, 'voucherName', '')}</span>
        {/* <span>Thời gian đặt: 19:20 - 01/09/2021</span> */}
      </div>
    </div>
    <div className="is-right">
      <div className="is-used">Đã sử dụng</div>
      {/* <div className="is-time">19:20 - 01/05/2021</div> */}
    </div>
  </div>
)

const VoucherListMyVoucher: FC<VoucherListProps> = (props: VoucherListProps) => {
  const { data, loading, isMobile } = props
  return (
    <div className="md-voucher-onelist">
      <ul className="clearfix">
        {data.length <= 0 && !loading ? (
          isMobile ? (
            <span style={{ color: '#000' }}>Bạn chưa chưa sử dụng ưu đãi nào!</span>
          ) : (
            <span style={{ color: '#000' }}>Bạn chưa chưa sử dụng ưu đãi nào!</span>
          )
        ) : (
          data.map((item) => {
            return (
              <li key={`item-${item.name}-${item.id}`}>
                <MyVoucherItem item={item} />
              </li>
            )
          })
        )}
      </ul>
      {loading ? <PageLoading style={{ height: '150px' }} /> : null}
    </div>
  )
}

export default VoucherListMyVoucher
