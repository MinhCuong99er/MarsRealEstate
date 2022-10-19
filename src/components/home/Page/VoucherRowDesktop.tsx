import React, { FC } from 'react'
import Link from 'next/link'
import { observer, inject } from 'mobx-react'
import VoucherList from '@src/components/common/VoucherList'
import { VoucherHydration } from '@src/stores/voucher.store'
import { ProductHydration } from '@src/stores/product.store'
import ProductList from '@src/components/common/ProductList'

interface VoucherRowDesktopProps {
  voucherStore?: VoucherHydration
  productStore?: ProductHydration
}

const VoucherRowDesktop: FC<VoucherRowDesktopProps> = (props: VoucherRowDesktopProps) => {
  const { voucherStore, productStore } = props
  return (
    <div className="d-voucher-hometab">
      <div className="d-voucher-hometab__rowb"></div>
      <div className="d-voucher-hometab__title" data-aos="zoom-in" data-aos-delay="10" data-aos-easing="linear">
        Ưu đãi VNDIRECT
      </div>
      <div
        className="d-voucher-hometab__voucher"
        /* data-aos="zoom-in"
        data-aos-delay="100"
        data-aos-easing="linear" */
      >
        <VoucherList data={voucherStore?.hots} lastElementRef={null} />
        {voucherStore?.hots?.length > 9 ? (
          <div className="d-voucher-hometab__more">
            <Link href="/doi-qua?type=voucher">
              <a>Xem thêm</a>
            </Link>
          </div>
        ) : null}
      </div>
      <div className="d-voucher-hometab__title" data-aos="zoom-in" data-aos-delay="10" data-aos-easing="linear">
        Ưu đãi khác
      </div>
      <div
        className="d-voucher-hometab__voucher"
        /* data-aos="zoom-in"
        data-aos-delay="100"
        data-aos-easing="linear" */
      >
        <ProductList data={productStore?.hots} lastElementRef={null} />
        {productStore?.hots?.length > 9 ? (
          <div className="d-voucher-hometab__more">
            <Link href="/doi-qua?type=product">
              <a>Xem thêm</a>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  productStore: store?.productStore,
}))(observer(VoucherRowDesktop))
