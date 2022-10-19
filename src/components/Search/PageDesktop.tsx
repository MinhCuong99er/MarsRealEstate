import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
import HeaderHomeDesktop from '@src/components/common/HeaderHomeDesktop'
import FooterDesktop from '@src/components/common/FooterDesktop'
import VoucherList from '@src/components/common/VoucherList'
import { VoucherHydration } from '@src/stores/voucher.store'
import { useRouter } from 'next/router'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'

interface PageDesktopProps {
  voucherStore?: VoucherHydration
  loading?: boolean
}

const PageDesktop: FC<PageDesktopProps> = (props: PageDesktopProps) => {
  const { voucherStore, loading } = props
  const router = useRouter()

  const handleLoadMore = () => {
    voucherStore?.loadMoreSearch?.(router?.query?.search.toString() ?? '')
  }
  const hasMoreItems = voucherStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  return (
    <React.Fragment>
      <div className="d-body">
        <HeaderHomeDesktop />
        <div className="d-content">
          <div className="d-voucher-hometab">
            <div className="d-voucher-hometab__rowb"></div>
            <div className="d-voucher-hometab__title" data-aos="fade-up" data-aos-delay="500">
              {router?.query?.search ? `Tìm kiếm: ${router.query.search}` : 'Tìm kiếm'}
            </div>
          </div>
          <br />
          <VoucherList data={voucherStore?.hots} isLoading={loading} lastElementRef={lastElementRef} />
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
