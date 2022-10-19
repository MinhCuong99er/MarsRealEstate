import React, { FC } from 'react'
import HeaderMobile from '@src/components/common/HeaderMoblie'

interface PageMobileProps {}

const PageMobile: FC<PageMobileProps> = (props: PageMobileProps) => {
  const {} = props

  return (
    <React.Fragment>
      <div className="m-body">
        <HeaderMobile title={'demo'} />
      </div>
    </React.Fragment>
  )
}

export default PageMobile
