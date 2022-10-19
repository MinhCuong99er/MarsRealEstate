import { ListParam } from './common.dto'

export interface ListProductParams extends ListParam {
  campaignId?: number
  isHot?: number
  keywords?: string
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

export interface CalculatePriceParams {
  discountCode: string
  districtId: number
  listOrderItems: Array<{
    type: string
    typeId: number
    quantity: number
  }>
  mpoint: number
  provinceId: number
  storeOrders: Array<{
    storeId: number
    codeShip: string
    note: string
  }>
  wardId: number
}

export interface CreateOrderParams {
  address: string
  discountCode: string
  districtId: number
  listOrderItems: Array<{
    type: string | 'product'
    typeId: number
    quantity: number
  }>
  methodPayment: string | 'online' | 'cod'
  mpoint: number
  provinceId: number
  receiveEmail: any
  receiveName: any
  receivePhone: any
  storeOrders: Array<{
    storeId: number
    codeShip: string
    note: string
  }>
  wardId: number
  /**
   * Url return khi thanh toán thành công
   * @params {string} appReturnUrl
   */
  appReturnUrl?: string
}

export interface PayOrderParams {
  orderId: number
  /**
   * Url return khi thanh toán thành công
   * @params {string} appReturnUrl
   */
  appReturnUrl?: string
}
