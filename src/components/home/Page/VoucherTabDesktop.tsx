import React, { FC, useState, useEffect } from 'react'
import { reaction } from 'mobx'
import { observer, inject } from 'mobx-react'
import VoucherList from '@src/components/common/VoucherList'
import ProductList from '@src/components/common/ProductList'
import { VoucherHydration } from '@src/stores/voucher.store'
import { ProductHydration } from '@src/stores/product.store'
import { useRouter } from 'next/router'
import { CartType, VOUCHER_TYPE } from '@src/interfaces/enums'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import { OPTIONS_MONEY } from '@src/contains/contants'
import isEqual from 'lodash/isEqual'
import { GlobalHydration } from '@src/stores/global.store'
import CategorySwiperMobile from '@src/components/SwapGift/CategorySwiper.mobile'
import CategorySwiperProductMobile from '@src/components/SwapGift/CategorySwiperProduct.mobile'

interface VoucherTabDesktopProps {
  voucherStore?: VoucherHydration
  productStore?: ProductHydration
  loading?: boolean
  globalStore?: GlobalHydration
  onActiveTab?: any
}

const VoucherTabDesktop: FC<VoucherTabDesktopProps> = (props: VoucherTabDesktopProps) => {
  const disposers = []
  const disposerProducts = []
  const { globalStore, voucherStore, productStore, loading, onActiveTab } = props
  const router = useRouter()
  const { type } = router.query ?? {}
  const [active, setActive] = useState(type ?? 'voucher')
  const [action, setAction] = useState<'point' | 'loadMore' | 'type' | 'category' | ''>('')

  const changeVoucherType = (vType: VOUCHER_TYPE) => {
    setAction('type')
    voucherStore.setVoucherType(vType)
  }

  const changeProductType = (vType: VOUCHER_TYPE) => {
    setAction('type')
    productStore.setProductType(vType)
  }

  const setVoucherType = () => {
    setActive('voucher')
    onActiveTab('Ưu đãi')
  }

  const setProductType = () => {
    setActive('product')
    onActiveTab('Sản phẩm')
  }

  const filterPoint = (e) => {
    const val = e.target.value
    const fromPoint = Number(val.split('-')[0])
    const toPoint = Number(val.split('-')[1])
    setAction('point')
    voucherStore.setHasEnd({
      [VOUCHER_TYPE.NEW]: false,
      [VOUCHER_TYPE.HOT]: false,
      [VOUCHER_TYPE.FREE]: false,
      [VOUCHER_TYPE.ACCUMULATE]: false,
    })
    voucherStore?.setParams({
      fromPoint,
      toPoint,
    })
  }

  const filterPointBegin = () => {
    const val = '*-*'
    const fromPoint = Number(val.split('-')[0])
    const toPoint = Number(val.split('-')[1])
    setAction('point')
    voucherStore.setHasEnd({
      [VOUCHER_TYPE.NEW]: false,
      [VOUCHER_TYPE.HOT]: false,
      [VOUCHER_TYPE.FREE]: false,
      [VOUCHER_TYPE.ACCUMULATE]: false,
    })
    voucherStore?.setParams({
      fromPoint,
      toPoint,
    })
  }

  const filterPointProduct = (e) => {
    const val = e.target.value
    const fromPoint = Number(val.split('-')[0])
    const toPoint = Number(val.split('-')[1])
    setAction('point')
    productStore.setHasEnd({
      [VOUCHER_TYPE.NEW]: false,
      [VOUCHER_TYPE.HOT]: false,
    })
    productStore?.setParams({
      fromPoint,
      toPoint,
    })
  }

  const filterPointProductBegin = () => {
    const val = '*-*'
    const fromPoint = Number(val.split('-')[0])
    const toPoint = Number(val.split('-')[1])
    setAction('point')
    productStore.setHasEnd({
      [VOUCHER_TYPE.NEW]: false,
      [VOUCHER_TYPE.HOT]: false,
    })
    productStore?.setParams({
      fromPoint,
      toPoint,
    })
  }

  const handleLoadMore = React.useCallback(() => {
    setAction('loadMore')
    voucherStore?.loadMore()
  }, [voucherStore.pagination])
  const hasMoreItems = voucherStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(
    hasMoreItems
      ? handleLoadMore
      : () => {
          if (voucherStore.hasEnd[voucherStore.voucherType] == false) {
            voucherStore.setHasEnd({
              [voucherStore.voucherType]: true,
            })
          }
        },
    loading
  )

  const handleLoadMoreProduct = React.useCallback(() => {
    setAction('loadMore')
    productStore?.loadMore()
  }, [productStore.pagination])
  const hasMoreItemsProduct = productStore?.hasMoreItems
  const [lastElementRefProduct] = useInfiniteScroll(
    hasMoreItemsProduct
      ? handleLoadMoreProduct
      : () => {
          if (productStore.hasEnd[productStore.productType] == false) {
            productStore.setHasEnd({
              [productStore.productType]: true,
            })
          }
        },
    loading
  )

  React.useEffect(() => {
    disposers.push(
      reaction(
        () => voucherStore.isChangeParams,
        (value: any, prevValue: any) => {
          if (isEqual(value, prevValue) === false) {
            voucherStore?.filter()
          }
        },
        {
          name: 'list_gift_change_params',
        }
      )
    )
    disposers.push(
      reaction(
        () => voucherStore.isChangeVoucherType,
        (value: any, prevValue: any) => {
          // if (
          //   !isEqual(value, prevValue) &&
          //   voucherStore.hasEnd[value] == false
          // ) {
          if (isEqual(value, prevValue) === false) {
            voucherStore?.filter()
          }
        },
        {
          name: 'list_gift_change_type',
        }
      )
    )
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])

  React.useEffect(() => {
    disposerProducts.push(
      reaction(
        () => productStore.isChangeParams,
        (value: any, prevValue: any) => {
          if (isEqual(value, prevValue) === false) {
            productStore?.filter()
          }
        },
        {
          name: 'list_gift_product_change_params',
        }
      )
    )
    disposerProducts.push(
      reaction(
        () => productStore.isChangeProductType,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue) && productStore.hasEnd[value] == false) {
            productStore?.filter()
          }
        },
        {
          name: 'list_gift_product_change_type',
        }
      )
    )
    return () => {
      disposerProducts.forEach((disposer) => disposer())
    }
  }, [])

  useEffect(() => {
    filterPointBegin()
    filterPointProductBegin()
  }, [])

  return (
    <div className="d-voucher-hometab">
      <div className="d-voucher-hometab__top">
        <div className="container">
          <ul className="clearfix">
            <li onClick={setVoucherType} className={`${active == 'voucher' ? 'active' : ''}`}>
              VOUCHER
            </li>
            <li onClick={setProductType} className={`${active == 'product' ? 'active' : ''}`}>
              SẢN PHẨM
            </li>
          </ul>
          {active == 'voucher' ? (
            <div className="m-moblie-swapgift__scroll">
              <div className="m-fix-border">
                <CategorySwiperMobile
                  type={CartType.VOUCHER}
                  data={globalStore?.voucherCategories}
                  onChange={(cateId: number) => {
                    setAction('category')
                    voucherStore?.setParams({
                      categoryId: cateId,
                    })
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="m-moblie-swapgift__scroll">
              <div className="m-fix-border is-product">
                <CategorySwiperProductMobile
                  type={CartType.PRODUCT}
                  data={globalStore?.productCategories}
                  onChange={(cateId: number) => {
                    setAction('category')
                    productStore?.setParams({
                      categoryId: cateId,
                    })
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {active == 'voucher' ? (
        <>
          <div className="d-voucher-hometab__bottom">
            <div
              className="container clearfix"
              // data-aos="fade-up"
              // data-aos-delay="500"
            >
              <div className="is-tab">
                <ul className="clearfix">
                  <li
                    onClick={() => changeVoucherType(VOUCHER_TYPE.HOT)}
                    className={`${voucherStore?.voucherType == VOUCHER_TYPE.HOT ? 'active' : ''}`}
                  >
                    <span>Hot nhất</span>
                  </li>
                  <li
                    onClick={() => changeVoucherType(VOUCHER_TYPE.NEW)}
                    className={`${voucherStore?.voucherType == VOUCHER_TYPE.NEW ? 'active' : ''}`}
                  >
                    <span>Mới nhất</span>
                  </li>
                  <li
                    onClick={() => changeVoucherType(VOUCHER_TYPE.FREE)}
                    className={`${voucherStore?.voucherType == VOUCHER_TYPE.FREE ? 'active' : ''}`}
                  >
                    <span>Miễn phí</span>
                  </li>
                  <li
                    onClick={() => changeVoucherType(VOUCHER_TYPE.ACCUMULATE)}
                    className={`${voucherStore?.voucherType == VOUCHER_TYPE.ACCUMULATE ? 'active' : ''}`}
                  >
                    <span>Tích điểm</span>
                  </li>
                </ul>
              </div>
              <div className="is-selectbox">
                <div className="form-group is-dropdown-nav">
                  <select className="form-control" onChange={filterPoint}>
                    {Object.keys(OPTIONS_MONEY).map((key) => (
                      <option key={key} value={key}>
                        {OPTIONS_MONEY[key]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="d-voucher-hometab__voucher">
            <VoucherList
              data={voucherStore.activeVoucherArr ?? []}
              isLoading={loading}
              lastElementRef={lastElementRef}
              action={action}
            />
          </div>
        </>
      ) : (
        <>
          <div className="d-voucher-hometab__bottom">
            <div
              className="container clearfix"
              // data-aos="fade-up"
              // data-aos-delay="500"
            >
              <div className="is-tab">
                <ul className="clearfix">
                  <li
                    onClick={() => changeProductType(VOUCHER_TYPE.HOT)}
                    className={`${productStore?.productType == VOUCHER_TYPE.HOT ? 'active' : ''}`}
                  >
                    <span>Hot nhất</span>
                  </li>
                  <li
                    onClick={() => changeProductType(VOUCHER_TYPE.NEW)}
                    className={`${productStore?.productType == VOUCHER_TYPE.NEW ? 'active' : ''}`}
                  >
                    <span>Mới nhất</span>
                  </li>
                  {/* <li
                    onClick={() => changeVoucherType(VOUCHER_TYPE.FREE)}
                    className={`${
                      voucherStore?.voucherType == VOUCHER_TYPE.FREE
                        ? 'active'
                        : ''
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
                  </li> */}
                </ul>
              </div>
              {active == 'voucher' && (
                <div className="is-selectbox">
                  <div className="form-group is-dropdown-nav">
                    <select className="form-control" onChange={filterPointProduct}>
                      {Object.keys(OPTIONS_MONEY).map((key) => (
                        <option key={key} value={key}>
                          {OPTIONS_MONEY[key]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="d-voucher-hometab__voucher">
            <ProductList
              data={productStore.activeProductArr ?? []}
              isLoading={loading}
              lastElementRef={lastElementRefProduct}
              action={action}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  productStore: store?.productStore,
  loading: store.loading,
  globalStore: store?.globalStore,
}))(observer(VoucherTabDesktop))
