import React, { FC } from 'react'
import Link from 'next/link'

interface MenuBoxMobileProps {}

const MenuBoxMobile: FC<MenuBoxMobileProps> = (props: MenuBoxMobileProps) => {
  const {} = props
  return (
    <div className="md-userpage-menu">
      <ul className="clearfix">
        <li>
          <Link href="/uu-dai-cua-toi">
            <a>
              <span>Ưu đãi của tôi</span>
              <i className="nav-right"></i>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/trang-thai-don-hang">
            <a>
              <span>Trạng thái đơn hàng</span>
              <i className="nav-right"></i>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/lich-su-diem">
            <a>
              <span>Lịch sử giao dịch điểm</span>
              <i className="nav-right"></i>
            </a>
          </Link>
        </li>
        {/* <li>
          <Link href="/diem-va-xep-hang">
            <a>
              <span>Điều kiện nâng hạng và quyền lợi</span>
              <i className="nav-right"></i>
            </a>
          </Link>
        </li> */}

        {/* <li>
          <Link href="/dieu-khoan">
            <a>
              <span>Điều kiện điều khoản</span>
              <i className="nav-right"></i>
            </a>
          </Link>
        </li> */}
      </ul>
    </div>
  )
}

export default MenuBoxMobile
