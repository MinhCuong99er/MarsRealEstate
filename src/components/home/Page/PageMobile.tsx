import React, { FC } from 'react'
import HeaderHomeMobile from '@src/components/common/HeaderHomeMobile'
// import MenuMobile from './MenuMobile'
import FooterMobile from '@src/components/common/FooterMobile'
import VoucherListBoxHomeMobile from './VoucherListBoxHomeMobile'
import BannerMenuMobile from './BannerMenuMobile'
interface PageMobileProps {}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const {} = props
  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderHomeMobile />
        <BannerMenuMobile />
        <VoucherListBoxHomeMobile type="voucher" titleHeader="Ưu đãi Voucher" />
        <VoucherListBoxHomeMobile type="product" titleHeader="Ưu đãi sản phẩm" />
        <FooterMobile activeMenu={1} />
      </div>
    </React.Fragment>
  )
}

export default PageMobile
