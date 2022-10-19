import { MY_VOUCHER_USED } from '../enums'
import { ListParam } from './common.dto'

export interface ListVoucherParams extends ListParam {
  /**
    @params {number} isHot - 1 or 0
    @description 1:hot nhất
  */
  isHot?: number
  /**
    @params {string} types - earn_on_ecom,exchange_discount_percent,earn_off
    @description tích điểm hoặc ưu đãi khóa học
  */
  types?: string
  /**
    @params {string} types - earn_on_ecom,exchange_discount_percent,earn_off
    @description tích điểm hoặc ưu đãi khóa học
  */
  pointType?: string
  /**
    @params {string} payment - free
    @description miễn phí
  */
  payment?: string
  /**
    @params {number | boolean} used - 1 or 0
    @description ưu đãi 1: đã sử dụng, 0: chưa sử dụng
  */
  used?: MY_VOUCHER_USED
  /**
    @params voucherName ''
    @description tên ưu đãi
  */
  voucherName?: ''
  /**
    @params {string} ''
    @description tìm keyword
  */
  keyword?: string
  /**
    @params {number}
    @description search theo điểm bắt đầu
  */
  fromPoint?: number
  /**
    @params {number}
    @description search theo điểm giới hạn
  */
  toPoint?: number
  /**
    @params {number} categoryId - id danh mucj
    @description search theo danh mục
  */
  categoryId?: number
  /**
    @params {maxDistance} number - khoảng cách
    @description bán kính search
  */
  maxDistance?: number
  /**
    @params {sort} xắp xếp
    @description xắp xếp theo location
  */
  sort?: 'location'
  /**
    @params {lat} number - kinh độ
    @description kinh độ
  */
  lat?: number
  /**
    @params {lng} number - vĩ độ
    @description vĩ độ
  */
  lng?: number
}

export interface OrderVoucherParams {
  address: string
  listOrderItems: Array<{
    type: string
    typeId: number
    quantity: number
  }>
  provinceId: number
  districtId: number
  wardId: number
  receiveEmail: string
  receiveName: string
  receivePhone: string
}

export interface PayVoucherParams {
  orderId: number
  note?: string
  appReturnUrl?: string
}
