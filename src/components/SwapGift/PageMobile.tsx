import React, { FC, useState, useEffect } from 'react'
import { reaction, toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import Link from 'next/link'
import numeral from 'numeral'
import { Modal } from 'react-bootstrap'
import HeaderMobile from '@src/components/common/HeaderSwapMoblie'
// import CategorySwiper from './CategorySwiper.mobile'
// import CategorySwiperProduct from './CategorySwiperProduct.mobile'
import { VoucherHydration } from '@src/stores/voucher.store'
import { ProductHydration } from '@src/stores/product.store'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import { ACTIVE_TAB_SWAPGIFT_PAGE, CartType, VOUCHER_TYPE, VOUCHER_TYPES } from '@src/interfaces/enums'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import { OPTIONS_MONEY } from '@src/contains/contants'
import isEqual from 'lodash/isEqual'
import PageLoading from '@src/helpers/PageLoading'
import { RootStoreHydration } from '@src/stores/RootStore'
import { GlobalHydration } from '@src/stores/global.store'
import { Product } from '@src/interfaces/Product'
import { Voucher } from '@src/interfaces/Voucher'
import AuthStore from '@src/stores/auth.store'
// import HeaderHomeMobile from '../common/HeaderHomeMobile'
import UserInfoBox from '@src/components/common/UserInfoBox'
import PopupFix from '@src/components/popup/PopupFix'
import PageLoadingcss from '@src/helpers/PageLoadingcss'

interface PageMobileProps {
  voucherStore?: VoucherHydration
  productStore?: ProductHydration
  globalStore?: GlobalHydration
  authStore?: AuthStore
  loading?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderVietelPercent = (percent: number | null) => {
  if (percent !== null && typeof percent == 'number' && percent > 0) {
    return (
      <div className="is-product__info__viettelpercent">
        <b>Tích điểm {percent}%</b>
      </div>
    )
  }
  return <div className="is-product__info__viettelpercent" style={{ height: '1px', content: ' ' }}></div>
}

const renderVoucherAccumulate = (accumulate: number | null, type: 'point' | 'discount' | 'buy_online') => {
  return accumulate !== null && typeof accumulate == 'number' && accumulate > 0 ? (
    <div className="is-product__info__viettelpercent">
      {type == 'point' ? <b>Tích {numeral(accumulate).format('0,0')} điểm</b> : <b>Tích điểm {accumulate}%</b>}
    </div>
  ) : (
    <div className="is-product__info__viettelpercent" style={{ height: '1px', content: ' ' }}></div>
  )
}

const renderProductAccumulate = (accumulate: number | null, type: 'point' | 'percent') => {
  return accumulate !== null && typeof accumulate == 'number' && accumulate > 0 ? (
    <div className="is-product__info__viettelpercent">
      {type == 'point' ? <b>Tích {numeral(accumulate).format('0,0')} điểm</b> : <b>Tích điểm {accumulate}%</b>}
    </div>
  ) : (
    <div className="is-product__info__viettelpercent" style={{ height: '1px', content: ' ' }}></div>
  )
}

const renderVoucherFlag = (item: Voucher) => {
  switch (item?.type) {
    case VOUCHER_TYPES.EXCHANGE_DISCOUNT_PERCENT:
      return (
        <div className="is-product__img__flag">
          <span> + {numeral(item?.paymentPoint).format('0,0')} điểm</span>
        </div>
      )
      break
    case VOUCHER_TYPES.EARN_OFF:
      return (
        <div className="is-product__img__flag">
          <span>+ {numeral(item?.discountPercent).format('0,0')} %</span>
        </div>
      )
      break
    case VOUCHER_TYPES.EARN_ON_ECOM:
      return (
        <div className="is-product__img__flag">
          <span>+ {numeral(item?.billPointPercent).format('0,0')} %</span>
        </div>
      )
    default:
      return null
  }
}

const renderProductFlag = (item: Product) => {
  switch (item?.accumlatePointType) {
    case 'percent':
      return (
        <div className="is-product__img__flag">
          <span>+ {numeral(item?.percentAccumlatePoints).format('0,0')} %</span>
        </div>
      )
    case 'point':
      return (
        <div className="is-product__img__flag">
          <span>+ {numeral(item?.percentAccumlatePoints).format('0,0')} điểm</span>
        </div>
      )
    default:
      return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderVoucherTich = (item: Voucher) => {
  if (typeof item?.giftPoint == 'number' && item?.giftPoint > 0) {
    return (
      <div className="is-product__info__point">
        {/* <span>Tích </span> */}
        <b>{numeral(get(item, 'giftPoint', 0)).format('0,0')} Vnđ</b>
        {/* <span className="c-pointlogo">L</span> */}
      </div>
    )
  } else if (typeof item?.discountPercent == 'number' && item?.discountPercent > 0) {
    return (
      <div className="is-product__info__point">
        {/* <span>Tích </span> */}
        <b>Giảm {numeral(get(item, 'discountPercent', 0)).format('0,0')}</b>
        <span className="c-pointlogo">%</span>
      </div>
    )
  }
  return (
    <div className="is-product__info__point">
      {/* <span>Tích </span> */}
      <b>Giảm {numeral(get(item, 'billPointPercent', 0)).format('0,0')}</b>
      <span className="c-pointlogo">%</span>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderVoucherType = (item: Voucher) => {
  if (item?.paymentCash && item?.paymentCash > 0) {
    // voucher doi diem
    return (
      <>
        {renderVietelPercent(item.viettelPercent)}
        <div className="is-product__info__point">
          {/* <span>Đổi </span> */}
          <b>{numeral(get(item, 'paymentCash', 0)).format('0,0')} Vnđ</b>
          {/* <span className="c-pointlogo">L</span> */}
        </div>
      </>
    )
  }
  /*  else if (
    // voucher tich diem
    item?.type == 'earn_on_ecom' ||
    item?.type == 'earn_on_voucher' ||
    item?.type == 'earn_off'
  ) {
    return (
      <>
        {renderVietelPercent(item.viettelPercent)}
        {renderVoucherTich(item)}
      </>
    )
  } */
  // voucher free
  return (
    <>
      {renderVietelPercent(item.viettelPercent)}
      <div className="is-product__info__point">
        <b>Miễn phí</b>
      </div>
    </>
  )
}

const renderMbVoucherType = (item: Voucher) => {
  switch (item?.type) {
    case VOUCHER_TYPES.EXCHANGE_DISCOUNT_PERCENT:
      return (
        <>
          {renderVoucherAccumulate(item.paymentPoint, 'point')}
          <div className="is-product__info__point">
            {item?.paymentCash ? <b>{numeral(get(item, 'paymentCash', 0)).format('0,0')} Vnđ</b> : null}
          </div>
        </>
      )
      break
    case VOUCHER_TYPES.EARN_OFF:
      return (
        <>
          {renderVoucherAccumulate(item.discountPercent, 'discount')}
          {/* <div className="is-product__info__point">
            <b>Miễn phí</b>
          </div> */}
        </>
      )
      break
    case VOUCHER_TYPES.EARN_ON_ECOM:
      return (
        <>
          {renderVoucherAccumulate(item.billPointPercent, 'buy_online')}
          {/* <div className="is-product__info__point">
            <b>Miễn phí</b>
          </div> */}
        </>
      )
      break
    default:
      return null
  }
}

const renderMbProductType = (item: Product) => {
  switch (item?.accumlatePointType) {
    case 'percent':
      return <>{renderProductAccumulate(item.percentAccumlatePoints, 'percent')}</>
    case 'point':
      return <>{renderProductAccumulate(item.percentAccumlatePoints, 'point')}</>
    default:
      return null
  }
}

const renderPaymentType = (item: Product) => {
  switch (item?.payment) {
    case 'point':
    default:
      return (
        <div className="is-product__info__point">
          {/* <span>Đổi </span> */}
          <b>{numeral(get(item, 'paymentPoint', 0)).format('0,0')} Vnđ</b>
          {/* <span className="c-pointlogo">L</span> */}
        </div>
      )
    case 'cash':
      return (
        <div className="is-product__info__point">
          {/* <span>Đổi </span> */}
          <b>{numeral(get(item, 'paymentCash', 0)).format('0,0')} Vnđ</b>
          {/* <span className="c-pointlogo">L</span> */}
        </div>
      )
    case 'free':
      return (
        <div className="is-product__info__point">
          <b>Miễn phí</b>
        </div>
      )
  }
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const disposers = []
  const disposerProducts = []
  const { voucherStore, productStore, globalStore, loading, authStore } = props
  const router = useRouter()
  // const { type } = router.query ?? {}
  // const [active, setActive] = useState(type ?? 'voucher')
  const activeTab: ACTIVE_TAB_SWAPGIFT_PAGE = globalStore?.activeTabSwapGiftPage

  const [action, setAction] = useState<'point' | 'loadMore' | 'type' | 'category' | ''>('')
  const [checkBtnPoint, setCheckBtnBpoint] = useState(false)
  const [checkKeyPoint, setCheckKeyPoint] = useState(Object.keys(OPTIONS_MONEY)[0])
  const [modalLienKet, setModalLienKet] = useState(false)
  const [loadingLienKet, setLoadingLienKet] = useState(false)
  const [modalNotLinkPartner, setModalNotLinkPartner] = useState(false)
  const [openPopupFix, setOpenPopupFix] = useState(false)
  const [urlVoucherInfo, setUrlVoucherInfo] = useState('')

  console.log(checkBtnPoint, checkKeyPoint, CartType)

  const changeVoucherType = (vType: VOUCHER_TYPE) => {
    setAction('type')
    voucherStore.setVoucherType(vType)
  }

  const changeProductType = (vType: VOUCHER_TYPE) => {
    setAction('type')
    productStore.setProductType(vType)
  }

  const handleLoadMore = () => {
    setAction('loadMore')
    voucherStore?.loadMore()
  }
  const hasMoreItems = voucherStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  const handleLoadMoreProduct = () => {
    setAction('loadMore')
    productStore?.loadMore()
  }
  const hasMoreItemsProduct = productStore?.hasMoreItems
  const [lastElementRefProduct] = useInfiniteScroll(hasMoreItemsProduct ? handleLoadMoreProduct : () => {}, loading)

  const filterPoint = (e) => {
    const val = e
    const fromPoint = Number(val.split('-')[0])
    const toPoint = Number(val.split('-')[1])
    setAction('point')
    voucherStore?.setParams({
      fromPoint,
      toPoint,
    })
    setCheckKeyPoint(e)
    setCheckBtnBpoint(false)
  }

  const filterPointProduct = (e) => {
    const val = e
    const fromPoint = Number(val.split('-')[0])
    const toPoint = Number(val.split('-')[1])
    setAction('point')
    productStore?.setParams({
      fromPoint,
      toPoint,
    })
    setCheckKeyPoint(e)
    setCheckBtnBpoint(false)
  }

  const handleModalLienKet = (s: boolean) => {
    if (!s) {
      setModalLienKet(false)
    } else {
      setModalLienKet(s)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const doReward = (e: any, voucherInfo: Voucher) => {
    // 2-6-2022 anh Đăng bảo check trường url bắt voucher affilate
    if (typeof voucherInfo.url == 'string' && voucherInfo.url != '') {
      // window.open(voucherInfo.url, '_system')
      // window.location.href = voucherInfo.url
      setUrlVoucherInfo(voucherInfo.url)
      setOpenPopupFix(true)
    } else if (
      // voucher tich diem
      voucherInfo?.type == VOUCHER_TYPES.EARN_ON_ECOM &&
      !authStore?.isLinkExchangePhone
    ) {
      handleModalLienKet(true)
    } else if (voucherInfo?.type == VOUCHER_TYPES.EARN_ON_ECOM) {
      // voucher dang affilate sửa lần 2 anh Đăng bảo chuyển từ linkPartner sang urlTemplate
      if (typeof voucherInfo.urlTemplate == 'string' && voucherInfo.urlTemplate != '') {
        setUrlVoucherInfo(voucherInfo.urlTemplate)
        setOpenPopupFix(true)
      } else {
        setModalNotLinkPartner(true)
      }
    } else {
      router.push(`/doi-qua/${voucherInfo?.id}`)
    }
  }

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

  React.useEffect(() => {
    disposerProducts.push(
      reaction(
        () => productStore.isChangeParams,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            productStore?.filter()
          }
        }
      )
    )
    disposerProducts.push(
      reaction(
        () => productStore.isChangeProductType,
        (value: any, prevValue: any) => {
          if (!isEqual(value, prevValue)) {
            productStore?.filter()
          }
        }
      )
    )
    return () => {
      disposerProducts.forEach((disposer) => disposer())
    }
  }, [])

  useEffect(() => {
    filterPoint('*-*')
    filterPointProduct('*-*')
  }, [])

  return (
    <React.Fragment>
      <div className="m-body">
        <div className="m-user-bgtop p-0">
          <UserInfoBox />
        </div>
        <HeaderMobile title={'mPoint'} />
        <div className="m-moblie-swapgift">
          {/* <div className="m-moblie-swapgift__title">
            <div onClick={() => setActive('voucher')} className={`is-title ${active == 'voucher' ? 'is-active' : ''}`}>
              <span>Voucher</span>
            </div>
            <div onClick={() => setActive('product')} className={`is-title ${active == 'product' ? 'is-active' : ''}`}>
              <span>Sản phẩm</span>
            </div>
          </div> */}
          {/* {active == 'voucher' ? ( */}
          <>
            <div className="m-moblie-swapgift__tab">
              <ul className="clearfix">
                {/* <li
                    onClick={() => {
                      changeVoucherType(VOUCHER_TYPE.HOT)
                    }}
                  >
                    <div className={`is-tab ${voucherStore?.voucherType == VOUCHER_TYPE.HOT ? 'is-active' : ''}`}>
                      <span>Hot nhất</span>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      changeVoucherType(VOUCHER_TYPE.NEW)
                    }}
                  >
                    <div className={`is-tab ${voucherStore?.voucherType == VOUCHER_TYPE.NEW ? 'is-active' : ''}`}>
                      <span>Mới nhất</span>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      changeVoucherType(VOUCHER_TYPE.FREE)
                    }}
                  >
                    <div className={`is-tab ${voucherStore?.voucherType == VOUCHER_TYPE.FREE ? 'is-active' : ''}`}>
                      <span>Miễn phí</span>
                    </div>
                  </li> */}
                {/* <li
                    onClick={() => {
                      changeVoucherType(VOUCHER_TYPE.HOT)
                    }}
                  >
                    <div className={`is-tab ${voucherStore?.voucherType == VOUCHER_TYPE.HOT ? 'is-active' : ''}`}>
                      <span>Tất cả</span>
                    </div>
                  </li> */}
                <li
                  onClick={() => {
                    // setActive('voucher')
                    globalStore?.setActiveTabSwapGiftPage(ACTIVE_TAB_SWAPGIFT_PAGE.VOUCHER)
                    changeVoucherType(VOUCHER_TYPE.NEW)
                    voucherStore?.setVoucherTypes(VOUCHER_TYPES.EARN_OFF)
                  }}
                >
                  <div
                    className={`is-tab ${
                      activeTab == ACTIVE_TAB_SWAPGIFT_PAGE.VOUCHER &&
                      voucherStore?.voucherType == VOUCHER_TYPE.NEW &&
                      voucherStore?.voucherTypes !== VOUCHER_TYPES.EARN_ON_ECOM
                        ? 'is-active'
                        : ''
                    }`}
                  >
                    <span>Mua voucher</span>
                  </div>
                </li>
                <li
                  onClick={() => {
                    // setActive('voucher')
                    globalStore?.setActiveTabSwapGiftPage(ACTIVE_TAB_SWAPGIFT_PAGE.VOUCHER)
                    changeVoucherType(VOUCHER_TYPE.NEW)
                    voucherStore?.setVoucherTypes(VOUCHER_TYPES.EARN_ON_ECOM)
                  }}
                >
                  <div
                    className={`is-tab ${
                      activeTab == ACTIVE_TAB_SWAPGIFT_PAGE.VOUCHER &&
                      voucherStore?.voucherType == VOUCHER_TYPE.NEW &&
                      voucherStore?.voucherTypes == VOUCHER_TYPES.EARN_ON_ECOM
                        ? 'is-active'
                        : ''
                    }`}
                  >
                    <span>Mua hàng online</span>
                  </div>
                </li>
                <li
                  onClick={() => {
                    // setActive('product')
                    globalStore?.setActiveTabSwapGiftPage(ACTIVE_TAB_SWAPGIFT_PAGE.PRODUCT)
                    changeProductType(VOUCHER_TYPE.NEW)
                  }}
                >
                  <div
                    className={`is-tab ${
                      activeTab == ACTIVE_TAB_SWAPGIFT_PAGE.PRODUCT && productStore?.productType == VOUCHER_TYPE.NEW
                        ? 'is-active'
                        : ''
                    }`}
                  >
                    <span>Mua sản phẩm</span>
                  </div>
                </li>
                {/* <li
                    onClick={() => {
                      changeVoucherType(VOUCHER_TYPE.ACCUMULATE)
                    }}
                  >
                    <div
                      className={`is-tab ${voucherStore?.voucherType == VOUCHER_TYPE.ACCUMULATE ? 'is-active' : ''}`}
                    >
                      <span>Tích điểm</span>
                    </div>
                  </li>
                  <li onClick={() => setCheckBtnBpoint(!checkBtnPoint)} className={checkBtnPoint ? 'active' : ''}>
                    <div className="is-tab">
                      <span>Khoảng giá</span>
                      <img src="/images/swapgift/ico-dropdown.png" />
                    </div>
                    <div className="m-table-point">
                      {Object.keys(OPTIONS_MONEY).map((key) => (
                        <span
                          onClick={() => filterPoint(key)}
                          className={`${key} ${checkKeyPoint == key ? 'active' : ''}`}
                          key={key}
                        >
                          {OPTIONS_MONEY[key]}
                        </span>
                      ))}
                    </div>
                  </li> */}
              </ul>
            </div>
            {/* <div className="m-moblie-swapgift__scroll">
              <div className="m-fix-border">
                {activeTab == ACTIVE_TAB_SWAPGIFT_PAGE.VOUCHER ? (
                  <CategorySwiper
                    type={CartType.VOUCHER}
                    data={globalStore?.voucherCategories}
                    onChange={(cateId: number) => {
                      setAction('category')
                      voucherStore?.setParams({
                        categoryId: cateId,
                      })
                    }}
                  />
                ) : (
                  <CategorySwiperProduct
                    type={CartType.PRODUCT}
                    data={globalStore?.productCategories}
                    onChange={(cateId: number) => {
                      setAction('category')
                      productStore?.setParams({
                        categoryId: cateId,
                      })
                    }}
                  />
                )}
              </div>
            </div> */}
            <div className="m-moblie-swapgift__product">
              {loading &&
              typeof action == 'string' &&
              (action == 'point' || action == 'type' || action == 'category') ? (
                <PageLoading style={{ height: '150px' }} />
              ) : null}
              {activeTab == ACTIVE_TAB_SWAPGIFT_PAGE.VOUCHER ? (
                <ul className="clearfix">
                  {(voucherStore.activeVoucherArr ?? []).length <= 0 && !loading ? (
                    <span style={{ marginLeft: '10px' }}>Không có ưu đãi nào</span>
                  ) : (
                    (voucherStore.activeVoucherArr ?? []).map((item, idx) => {
                      return (
                        <li
                          ref={(voucherStore.activeVoucherArr ?? []).length == idx + 1 ? lastElementRef : null}
                          key={`voucher-${item.name}-${item.id}`}
                        >
                          <Link href={`/doi-qua/${item.id}`}>
                            <a>
                              <div className="is-product">
                                <div className="is-product__img">
                                  <div className="is-product__img__outer">
                                    <img src={get(item, 'images[0]', '')} />
                                  </div>
                                  {renderVoucherFlag(item)}
                                </div>
                                <div className="is-product__info">
                                  <div className="is-product__info__title">
                                    <span>{get(item, 'name', '')}</span>
                                    <img src={get(item, 'partnerLogo', '')} />
                                  </div>
                                  <br />
                                  {/* <div className="is-product__info__content">
                                <span>
                                  Giảm 20% khi mua bánh Trung thu tại Homefood
                                </span>
                              </div> */}
                                  {renderMbVoucherType(item)}
                                </div>
                              </div>
                            </a>
                          </Link>
                          {/* <Link href={`/doi-qua/${item.id}/chi-tiet`}> */}
                          {authStore && authStore.token ? (
                            <Link href={`/doi-qua/${item.id}`}>
                              <a className="btn is-btn-doiqua">
                                {/* {get(item, 'paymentPoint', '') ? 'Mua ngay' : 'Nhận ưu đãi'} */}
                                Mua ngay
                              </a>
                            </Link>
                          ) : // <a className="btn is-btn-doiqua" onClick={(e) => doReward(e, item)}>
                          //   {get(item, 'paymentPoint', '') ? 'Mua ngay' : 'Nhận ưu đãi'}
                          // </a>
                          null}
                        </li>
                      )
                    })
                  )}
                </ul>
              ) : (
                <ul className="clearfix">
                  {(productStore.activeProductArr ?? []).length <= 0 && !loading ? (
                    <span style={{ marginLeft: '10px' }}>Không có sản phẩm nào</span>
                  ) : (
                    (productStore.activeProductArr ?? []).map((item, idx) => {
                      console.log('abc', toJS(item))
                      return (
                        <li
                          ref={(productStore.activeProductArr ?? []).length == idx + 1 ? lastElementRefProduct : null}
                          key={`product-${item.name}-${item.id}`}
                        >
                          <Link href={`/doi-qua/san-pham/${item.id}`}>
                            <a>
                              <div className="is-product">
                                <div className="is-product__img">
                                  <div className="is-product__img__outer">
                                    <img src={get(item, 'images[0]', '')} />
                                  </div>
                                  {renderProductFlag(item)}
                                </div>
                                <div className="is-product__info">
                                  <div className="is-product__info__title">
                                    <span>{get(item, 'name', '')}</span>
                                    <img
                                      src={get(item, 'partnerLogo', '')}
                                      style={!get(item, 'partnerLogo', '') ? { opacity: 0 } : {}}
                                    />
                                  </div>
                                  {/* <div className="is-product__info__content">
                                    <span>Giảm 20% khi mua bánh Trung thu tại Homefood</span>
                                  </div> */}
                                  {renderMbProductType(item)}
                                  {renderPaymentType(item)}
                                </div>
                              </div>
                            </a>
                          </Link>

                          {authStore && authStore.token ? (
                            <Link href={`/doi-qua/san-pham/${item.id}`}>
                              <a className="btn is-btn-doiqua">Mua ngay</a>
                            </Link>
                          ) : null}
                        </li>
                      )
                    })
                  )}
                </ul>
              )}
              {loading && typeof action == 'string' && (action == '' || action == 'loadMore') ? (
                <PageLoading style={{ height: '150px' }} />
              ) : null}
            </div>
          </>
          {/* ) : ( */}
          <>
            {/* <div className="m-moblie-swapgift__tab">
                <ul className="clearfix">
                  <li
                    onClick={() => {
                      changeProductType(VOUCHER_TYPE.HOT)
                      setActive('voucher')
                    }}
                  >
                    <div className={`is-tab`}>
                      <span>Mua Voucher</span>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      changeProductType(VOUCHER_TYPE.HOT)
                    }}
                  >
                    <div className={`is-tab ${productStore?.productType == VOUCHER_TYPE.HOT ? 'is-active' : ''}`}>
                      <span>Mua hàng
                        <br /> online</span>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      changeProductType(VOUCHER_TYPE.NEW)
                    }}
                  >
                    <div className={`is-tab ${productStore?.productType == VOUCHER_TYPE.NEW ? 'is-active' : ''}`}>
                      <span>Mua
                        <br /> sản phẩm</span>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      changeProductType(VOUCHER_TYPE.FREE)
                    }}
                  >
                    <div
                      className={`is-tab ${
                        productStore?.productType == VOUCHER_TYPE.FREE
                          ? 'is-active'
                          : ''
                      }`}
                    >
                      <span>Miễn phí</span>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      changeProductType(VOUCHER_TYPE.ACCUMULATE)
                    }}
                  >
                    <div
                      className={`is-tab ${
                        productStore?.productType == VOUCHER_TYPE.ACCUMULATE
                          ? 'is-active'
                          : ''
                      }`}
                    >
                      <span>Tích điểm</span>
                    </div>
                  </li>
                  <li onClick={() => setCheckBtnBpoint(!checkBtnPoint)} className={checkBtnPoint ? 'active' : ''}>
                    <div className="is-tab">
                      <span>Khoảng giá</span>
                      <img src="/images/swapgift/ico-dropdown.png" />
                    </div>
                    <div className="m-table-point">
                      {Object.keys(OPTIONS_MONEY).map((key) => (
                        <span
                          onClick={() => filterPointProduct(key)}
                          className={`${key} ${checkKeyPoint == key ? 'active' : ''}`}
                          key={key}
                        >
                          {OPTIONS_MONEY[key]}
                        </span>
                      ))}
                    </div>
                  </li>
                </ul>
              </div> */}
            {/* <div className="m-moblie-swapgift__scroll">
                <div className="m-fix-border is-product">
                  <CategorySwiperProduct
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
              <div className="m-moblie-swapgift__product">
                {loading &&
                typeof action == 'string' &&
                (action == 'point' || action == 'type' || action == 'category') ? (
                  <PageLoading style={{ height: '150px' }} />
                ) : null}
                <ul className="clearfix">
                  {(productStore.activeProductArr ?? []).length <= 0 && !loading ? (
                    <span style={{ marginLeft: '10px' }}>Không có ưu đãi nào</span>
                  ) : (
                    (productStore.activeProductArr ?? []).map((item, idx) => {
                      return (
                        <li
                          ref={(productStore.activeProductArr ?? []).length == idx + 1 ? lastElementRefProduct : null}
                          key={`product-${item.name}-${item.id}`}
                        >
                          <Link href={`/doi-qua/san-pham/${item.id}`}>
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
                                  <div className="is-product__info__content">
                                  <span>
                                    Giảm 20% khi mua bánh Trung thu tại Homefood
                                  </span>
                                </div>
                                  {renderPaymentType(item)}
                                </div>
                              </div>
                            </a>
                          </Link>

                          {authStore && authStore.token ? (
                            <Link href={`/doi-qua/san-pham/${item.id}`}>
                              <a className="btn is-btn-doiqua">Mua ngay</a>
                            </Link>
                          ) : null}
                        </li>
                      )
                    })
                  )}
                </ul>
                {loading && typeof action == 'string' && (action == '' || action == 'loadMore') ? (
                  <PageLoading style={{ height: '150px' }} />
                ) : null}
              </div> */}
          </>
          {/* )} */}
        </div>
        {/* <FooterMobile activeMenu={2} /> */}
      </div>
      <Modal
        show={modalNotLinkPartner}
        onHide={() => setModalNotLinkPartner(false)}
        centered
        className="m-modal-charity is-qa is-detail"
      >
        <Modal.Body>
          <div className="m-modal-charity__input">
            <div className="m-modaltitle">Thông báo</div>
            <div className="m-modalbody">Ưu đãi này chưa có đường dẫn để nhận</div>
          </div>
          <div className="m-modal-charity__btn">
            <button onClick={() => setModalNotLinkPartner(false)} style={{ background: '#545454' }}>
              Đóng
            </button>
          </div>
          {loading ? <PageLoadingcss style={{ height: '60px' }} /> : null}
        </Modal.Body>
      </Modal>
      <Modal
        show={modalLienKet}
        onHide={() => handleModalLienKet(false)}
        centered
        className="m-modal-charity is-qa is-detail"
      >
        <Modal.Body>
          <div className="m-modal-charity__input">
            <div className="m-modaltitle">Thông báo</div>
            <div className="m-modalbody">Bạn phải liên kết số điện thoại để được tích điểm</div>
          </div>
          <div className="m-modal-charity__btn">
            <button
              onClick={() => {
                setLoadingLienKet(true)
                setTimeout(() => {
                  setLoadingLienKet(false)
                  router.push(`/tai-khoan`)
                }, 1000)
              }}
              style={{ background: '#141ed2' }}
            >
              Đồng ý
            </button>
            <button onClick={() => handleModalLienKet(false)} style={{ background: '#545454' }}>
              Huỷ
            </button>
          </div>
          {loadingLienKet ? <PageLoadingcss style={{ height: '60px' }} /> : null}
        </Modal.Body>
      </Modal>
      <PopupFix openPopupFix={openPopupFix} setOpenPopupFix={setOpenPopupFix} url={urlVoucherInfo} />
    </React.Fragment>
  )
}

export default inject(({ store }: { store: RootStoreHydration }) => ({
  voucherStore: store?.voucherStore,
  productStore: store?.productStore,
  globalStore: store?.globalStore,
  authStore: store?.authStore,
  loading: store.loading,
}))(observer(PageMobile))
