import React, { FC, useState } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import { useRouter } from 'next/router'
import get from 'lodash/get'
import _ from 'lodash'
import numeral from 'numeral'
import moment from 'dayjs'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { toastUtil } from '@src/helpers/Toast'
import { Product } from '@src/interfaces/Product'
import AuthStore from '@src/stores/auth.store'
numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface PageMobileProps {
  productStore?: {
    detail?: any
  }
  authStore?: AuthStore
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { productStore, authStore } = props
  const router = useRouter()
  const productDetailData = productStore.detail
  const productInfo = get(productDetailData, 'productInfos', []) || []
  const productTypeInfo = get(productDetailData, 'productTypeInfo', {}) || {}
  const storeInfo = get(productDetailData, 'storeInfo', {}) || {}
  const attributeInfos = get(productDetailData, 'attributeInfos', []) || []
  const attributeValueInfos = get(productDetailData, 'attributeValueInfos', []) || []
  const productAttributeValueInfos = get(productDetailData, 'productAttributeValueInfos', []) || []
  // const partnerInfo = get(productDetailData, 'partnerInfo', {}) || {}
  // const rateInfo = get(voucherDetailData, 'rateInfo', {}) || {}
  const shopInfos = get(productDetailData, 'shopInfos', []) || []
  const [btnMore, setBtnMore] = useState(false)
  const [selectedProduct, setProduct] = useState<Product>(productInfo[0] || {})
  const [attributeValueInfoss, setAttributeValueInfoss] = useState(attributeValueInfos || [])
  const [selectedProductId, setSelectedProductId] = useState<number>(
    productInfo.length === 1 ? productInfo[0].id : null
  )

  const onAttributeValueClick = (index) => {
    const clone = [...attributeValueInfoss]
    const clickedAv = clone[index]
    clickedAv.selected = !clickedAv.selected
    //disable same attribute id
    clone.forEach((a) => {
      if (a.attributeId === clickedAv.attributeId && a.id !== clickedAv.id) {
        a.selected = false
      }
    })
    const productAv = {},
      attributeAv = {},
      productMap = {},
      selectedAvIds = []
    productAttributeValueInfos.forEach((p) => {
      if (!productAv[p.productId]) {
        productAv[p.productId] = []
      }
      productAv[p.productId].push(p.attributeValueId)
    })
    clone.forEach((a) => {
      if (!attributeAv[a.attributeId]) {
        attributeAv[a.attributeId] = []
      }
      attributeAv[a.attributeId].push(a.id)
    })
    //create attribute value relation
    const avr = {}
    for (const p in productAv) {
      productMap[productAv[p].sort().join('-')] = p
      const pav = productAv[p]
      for (let i = 0; i < pav.length - 1; i++) {
        for (let j = i + 1; j < pav.length; j++) {
          //make i-j relation
          if (!avr[pav[i]]) {
            avr[pav[i]] = []
          }
          if (!avr[pav[j]]) {
            avr[pav[j]] = []
          }
          avr[pav[i]].push(pav[j])
          avr[pav[j]].push(pav[i])
        }
      }
    }
    for (const p in attributeAv) {
      const pav = attributeAv[p]
      for (let i = 0; i < pav.length - 1; i++) {
        for (let j = i + 1; j < pav.length; j++) {
          //make i-j relation
          if (!avr[pav[i]]) {
            avr[pav[i]] = []
          }
          if (!avr[pav[j]]) {
            avr[pav[j]] = []
          }
          avr[pav[i]].push(pav[j])
          avr[pav[j]].push(pav[i])
        }
      }
    }

    //find all available av
    const avArray = []
    clone.forEach((av) => {
      if (av.selected) {
        selectedAvIds.push(av.id)
        avArray.push(avr[av.id])
      }
    })
    if (!selectedAvIds.length) {
      clone.map((i) => {
        i.disabled = false
      })
      setSelectedProductId(null)
    } else {
      const activeAvIds = _.intersection(...avArray)
      clone.forEach((av) => {
        if (activeAvIds.includes(av.id)) {
          av.disabled = false
        } else {
          if (!av.selected) {
            av.disabled = true
          }
        }
      })
      //find selected product
      const key = selectedAvIds.sort().join('-')
      const selectedProductId = Number(productMap[key])
      for (let i = 0; i < productInfo.length; i++) {
        if (productInfo[i].id === selectedProductId) {
          setProduct(productInfo[i])
          setSelectedProductId(productInfo[i])
        }
      }
      setSelectedProductId(selectedProductId)
    }
    setAttributeValueInfoss(clone)
  }

  const renderPaymentType = (item: Product) => {
    switch (item?.payment) {
      // case 'point':
      // default:
      //   return (
      //     <div className="is-text">
      //       <span>Số tiền cần đổi </span>
      //       <span>
      //         {numeral(item?.paymentPoint ?? 0).format('0,0')}
      //         <span className="c-pointlogo">đ</span>
      //       </span>
      //     </div>
      //   )
      case 'cash':
      default:
        return (
          <div className="d-block">
            {productTypeInfo?.percentAccumlatePoints ? (
              <div className="is-text">
                <span>Tích điểm </span>
                <span>{numeral(productTypeInfo?.percentAccumlatePoints ?? 0).format('0,0')}%</span>
              </div>
            ) : null}
            <div className="is-text">
              <span>Số tiền </span>
              <span>{numeral(item?.paymentCash ?? 0).format('0,0')} Vnđ</span>
            </div>
          </div>
        )
      case 'free':
        return (
          <div className="is-text">
            <span>Miễn phí</span>
          </div>
        )
    }
  }

  return (
    <>
      <div className="m-body">
        <HeaderMobile title={'Chi tiết sản phẩm'} />
        <div className="m-offer">
          <div className="m-offer__top is-remove-border">
            <div className="m-offer__top__img">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
              >
                {get(selectedProduct, 'images', '')?.length != 0
                  ? get(selectedProduct, 'images', '').map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <div className="m-offer__top__img__outer is-product">
                            <img src={item} />
                          </div>
                        </SwiperSlide>
                      )
                    })
                  : get(productTypeInfo, 'images', '').map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <div className="m-offer__top__img__outer is-product">
                            <img src={item} />
                          </div>
                        </SwiperSlide>
                      )
                    })}
              </Swiper>
            </div>
            <div className="m-offer__top__text is-remove-paddingbottom" style={{ paddingLeft: '10px' }}>
              <div className="m-offer__top__text__left">
                <span style={{ marginLeft: 0 }}>{selectedProduct?.name}</span>
              </div>
              {/* <div className="m-offer__top__text__right">
                <img src="/images/charity2-love.png" />
                <a href="/#">
                  <img src="/images/charity2-share.png" />
                </a>
              </div> */}
            </div>
          </div>
          <div className="m-offer__mid is-product-detail is-remove-border">
            <div className="m-offer__mid__bot">
              {renderPaymentType(selectedProduct)}
              {authStore && authStore.token ? (
                <button
                  onClick={() => {
                    if (!selectedProductId) {
                      toastUtil.error('Hãy chọn 1 loại sản phẩm')
                    } else {
                      router.push(`/doi-qua/san-pham/${productTypeInfo?.id}/${selectedProductId}/chi-tiet`)
                    }
                  }}
                >
                  Mua ngay
                </button>
              ) : null}
            </div>
          </div>
          <div className="m-offer__bot">
            <ul>
              {productInfo.length > 1
                ? attributeInfos.map((att, attIndex) => (
                    <li key={attIndex}>
                      <div className="is-text">
                        <div className="is-text__title">
                          <span>Chọn {att.name}</span>
                        </div>
                        <div className="c-choose-producttype">
                          <div className="clearfix">
                            {attributeValueInfos.map((attVal, attValIndex) => {
                              if (attVal.attributeId !== att.id) return null
                              return (
                                <div
                                  className={`is-item-type ${attVal.selected ? 'active' : ''}`}
                                  key={`product-type-${attValIndex}`}
                                >
                                  <button
                                    className={`btn btn-secondary`}
                                    disabled={attVal.disabled}
                                    onClick={() => {
                                      onAttributeValueClick(attValIndex)
                                    }}
                                  >
                                    {attVal.name}
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                : null}
              <li className="is-remove-border">
                <div className="is-text">
                  <div className="is-text__title">
                    <span>Chi tiết sản phẩm</span>
                  </div>
                  <div style={{ lineHeight: '1.4' }} className="is-text__content">
                    <span>
                      Ngày bắt đầu:{' '}
                      {moment(get(productTypeInfo, 'startDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                      <br />
                      Ngày kết thúc:{' '}
                      {moment(get(productTypeInfo, 'endDate', '')).format('DD-MM-YYYY') || 'Đang cập nhật'}
                      <br />
                      Thương hiệu: {get(storeInfo, 'name', '') || 'Đang cập nhật'}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className="is-text">
                  <div className="is-text__title">
                    <span>Mô tả sản phẩm</span>
                  </div>
                  <pre style={{ lineHeight: '1.4' }} className="is-text__content b-maincontent">
                    {get(productTypeInfo, 'description', '')}
                  </pre>
                </div>
              </li>
              {/* {get(partnerInfo, 'detail', '') ? (
                <li>
                  <div className="is-text">
                    <div className="is-text__title">
                      <span>Về {get(partnerInfo, 'name', '')}</span>
                    </div>
                    <div
                      style={{ lineHeight: '1.4' }}
                      className="is-text__content b-maincontent"
                      dangerouslySetInnerHTML={{
                        __html: `${get(partnerInfo, 'detail', '')}`,
                      }}
                    ></div>
                  </div>
                </li>
              ) : null} */}
              {shopInfos.length > 0 ? (
                <li>
                  <div className="is-text">
                    <div className="is-text__title">
                      <span>Địa chỉ Áp dụng</span>
                    </div>
                    <div style={{ lineHeight: '1.4' }} className="is-text__content b-maincontent">
                      {btnMore
                        ? shopInfos.map((item, index) => {
                            return <p key={index}>{item?.address}</p>
                          })
                        : shopInfos.slice(0, 3).map((item, index) => {
                            return <p key={index}>{item?.address}</p>
                          })}
                    </div>
                  </div>
                  {shopInfos.length > 3 ? (
                    <span onClick={() => setBtnMore(!btnMore)} className="c-voucher-loadmore">
                      {btnMore ? 'Ẩn' : 'Xem thêm'}
                    </span>
                  ) : null}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default inject(({ store }) => ({
  productStore: store?.productStore,
  authStore: store?.authStore,
}))(observer(PageMobile))
