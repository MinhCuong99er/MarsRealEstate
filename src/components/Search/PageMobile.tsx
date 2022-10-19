import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
import { useRouter } from 'next/router'
import HeaderMobile from '@src/components/common/HeaderMoblie'
// import FooterMobile from '@src/components/common/FooterMobile'
import { VoucherHydration } from '@src/stores/voucher.store'
import VoucherList from '../common/VoucherList'
import useInfiniteScroll from '@src/helpers/hook/useInfiniteScroll'

interface PageMobileProps {
  voucherStore?: VoucherHydration
  loading?: boolean
}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const { voucherStore, loading } = props
  const router = useRouter()

  const handleLoadMore = () => {
    voucherStore?.loadMoreSearch?.(router?.query?.search.toString() ?? '')
  }
  const hasMoreItems = voucherStore?.hasMoreItems
  const [lastElementRef] = useInfiniteScroll(hasMoreItems ? handleLoadMore : () => {}, loading)

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={router?.query?.search ? `Tìm kiếm: ${router.query.search}` : 'Tìm kiếm'} />
        <br />
        <VoucherList data={voucherStore?.hots} isLoading={loading} lastElementRef={lastElementRef} />
        {/* <FooterMobile activeMenu={4} /> */}
      </div>
    </React.Fragment>
  )
}

export default inject(({ store }) => ({
  voucherStore: store?.voucherStore,
  loading: store.loading,
}))(observer(PageMobile))
