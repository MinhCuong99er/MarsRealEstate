import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderMobile from '@src/components/common/HeaderMoblie'
import ListVoucher from '@src/components/CharityInfo/VoucherCharity'
import FooterMobile from '@src/components/common/FooterMobile'
import { CharityHydration } from '@src/stores/charity.store'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'

interface PageMobileProps {
  charityStore?: CharityHydration
  loading?: boolean
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { charityStore, loading } = props

  const handleLoadMore = () => {
    charityStore?.loadMore()
  }
  const hasMoreItems = charityStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={'Đóng góp vì cộng đồng'} />
        <div className="d-content">
          <div className="container">
            <div className="d-charity">
              <div className="d-charity__list">
                <ListVoucher data={charityStore.charities} isLoading={loading} lastElementRef={lastElementRef} />
              </div>
            </div>
          </div>
        </div>
        <FooterMobile activeMenu={1} />
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  charityStore: store?.charityStore,
  loading: store.loading,
}))(observer(PageMobile))
