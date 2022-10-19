import React, { FC } from 'react'
// import Link from 'next/link'
import { observer, inject } from 'mobx-react'
import numeral from 'numeral'
import { AuthHydration } from '@src/stores/auth.store'
import MenuMobile from '../home/Page/MenuMobile'
numeral.zeroFormat('0')
numeral.nullFormat('N/A')

interface HeaderHomeMobileProps {
  authStore?: AuthHydration
}

const HeaderHomeMobile: FC<HeaderHomeMobileProps> = (props: HeaderHomeMobileProps) => {
  // const router = useRouter()
  const {} = props

  /* const refreshInfo = async () => {
    await flowResult(authStore?.getCustomerInfo())
  }

  useEffect(() => {
    if (
      !authStore?.token ||
      !authStore?.tokenPayload ||
      !authStore?.tokenPayload.phone ||
      !authStore?.tokenPayload.refId ||
      !authStore?.tokenPayload.voucherId ||
      !Object.keys(authStore?.tokenPayload).length
    ) {
      const a = setTimeout(() => {
        router.replace('/404')
      }, 1000)
      return () => clearTimeout(a)
    }
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
      <div className="m-header-home is-swap-gift-page">
        <div className="container">
          {/* <div className="m-header-home__logo">
            <Link href="/">
              <a>
                <img src="/images/logo.png?v=1.2" />
              </a>
            </Link>
          </div> */}
          {/* <div className="m-header-home__info">
            <div className="m-header-home__info__item">
            <img src="/images/star-home-header.png" />
            <span>Hạng</span>
            <b>{authStore?.currentTier?.name ?? 'N/A'}</b>
          </div>
            <div className="m-header-home__info__item">
              <img src="/images/point-home-header.png?v=1.1" />
              <span>Số điểm:</span>
              <b>{numeral(authStore?.auth?.point ?? 0).format('#,#')}</b>
              <span className="c-pointlogo">đ</span>
            </div>
          </div> */}
          <MenuMobile />
        </div>
      </div>
    </>
  )
}

export default inject(({ store }) => ({
  authStore: store?.authStore,
}))(observer(HeaderHomeMobile))
