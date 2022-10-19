import React, { FC } from 'react'

interface PageErrorProps {
  title?: string
}

const PageError: FC<PageErrorProps> = (props: PageErrorProps) => {
  const { title } = props
  return (
    <div className="d-flex flex-column justify-content-center align-items-center height-full-screen">
      <div>
        <img src="/images/404.png" width={350} />
      </div>
      <h1>{title}</h1>
    </div>
  )
}

export default PageError
