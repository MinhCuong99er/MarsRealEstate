import React, { FC } from 'react'

interface IPageLoading {
  style?: any
}

const PageLoadingcss: FC<IPageLoading> = (props: IPageLoading) => {
  const { style } = props
  return (
    <div className="c-loadingcs" style={style}>
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default PageLoadingcss
