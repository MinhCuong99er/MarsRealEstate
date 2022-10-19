import React, { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer } from '@src/helpers/Toast'
import { inject, observer } from 'mobx-react'
import AuthStore from '@src/stores/auth.store'
import { flowResult } from 'mobx'
import { DEFAULT_REFRESH_INFO } from '@src/contains/contants'
import RootStore from '@src/stores/RootStore'

interface LayoutProps {
  children: React.ReactChild
  authStore?: AuthStore
}

const Layout: FC<LayoutProps> = (props: LayoutProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter()
  const { authStore } = props

  const refreshInfo = async () => {
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
      // const a = setTimeout(() => {
      //   router.push('/404')
      // }, 1000)
      // return () => clearTimeout(a)
    }
    refreshInfo()
    const refreshInfoSubcrice = setInterval(() => {
      async function anyName() {
        await flowResult(authStore?.getCustomerInfo())
      }
      anyName()
    }, DEFAULT_REFRESH_INFO)

    return () => clearInterval(refreshInfoSubcrice)
  }, [])

  // if (
  //   !authStore?.token ||
  //   !authStore?.tokenPayload ||
  //   !authStore?.tokenPayload.phone ||
  //   !authStore?.tokenPayload.refId ||
  //   !authStore?.tokenPayload.voucherId ||
  //   !Object.keys(authStore?.tokenPayload).length
  // ) {
  //   return null
  // }
  return (
    <React.Fragment>
      {props.children}
      <ToastContainer />
    </React.Fragment>
  )
}

// export default Layout
export default inject(({ store }: { store: RootStore }) => ({
  authStore: store?.authStore,
}))(observer(Layout))
