import React, { FC } from 'react'

interface IPage404 {}

const Page404: FC<IPage404> = (props: IPage404) => {
  const {} = props
  return (
    <div className="d-flex flex-column justify-content-center align-items-center height-full-screen">
      <div>
        <img src="/images/404.png" width={350} />
      </div>
      <h1>Trang bạn tìm không tồn tại!</h1>
    </div>
  )
}

export default Page404
