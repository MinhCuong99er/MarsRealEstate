import React, { FC } from 'react'
import { isMobile } from 'react-device-detect'

interface IPageLoading {
  style?: any
}

const PageLoading: FC<IPageLoading> = (props: IPageLoading) => {
  const { style } = props
  if (isMobile) {
    return (
      <div className="c-loadingcs">
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
  return (
    <React.Fragment>
      <div className="loader loading" style={style}>
        <img src="/loader.svg" alt="loader" />
      </div>
    </React.Fragment>
  )
}

export default PageLoading
