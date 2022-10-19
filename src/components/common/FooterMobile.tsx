import React, { FC } from 'react'
import Link from 'next/link'

interface FooterMobileProps {
  activeMenu?: any
}

const FooterMobile: FC<FooterMobileProps> = (props: FooterMobileProps) => {
  const { activeMenu } = props
  const menuList = [
    {
      id: 1,
      url: '/',
      logo: '/images/trang-chu.png?v=1.2',
      logoActive: '/images/trang-chu-active.png?v=1.2',
      name: 'Trang chủ',
      isNoti: 0,
    },
    {
      id: 2,
      url: '/doi-qua',
      logo: '/images/qua-san-pham.png?v=1.2',
      logoActive: '/images/qua-san-pham-active.png?v=1.2',
      name: 'Đổi quà',
      isNoti: 0,
    },
    {
      id: 3,
      url: '/thong-bao',
      logo: '/images/thong-bao.png?v=1.2',
      logoActive: '/images/thong-bao-active.png?v=1.2',
      name: 'Thông báo',
      isNoti: 0,
    },
    {
      id: 4,
      url: '/tai-khoan',
      logo: '/images/ca-nhan.png?v=1.2',
      logoActive: '/images/ca-nhan-active.png?v=1.2',
      name: 'Tài khoản',
      isNoti: 0,
    },
  ]
  return (
    <>
      <div style={{ height: '65px' }}></div>
      <div className="m-footer">
        <div className="container">
          <div className="m-footer__list">
            <ul className="clearfix">
              {menuList.map((item, index) => {
                const isActiveMenu = activeMenu === index + 1 ? true : false
                return (
                  <li key={index}>
                    <Link href={item.url}>
                      <div className="m-footer__item">
                        <img
                          src={isActiveMenu ? item.logoActive : item.logo}
                          className={`${isActiveMenu ? 'color-filter-image-footer' : ''}`}
                        />
                        <span className={`${activeMenu === index + 1 ? 'is-active' : ''}`}>{item.name}</span>
                        {item?.isNoti !== 0 ? <span className="is-noti">{item.isNoti}</span> : null}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default FooterMobile
