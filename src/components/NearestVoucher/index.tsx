import React, { FC, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
/* import numeral from 'numeral'
import { toastUtil } from '@src/helpers/Toast'
import * as utils from '@src/utils' */
// import PageDesktop from './PageDesktop'
import { PAGE_ERROR } from '@src/interfaces/enums'
import PageError from '@src/components/Error/PageError'
import PageMobile from './PageMobile'

export type IGeolocation = {
  lat?: number | null
  lng?: number | null
}

export interface SwapGiftProps {}

const SwapGift: FC<SwapGiftProps> = () => {
  const [geolocation, setGeolocation] = useState<IGeolocation>({})
  const [err, setErr] = useState<string>('')

  useEffect(() => {
    function success(pos) {
      const crd = pos.coords

      console.log('Your current position is:')
      console.log(`Latitude : ${crd.latitude}`)
      console.log(`Longitude: ${crd.longitude}`)
      console.log(`More or less ${crd.accuracy} meters.`)
      setGeolocation({
        lat: crd.latitude,
        lng: crd.longitude,
      })
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`)
      setErr('Không lấy được vị trí của bạn')
    }
    if (navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }

      navigator.geolocation.getCurrentPosition(success, error, options)
    }
  }, [])

  if (isMobile) {
    return <PageMobile geolocation={geolocation} geolocationErr={err} />
  }
  // return <PageDesktop geolocation={geolocation} geolocationErr={err} />
  return <PageError title={PAGE_ERROR.ONLY_MOBILE} />
}

export default SwapGift
