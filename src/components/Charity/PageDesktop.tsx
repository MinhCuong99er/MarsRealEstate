import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import ListVoucher from '@src/components/CharityInfo/VoucherCharity'
import { CharityHydration } from '@src/stores/charity.store'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'
import Breadcrumb from '@src/components/common/Breadcrumb'

interface PageDesktopProps {
  charityStore?: CharityHydration
  loading?: boolean
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const { charityStore, loading } = props

  const handleLoadMore = () => {
    charityStore?.loadMore()
  }
  const hasMoreItems = charityStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <Breadcrumb nameLink={`Đóng góp vì cộng đồng`} link={'/tu-thien-vi-cong-dong'} />
          <div className="container">
            <div className="d-charity">
              <div className="d-charity__title">
                <span>Đóng góp vì cộng đồng</span>
              </div>
              <div className="d-charity__list">
                <ListVoucher data={charityStore.charities} isLoading={loading} lastElementRef={lastElementRef} />
              </div>
            </div>
          </div>
        </div>
        <FooterDesktop />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  charityStore: store?.charityStore,
  loading: store.loading,
}))(observer(PageDesktop))
