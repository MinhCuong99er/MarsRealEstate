import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { isMobile } from 'react-device-detect'

interface PageErrorProps {
  title: string
}

const PageError: FC<PageErrorProps> = (props: PageErrorProps) => {
  const { title } = props
  const router = useRouter()
  return (
    <div className="c-error-page">
      <div className="is-image">
        <img src="/images/404.png" />
      </div>
      <div className="is-content">
        <div className="container">
          <h1>{title}</h1>
          {isMobile ? (
            <div className="is-btn-group">
              <div className="c-btn is-back-btn" onClick={() => router.back()}>
                Quay lại
              </div>
              <Link href="/">
                <a className="c-btn">Trở về trang chủ</a>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default PageError
