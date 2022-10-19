import dayjs from 'dayjs'
import { cryptoUtils } from './cryptoUtils'
import Config from '@src/contains/Config'

export const checkSum = (phone: string) => {
  const secretKey = Config.serverRuntimeConfig.SECRET_KEY_CONFIRM
  return cryptoUtils.hmacsha1(phone + secretKey + dayjs().format('DD/MM/YYYY'), secretKey)
}

export const hashWhenOtp = (phone: string) => {
  const secretKey = Config.publicRuntimeConfig.SECRET_KEY_OTP
  return cryptoUtils.md5Npm(phone + secretKey + dayjs().format('DD/MM/YYYY'))
  // return cryptoUtils.md5(phone + secretKey + dayjs().format('DD/MM/YYYY'))
}
