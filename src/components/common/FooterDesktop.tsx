import React, { FC } from 'react'
import Link from 'next/link'

interface FooterDesktopProps {}

const FooterDesktop: FC<FooterDesktopProps> = (props: FooterDesktopProps) => {
  const {} = props

  return (
    <div className="d-footer">
      <div className="container">
        <div className="d-footer-box">
          <Link href="/">
            <a style={{ textDecoration: 'none' }}>
              {/* <img src="/images/logo-footer.png?v=1.2" /> */}
              <span style={{ color: '#fff', fontSize: '30px' }}>MPOINT</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FooterDesktop
