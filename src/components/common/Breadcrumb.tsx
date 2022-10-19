import React, { FC } from 'react'
import Link from 'next/link'

interface BreadcrumbProps {
  nameLink?: string
  link?: string
}

const Breadcrumb: FC<BreadcrumbProps> = (props: BreadcrumbProps) => {
  const { nameLink, link } = props
  return (
    <div className="md-breadcrumb">
      <div className="container">
        <div className="">
          <ul className="clearfix">
            <li>
              <Link href="/">
                <a>
                  <span>Trang chủ</span>
                  <img src="/images/breadcrumb-arow.png" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={`${link}`}>
                <a>
                  <span>{nameLink}</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb
