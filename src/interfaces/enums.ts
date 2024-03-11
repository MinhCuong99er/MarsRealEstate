export enum TRANSACTION_TYPE {
  ACCUMULATE = 'accumulate',
  EXCHANGE = 'exchange',
}

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum CartType {
  PRODUCT = 'product',
  VOUCHER = 'voucher',
}

export enum VOUCHER_TYPE {
  HOT = 'hot',
  NEW = 'new',
  FREE = 'free',
  ACCUMULATE = 'accumulate',
  NEAREST = 'nearest',
}

export enum VOUCHER_TYPES {
  EARN_OFF = 'earn_off',
  EXCHANGE_DISCOUNT_PERCENT = 'exchange_discount_percent',
  EARN_ON_ECOM = 'earn_on_ecom',
}

export enum BANNER_ACTION {
  VOUCHER_INFO = 'voucherInfo',
  OPEN_URL = 'openUrl',
  PRODUCT_INFO = 'productInfo',
  REDIRECT = 'redirect',
}

export enum STATE {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DONE = 'done',
  ERROR = 'error',
}

export enum MY_VOUCHER_USED {
  USED = 1,
  NOT_USED = 0,
}

export enum VOUCHER_CODE_INFO_ACTION {
  SHOW_WEB = 'show_web',
  SHOW_CODE = 'show_code',
}

export enum PAGE_ERROR {
  PAGE_404 = 'Trang bạn tìm không tồn tại!',
  ONLY_MOBILE = 'Web chỉ hỗ trợ trên nền tảng Mobile!',
}

export enum PAYMENT_METHOD {
  COD = 'cod',
  ONLINE = 'online',
}

export enum PAYMENT_METHOD_SHOW {
  COD = 'Thanh toán khi nhận hàng',
  ONLINE = 'Thanh toán online',
}

export enum LANGUAGE {
  VI = 'vi',
  EN = 'en',
}
