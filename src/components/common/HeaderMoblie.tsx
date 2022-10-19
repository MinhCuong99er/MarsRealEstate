import React, { FC, useState } from 'react'
import { Nav } from 'react-bootstrap'
import { useRouter } from 'next/router'
// import { flowResult } from 'mobx'
import { inject, observer } from 'mobx-react'
import { AuthHydration } from '@src/stores/auth.store'
// import { DEFAULT_REFRESH_INFO } from '@src/contains/contants'

interface HeaderMobileProps {
  title?: any
  authStore?: AuthHydration
}

const HeaderMobile: FC<HeaderMobileProps> = (props: HeaderMobileProps) => {
  const {
    title,
    /* authStore */
  } = props
  const router = useRouter()
  const [menuOpen /*setMenuOpen*/] = useState(false)
  /* const refreshInfo = async () => {
    await flowResult(authStore?.getCustomerInfo())
  }

  useEffect(() => {
    refreshInfo()
    const refreshInfoSubcrice = setInterval(() => {
      async function anyName() {
        await flowResult(authStore?.getCustomerInfo())
      }
      anyName()
    }, DEFAULT_REFRESH_INFO)

    return () => clearInterval(refreshInfoSubcrice)
  }, []) */

  return (
    <>
      <div className="m-header-moblie">
        {/* <img
          onClick={() => router.back()}
          src="/images/icon-back-moblie.png?v=1.1"
        /> */}
        {/* <i className="bi bi-list" onClick={() => setMenuOpen(!menuOpen)}></i> */}
        <i className="bi bi-arrow-left" onClick={() => router.back()}></i>
        <span>{title}</span>
        {/* <span>
          <img onClick={() => router.push('/')} src="/images/logo-mpoint.png?v=1.1" height={60} />
        </span> */}
      </div>
      <Nav className={`m-header-nav ${menuOpen ? 'flex-column' : 'd-none'}`} defaultActiveKey="/">
        <Nav.Item>
          <Nav.Link href="/">Trang chủ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>Ưu đãi</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>Sản phẩm</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/uu-dai-cua-toi">Ưu đãi của tôi</Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
}))(observer(HeaderMobile))
