import React, { FC } from 'react'
import { reaction } from 'mobx'
import { observer, inject } from 'mobx-react'
import VoucherList from '@src/components/common/VoucherList'
import { VoucherHydration } from '@src/stores/voucher.store'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import isEqual from 'lodash/isEqual'

interface VoucherTabDesktopProps {
  voucherStore?: VoucherHydration
  loading?: boolean
}

const VoucherTabDesktop: FC<VoucherTabDesktopProps> = (props: VoucherTabDesktopProps) => {
  const disposers = []
  const { voucherStore, loading } = props

  const handleLoadMore = () => {
    voucherStore?.loadMore()
  }
  const hasMoreItems = voucherStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  React.useEffect(() => {
    disposers.push(
      reaction(
        () => voucherStore.isChangeParams,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            voucherStore?.filter()
          }
        }
      )
    )
    disposers.push(
      reaction(
        () => voucherStore.isChangeVoucherType,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            voucherStore?.filter()
          }
        }
      )
    )
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])

  return (
    <div className="d-voucher-hometab">
      {/* <div className="d-voucher-hometab__top">
        <ul className="clearfix">
          <li
            onClick={() => setActive('voucher')}
            className={`${active == 'voucher' ? 'active' : ''}`}
          >
            VOUCHER
          </li>
          <li
            onClick={() => setActive('product')}
            className={`${active == 'product' ? 'active' : ''}`}
          >
            SẢN PHẨM
          </li>
        </ul>
      </div> */}

      {/* <div className="d-voucher-hometab__bottom">
        <div
          className="container clearfix"
          // data-aos="fade-up"
          // data-aos-delay="500"
        >
          <div className="is-tab">
            <ul className="clearfix">
              <li
                onClick={() => changeVoucherType(VOUCHER_TYPE.HOT)}
                className={`${
                  voucherStore?.voucherType == VOUCHER_TYPE.HOT ? 'active' : ''
                }`}
              >
                <span>Hot nhất</span>
              </li>
              <li
                onClick={() => changeVoucherType(VOUCHER_TYPE.NEW)}
                className={`${
                  voucherStore?.voucherType == VOUCHER_TYPE.NEW ? 'active' : ''
                }`}
              >
                <span>Mới nhất</span>
              </li>
              <li
                onClick={() => changeVoucherType(VOUCHER_TYPE.FREE)}
                className={`${
                  voucherStore?.voucherType == VOUCHER_TYPE.FREE ? 'active' : ''
                }`}
              >
                <span>Miễn phí</span>
              </li>
              <li
                onClick={() => changeVoucherType(VOUCHER_TYPE.ACCUMULATE)}
                className={`${
                  voucherStore?.voucherType == VOUCHER_TYPE.ACCUMULATE
                    ? 'active'
                    : ''
                }`}
              >
                <span>Tích điểm</span>
              </li>
            </ul>
          </div>
          <div className="is-selectbox">
            <div className="form-group is-dropdown-nav">
              <select className="form-control" onChange={filterPoint}>
                {Object.keys(OPTIONS_POINT).map((key) => (
                  <option key={key} value={key}>
                    {OPTIONS_POINT[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div> */}
      <div
        className="d-voucher-hometab__voucher"
        // data-aos="fade-up"
        // data-aos-delay="500"
      >
        <VoucherList data={voucherStore.activeVoucherArr ?? []} isLoading={loading} lastElementRef={lastElementRef} />
      </div>
    </div>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  loading: store.loading,
}))(observer(VoucherTabDesktop))
