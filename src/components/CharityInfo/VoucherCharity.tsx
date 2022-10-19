import React, { FC } from 'react'
import Link from 'next/link'
import { Charity } from '@src/interfaces/Charity'
import moment from 'dayjs'
import get from 'lodash/get'
import PageLoading from '@src/helpers/PageLoading'

interface VoucherCharityProps {
  data?: Array<Charity>
  isLoading?: boolean | React.Dispatch<React.SetStateAction<boolean>>
  lastElementRef: (node: any) => void
}

const CharityItem = ({ item, urlDetail }: { item: Charity; urlDetail: string }) => (
  <>
    <div className="md-the-vouchercharity">
      <div className="md-the-vouchercharity__img">
        <Link href={urlDetail}>
          <a>
            <img src={get(item, 'images[0]', '')} />
          </a>
        </Link>
      </div>
      <div className="md-the-vouchercharity__content">
        <div className="md-the-vouchercharity__content__title">
          <Link href={urlDetail}>
            <a>
              <span>{get(item, 'name', '')}</span>
            </a>
          </Link>
        </div>
        <div className="md-the-vouchercharity__content__content">
          <span>
            Thời gian áp dụng:
            <br />
            {moment(item.fromDate).format('DD/MM/YYYY')} - {moment(item.toDate).format('DD/MM/YYYY')}
          </span>
        </div>
        <div className="md-the-vouchercharity__content__view">
          <Link href={urlDetail}>
            <a>Xem chi tiết</a>
          </Link>
        </div>
      </div>
    </div>
  </>
)

const VoucherCharity: FC<VoucherCharityProps> = (props: VoucherCharityProps) => {
  const { data = [], isLoading = false } = props
  return (
    <div className="md-voucher-charity">
      <div className="md-voucher-charity__group">
        {data.length <= 0 && !isLoading ? (
          'Không tìm thấy chương trình từ thiện'
        ) : (
          <ul className="clearfix">
            {data.map((item, idx) => {
              const urlDetail = `/tu-thien-vi-cong-dong/${item.id}`
              if (data.length == idx + 1) {
                return (
                  <li ref={props.lastElementRef} key={`charity-${item.name}-${item.id}-${idx}`}>
                    <CharityItem item={item} urlDetail={urlDetail} />
                  </li>
                )
              }
              return (
                <li key={`charity-${item.name}-${item.id}-${idx}`}>
                  <CharityItem item={item} urlDetail={urlDetail} />
                </li>
              )
            })}
          </ul>
        )}
        {isLoading ? <PageLoading style={{ height: '150px' }} /> : null}
      </div>
    </div>
  )
}

export default VoucherCharity
