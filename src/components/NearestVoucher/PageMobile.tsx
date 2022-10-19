import React, { FC, useEffect } from 'react'
import { flowResult } from 'mobx'
import { observer, inject } from 'mobx-react'
import Link from 'next/link'
import numeral from 'numeral'
import HeaderMobile from '@src/components/common/HeaderSwapMoblie'
import FooterMobile from '@src/components/common/FooterMobile'
import VoucherStore from '@src/stores/voucher.store'
import get from 'lodash/get'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import PageLoading from '@src/helpers/PageLoading'
import { RootStoreHydration } from '@src/stores/RootStore'
import { GlobalHydration } from '@src/stores/global.store'
import { IGeolocation } from '.'
import Config from '@src/contains/Config'

interface PageMobileProps {
  voucherStore?: VoucherStore
  globalStore?: GlobalHydration
  loading?: boolean
  geolocation: IGeolocation
  geolocationErr: string
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const disposers = []
  const { voucherStore, loading, geolocation } = props

  const handleLoadMore = () => {
    voucherStore?.loadMore()
  }
  const hasMoreItems = voucherStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  useEffect(() => {
    async function anymousName() {
      if (geolocation && geolocation.lat && geolocation.lng) {
        await flowResult(
          voucherStore.getListNearestVouchers({
            lat: Number(geolocation.lat),
            lng: Number(geolocation.lng),
            skip: 0,
            limit: Config.PAGE_SIZE,
          })
        )
      }
    }
    anymousName()
  }, [geolocation])

  React.useEffect(() => {
    /* disposers.push(
      reaction(
        () => voucherStore.isChangeParams,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            voucherStore?.filter()
          }
        }
      )
    ) */
    /* disposers.push(
      reaction(
        () => voucherStore.isChangeVoucherType,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            voucherStore?.filter()
          }
        }
      )
    ) */
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={'ƯU ĐÃI QUANH ĐÂY'} />
        <div className="m-moblie-swapgift">
          <div className="m-moblie-swapgift__tab"></div>
          <div className="m-moblie-swapgift__product" style={{ marginTop: '10px' }}>
            <ul className="clearfix">
              {voucherStore.nearest.length <= 0 && !loading ? (
                <span style={{ display: 'block', marginLeft: '15px' }}>Không có ưu đãi quanh đây</span>
              ) : (
                voucherStore.nearest.map((item, idx) => {
                  return (
                    <li
                      ref={voucherStore.nearest.length == idx + 1 ? lastElementRef : null}
                      key={`voucher-nearest-${item.name}-${item.id}`}
                    >
                      <Link href={`/doi-qua/${item.id}`}>
                        <a>
                          <div className="is-product">
                            <div className="is-product__img">
                              <div className="is-product__img__outer">
                                <img src={get(item, 'images[0]', '')} />
                              </div>
                            </div>
                            <div className="is-product__info">
                              <div className="is-product__info__title">
                                <span>{get(item, 'name', '')}</span>
                                <img src={get(item, 'partnerLogo', '')} />
                              </div>
                              {/* <div className="is-product__info__content">
                                  <span>
                                    Giảm 20% khi mua bánh Trung thu tại Homefood
                                  </span>
                                </div> */}
                              {item?.type == 'earn_on_ecom' || item?.type == 'earn_off' ? (
                                <div className="is-product__info__point">
                                  {/* <span>Tích&nbsp;</span> */}
                                  <b>{numeral(get(item, 'giftPoint', 0)).format('0,0')} Vnđ</b>
                                  {/* <span className="c-pointlogo">L</span> */}
                                </div>
                              ) : item?.paymentPoint ? (
                                <div className="is-product__info__point">
                                  {/* <span>Đổi&nbsp;</span> */}
                                  <b>{numeral(get(item, 'paymentPoint', 0)).format('0,0')} Vnđ</b>
                                  {/* <span className="c-pointlogo">L</span> */}
                                </div>
                              ) : (
                                <div className="is-product__info__point">
                                  <b>Miễn phí</b>
                                </div>
                              )}
                            </div>
                          </div>
                        </a>
                      </Link>
                    </li>
                  )
                })
              )}
            </ul>
            {loading ? <PageLoading style={{ height: '150px' }} /> : null}
          </div>
        </div>
        <FooterMobile activeMenu={2} />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }: { store: RootStoreHydration }) => ({
  voucherStore: store?.voucherStore,
  // globalStore: store?.globalStore,
  loading: store.loading,
}))(observer(PageMobile))
