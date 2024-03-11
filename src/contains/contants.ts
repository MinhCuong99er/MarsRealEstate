import { LANGUAGE } from '@src/interfaces/enums'

export const DEFAULT_WAIT_SECONDS = 500
export const DEFAULT_ERROR_MESSAGE = 'Hệ thống đang bận vui lòng thực hiện sau'

export const RULE_PHONE = {
  pattern: /^[0-9]{1,20}$/,
  message: 'Quý khách vui lòng điền đúng ID của người nhận.',
}

export const RULE_EMAIL = {
  pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+.+.[A-Za-z]{2,4}/,
  message: 'Email không đúng định dạng.',
}

export const LANGUAGE_ARRAY = [LANGUAGE.VI, LANGUAGE.EN]
