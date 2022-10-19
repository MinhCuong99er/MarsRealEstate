import React, { FC } from 'react'
import Link from 'next/link'
import { observer, inject } from 'mobx-react'
import { VoucherHydration } from '@src/stores/voucher.store'
import get from 'lodash/get'
import numeral from 'numeral'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import PageLoading from '@src/helpers/PageLoading'

interface VoucherCoursesProps {
  voucherStore?: VoucherHydration
  loading?: boolean
}

const VoucherCourses: FC<VoucherCoursesProps> = (props: VoucherCoursesProps) => {
  const { voucherStore, loading } = props

  const handleLoadMore = () => {
    voucherStore?.loadMoreCourse()
  }
  const hasMoreItems = voucherStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  return (
    <div className="md-voucher-charity">
      <div className="md-voucher-charity__group">
        {voucherStore?.courses?.length <= 0 && !loading ? (
          'Không tìm thấy voucher'
        ) : (
          <ul className="clearfix">
            {voucherStore?.courses?.map((item, idx) => {
              return (
                <li
                  ref={voucherStore?.courses?.length == idx + 1 ? lastElementRef : null}
                  key={`course-${item.name}-${item.id}-${idx}`}
                >
                  <Link href={`/uu-dai-khoa-hoc/chi-tiet/${item.id}`}>
                    <a>
                      <div className="md-the-offercourses">
                        <div className="md-the-offercourses__img">
                          <img src={get(item, 'images[0]', '')} />
                        </div>
                        <div className="md-the-offercourses__content">
                          <div className="md-the-offercourses__content__title">
                            <span>{get(item, 'name', '')}</span>
                          </div>
                          {item?.paymentPoint ? (
                            <div className="md-the-offercourses__content__point">
                              <b>{numeral(get(item, 'paymentPoint', 0)).format('0,0')} Vnđ</b>
                              {/* <span className="c-pointlogo">L</span> */}
                            </div>
                          ) : (
                            <div className="md-the-offercourses__content__point">
                              <b>Miễn phí</b>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  </Link>
                  <Link href={`doi-qua/${item.id}/chi-tiet`}>
                    <a className="btn">Đổi ngay</a>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
        {loading ? <PageLoading style={{ height: '150px' }} /> : null}
      </div>
    </div>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  loading: store.loading,
}))(observer(VoucherCourses))
