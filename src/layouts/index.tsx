import React, { FC } from 'react'
import { ToastContainer } from '@src/helpers/Toast'
import Footer from './Footer'
import Header from './Header'

interface LayoutProps {
  children: React.ReactChild
}

const Layout: FC<LayoutProps> = (props: LayoutProps) => {
  const {} = props

  return (
    <React.Fragment>
      <Header />
      {props.children}
      <Footer />
      <ToastContainer />
    </React.Fragment>
  )
}

export default Layout
