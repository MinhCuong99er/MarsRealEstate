export interface Product {
  id: number
  name: string
  createdAt?: number
  updatedAt?: number
  itemId?: number
  categoryId?: number
  subCategoryId: number
  description: string
  images?: string[]
  isActive?: true
  hotSequence?: number
  isHot?: boolean
  thumbnail?: string
  payment?: 'point' | 'cash' | 'free' | 'both'
  paymentPoint?: number
  paymentCash?: number
  originPrice?: number
  trademark?: string
  guarantee?: string
  location?: string
  isMegamall?: false
  storeId?: number
  tags?: string
  campaignId?: number
  valueAccumulatePoints?: number
  percentAccumlatePoints?: number
  accumlatePointType?: string
  flagIds?: number[]
  isApprove?: boolean
  turnGame?: number
  weight?: number
  discountRate?: number
  startDate?: number
  endDate?: number
  pointDiscountForVietTel?: number
  merchantIds?: number[]
  type?: 'shipping'
  dmsYeah1ProductId?: number
  note?: string
  model?: string
  avgRate?: number
  purchased?: number
  total?: number
}

export interface StoreInfo {
  createdAt?: number
  updatedAt?: number
  id: number
  name?: string
  logo?: string
  slogan?: string
  rate?: number
  deliveryOntime?: number
  productCount?: number
  chatLink?: string
  background?: string
  shipMoney?: number
  countRate?: number
  totalRate?: number
  provinceId?: number
  districtId?: number
  wardId?: number
  address?: string
  gpsLocation?: string
  phone?: string
  usingStoreShipMoney: false
  displayAmoutProduct: true
}

export interface CategoryInfo {
  createdAt?: number
  updatedAt?: number
  id: number
  name: string
  parentId?: number
  isActive: true
  image?: string
  imageMb?: string
  type?: string
  sequence?: number
  hotSequence?: number
  megamallSequence?: number
  percentDiscountForVietTel?: number
  isHot: true
  merchantIds?: number[]
}

export interface AttributeValueInfos {
  createdAt?: number
  updatedAt?: number
  id: number
  productTypeId?: number
  attributeId?: number
  name: string
  description?: string
}

export interface ProductAttributeValueInfos {
  createdAt?: number
  updatedAt?: number
  id: number
  productId?: number
  attributeValueId?: number
}

export interface AttributeInfos {
  createdAt?: number
  updatedAt?: number
  id: number
  name: string
  description?: string
  categoryId?: number
  displayType?: string
}
export interface ProductDetail {
  productTypeInfo: {
    createdAt?: number
    updatedAt?: number
    id: number
    itemId?: number
    categoryId?: number
    subCategoryId?: number
    name?: string
    description?: string
    images?: string[]
    isActive: true
    hotSequence: 0
    isHot: false
    thumbnail?: string
    payment?: 'point' | 'cash' | 'both'
    paymentPoint?: number
    paymentCash?: number
    originPrice?: number
    trademark?: string
    guarantee?: string
    location?: string
    isMegamall: false
    storeId?: number
    tags?: string
    campaignId: null
    valueAccumulatePoints?: number
    percentAccumlatePoints?: number
    accumlatePointType?: string
    flagIds?: number[]
    isApprove?: boolean
    turnGame?: number
    weight?: number
    discountRate?: number
    startDate?: number
    endDate?: number
    pointDiscountForVietTel?: number
    merchantIds?: number[]
    type?: 'shipping'
    dmsYeah1ProductId?: number
    note?: string
    model?: string
  }
  productInfos: {
    createdAt?: number
    updatedAt?: number
    id: number
    itemId?: number
    productTypeId?: number
    name?: string
    isActive: true
    description: null
    payment?: 'cash'
    paymentPoint?: number
    paymentCash?: number
    originPrice?: number
    images?: string[]
    isDelete: false
    storeId?: number
    weight?: number
    dmsYeah1ProductId?: number
  }[]
  storeInfo: StoreInfo
  categoryInfo: CategoryInfo
  attributeValueInfos: AttributeValueInfos[]
  attributeInfos: AttributeInfos[]
  productAttributeValueInfos: ProductAttributeValueInfos[]
}

export interface ICalculatePrice {
  code: number
  message?: string
  result: {
    totalAccumulatePoints: number
    orderPlace: string
    point: number
    totalShipMoney: number
    total: number
    cash: number
    orderShips: {
      [x: string]: {
        shipMoney: number
        moneyShipCalculateByStore: number
        moneyCash: number
        discount: number
        mpoint: number
        useShipStore: boolean
        storeInfo: StoreInfo
      }
    }
    discount: number
    totalPriceProducts: number
    totalShipMoneyStore: number
  }
  listOrderItems: [
    {
      type: string
      typeId: number
      quantity: number
      useShipStore: boolean
      moneyShipCalculateByStore: number
      shipMoney: number
      attribute: string
      attributeValue: string
      payment: string
      paymentCash: number
      paymentPoint: number
      productInfo: Product
      storeId: number
      itemPrice: number
      productTypeId: number
      accumlatePointType: string
      accumulatePoints: number
      dmsYeah1ProductId: null
      storeInfo: StoreInfo
      point: number
      cash: number
    }
  ]
  discountInfo: any
  shippingService: {
    [x: string]: {
      code: string
      name: string
      fee: string
      carrier: string
      estimated_pickup_at: string
      estimated_delivery_at: string
      carrier_info: {
        name: string
        image_url: string
      }
    }[]
  }
}

export interface OrderShipItem {
  createdAt?: number
  updatedAt?: number
  id?: number
  orderId?: number
  customerId?: number
  totalMoney?: number
  moneyCash?: number
  receiveName?: string
  receivePhone?: string
  receiveEmail?: string
  receiveProvince?: string
  receiveDistrict?: string
  receiveWard?: string
  receiveAddress?: string
  deliveryName?: string
  deliveryPhone?: string
  deliveryProvince?: string
  deliveryDistrict?: string
  deliveryWard?: string
  deliveryAddress?: string
  totalWeight?: number
  shipServiceCode?: string
  shipId?: number
  shipOrderCodeId?: string
  shipStatus?: string
  shipMsg?: Array<any>
  shipMoney?: number
  shipCarrier?: string
  shipServiceName?: string
  linkOrderPartnerShip?: string
  linkFulfillmentPartnerShip?: string
  transporterOrder?: string
  cancelReason?: string
  discount?: number
  mpoint?: number
  note?: string
  paymentMethodShip?: string
  typeOrder?: string
  status?: 'wait_for_admin_confirm' | 'shipping' | 'completed' | 'canceled'
  storeId?: number
  totalAccumulatePoints?: number
  typeItem?: string
  moneyShipStore?: any
  useShipStore?: boolean
  orderItemInfos?: {
    createdAt?: number
    updatedAt?: number
    id?: number
    orderId?: number
    orderShipId?: number
    customerId?: number
    type?: string
    typeId?: number
    productTypeId?: number
    itemId?: number
    images?: string[]
    name?: string
    quantity?: number
    totalPrice?: number
    shippPrice?: number
    itemPrice?: number
    shippingInfo: any
    isPay?: boolean
    point?: number
    cash?: number
    status?: string
    cancelReason?: string
    receiveName?: string
    receivePhone?: string
    receiveEmail?: string
    receiveProvince?: string
    receiveDistrict?: string
    receiveWard?: string
    provinceId?: number
    districtId?: number
    wardId?: number
    address?: string
    codeVoucher?: string
    codeId?: number
    storeId?: number
    note?: string
    typeOrder?: string
    amountAccumulatePoints?: number
    attribute?: string
    attributeValue?: string
    shipMessages: any
    shipOrderCodeId?: string
    transporterOrder?: string
    typeItem?: string
    percentDiscountForVietTel?: number
    valueDiscountForViettel?: number
    categoryName?: string
    categoryId?: number
    merchantId?: number
    payment?: string
    dmsYeah1ProductId?: number
  }[]
  storeInfo?: StoreInfo
  merchantId?: number
  orderPlace?: string
  shipDiscount?: number
}
