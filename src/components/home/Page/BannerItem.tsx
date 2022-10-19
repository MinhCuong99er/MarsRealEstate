import { BANNER_ACTION } from '@src/interfaces/enums'
import { IBanner } from '@src/interfaces/Global'
import React, { FC } from 'react'
import Link from 'next/link'
import { toJS } from 'mobx'

interface BannerItemProps {
  banner: IBanner
}

const BannerItem: FC<BannerItemProps> = (props: BannerItemProps) => {
  const { banner } = props
  console.log(toJS(banner), 'banner')

  switch (toJS(banner).action) {
    case BANNER_ACTION.VOUCHER_INFO:
      return (
        <Link href={`/doi-qua/${banner.actionData}`}>
          <a>
            <img src={banner.image} />
          </a>
        </Link>
      )
    case BANNER_ACTION.PRODUCT_INFO:
      return (
        <Link href="#">
          <a>
            <img src={banner.image} />
          </a>
        </Link>
      )
    case BANNER_ACTION.OPEN_URL:
      return (
        <a href={banner.actionData}>
          <img src={banner.image} />
        </a>
      )
    case BANNER_ACTION.REDIRECT:
      return (
        <Link href={banner.actionData}>
          <a>
            <img src={banner.image} />
          </a>
        </Link>
      )
    default:
      return (
        <Link href={'/'}>
          <a>
            <img src={banner.image} />
          </a>
        </Link>
      )
  }
}

export default BannerItem
