import React, { FC, useEffect } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import VoucherList from '../common/VoucherList'
import VoucherListMyVoucher from './VoucherList'
import { VoucherHydration } from '@src/stores/voucher.store'
import numeral from 'numeral'
import { flowResult, reaction } from 'mobx'
import isEqual from 'lodash/isEqual'
import { MY_VOUCHER_USED } from '@src/interfaces/enums'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import Config from '@src/contains/Config'
numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageDesktopProps {
  voucherStore?: VoucherHydration
  loading?: boolean
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const disposers = []
  const { voucherStore, loading } = props

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // $('.container').css({ background: 'red' })
    }
    // handleShowSuccess()
    myNotUsedVoucher()
  }, [])

  const myNotUsedVoucher = async () => {
    const data = {
      skip: 0,
      limit: Config.PAGE_SIZE,
    }
    const resNotUsedVoucher = await flowResult<any>(voucherStore.getMyNotUsedVouchers?.(data))
    if (resNotUsedVoucher?.code == 0) {
      // console.log("🚀 ~ file: PageDesktop.tsx ~ line 43 ~ myNotUsedVoucher ~ resNotUsedVoucher", resNotUsedVoucher)
    }
  }

  const handleLoadMore = () => {
    voucherStore?.loadMoreMyVoucherUsed()
  }
  const hasMoreItems = voucherStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  const changMyVoucherUsed = (vType: MY_VOUCHER_USED) => {
    voucherStore.setMyUsedVoucher(vType)
  }

  React.useEffect(() => {
    disposers.push(
      reaction(
        () => voucherStore.isChangeMyVoucherUsed,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            voucherStore?.filterVoucherUsed()
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
              <div className="m-myvoucher__tab">
                <ul className="clearfix">
                  <li
                    className={`${voucherStore?.myVoucherUsed == MY_VOUCHER_USED.NOT_USED ? 'active' : ''}`}
                    onClick={() => changMyVoucherUsed(MY_VOUCHER_USED.NOT_USED)}
                  >
                    <span>Ưu đãi đã đổi</span>
                  </li>
                  <li
                    className={`${voucherStore?.myVoucherUsed == MY_VOUCHER_USED.USED ? 'active' : ''}`}
                    onClick={() => changMyVoucherUsed(MY_VOUCHER_USED.USED)}
                  >
                    <span>Ưu đãi đã sử dụng</span>
                  </li>
                </ul>
              </div>
              {voucherStore?.myVoucherUsed == MY_VOUCHER_USED.NOT_USED ? (
                <VoucherList
                  data={voucherStore?.notUsedVouchers}
                  isMyVoucher={true}
                  isLoading={loading}
                  lastElementRef={lastElementRef}
                />
              ) : (
                <VoucherListMyVoucher
                  data={voucherStore?.usedVouchers}
                  loading={loading}
                  lastElementRef={lastElementRef}
                />
              )}
            </div>
          </div>
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  loading: store.loading,
}))(observer(PageDesktop))
