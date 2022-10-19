import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
import VoucherList from '@src/components/common/VoucherListMoblie'
import ProductList from '@src/components/common/ProductListMoblie'
import { VoucherHydration } from '@src/stores/voucher.store'
import { ProductHydration } from '@src/stores/product.store'

interface VoucherListBoxHomeMobileProps {
  type?: string
  titleHeader?: any
  voucherStore?: VoucherHydration
  productStore?: ProductHydration
}

const VoucherListBoxHomeMobile: FC<VoucherListBoxHomeMobileProps> = (props: VoucherListBoxHomeMobileProps) => {
  const { type, titleHeader, voucherStore, productStore } = props
  const mobileVoucherData = voucherStore?.hots ?? []
  if (mobileVoucherData.length >= 9) {
    mobileVoucherData.splice(mobileVoucherData.length - 1, 1)
  }
  const mobileProductData = productStore?.hots ?? []
  if (mobileProductData.length >= 9) {
    mobileVoucherData.splice(mobileProductData.length - 1, 1)
  }
  return (
    <>
      <div className="m-voucher-home">
        <div className="m-voucher-home__title">{titleHeader || ''}</div>
        {type === 'voucher' ? <VoucherList data={mobileVoucherData} /> : <ProductList data={mobileProductData} />}
      </div>
    </>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  productStore: store?.productStore,
}))(observer(VoucherListBoxHomeMobile))
