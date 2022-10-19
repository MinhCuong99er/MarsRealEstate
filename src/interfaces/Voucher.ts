import { VOUCHER_TYPES } from './enums'

export interface IVoucherInfo extends Record<string, any> {
  voucherInfo: Voucher
  partnerInfo?: Partner
  rateInfo?: Rate
  shopInfos?: Array<Shop>
}
export interface Voucher extends Record<string, any> {
  alt: string
  id: number
  images: string | Array<string>
  name: string
  partner: number
  category: number
  itemId?: number
  partnerId?: number
  payment?: string
  paymentPoint?: number
  paymentCash?: number
  startDate?: number
  endDate?: number
  hotSequence?: number
  isHot: false
  categoryId?: number
  codeType?: string
  /**
   * @param {type} loai voucher
   * @description {earn_on_ecom} tich diem
   */
  type?: VOUCHER_TYPES //'earn_on_ecom' | 'earn_off' | 'exchange_discount_percent'
  discountPercent?: number
  discountCash?: number
  billPointPercent?: number
  giftPoint?: number
  voucherId?: string
  area?: string
  campaignId?: number
  productIdsOfVoucher?: Array<number>
  typeVoucher?: string
  storeMyAppId?: number
  flagIds?: Array<number>
  amountCodeCreated?: number
  countdown: null
  isVna: false
  partnerName?: string
  partnerLogo?: string | Array<string>
  partnerSlogan?: string
  avgRate?: number
  purchased?: number
  total?: number
  action?: string

  createdAt?: number
  creatorId?: number
  daysOfMonth?: Array<number>
  description?: string
  endTime?: number | string
  isActive?: number | boolean
  isApprove?: number | boolean
  limiter?: number | string
  linkPartner?: string
  price?: number
  provider?: string
  shops?: Array<number>
  sourceId?: number
  startTime?: number
  subCategoryId?: number
  tags?: string
  thumbnail?: string
  turnGame?: number
  updatedAt?: number
  urlTemplate?: string
  value?: string
  weekdays?: Array<number>
  viettelPercent?: number
  viettelPoint?: number
}

export interface Partner extends Record<string, any> {
  alt?: string
  billPointPercent?: number
  createdAt?: number
  detail?: string
  email?: string
  hotSequence?: number
  id?: number
  isActive?: number | boolean
  logo?: string
  name?: string
  order?: number
  partnerId?: string
  phone?: string
  slogan?: string
  sourceId?: number
  updatedAt?: number
  website?: string
}

export interface Rate extends Record<string, any> {
  avgRate?: number
  countRate?: number
  createdAt?: number
  fiveStar?: number
  fourStar?: number
  id?: number
  itemGroupId?: number
  oneStar?: number
  purchased?: number
  threeStar?: number
  total?: number
  totalComment?: number
  totalLike?: number
  totalStar?: number
  twoStar?: number
  updatedAt?: number
  useQuantity?: number | boolean
}

export interface Shop extends Record<string, any> {
  address?: string
  createdAt?: number
  districtId?: number
  gps?: string
  id: number
  isActive: true
  name: string
  partnerId?: number
  phone?: string
  provinceId?: number
  provinceName?: string
  shopId?: string
  sourceId?: number
  updatedAt?: number
  wardId?: number
}
