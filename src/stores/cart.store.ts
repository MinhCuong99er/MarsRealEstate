import { action, observable, makeObservable, flow } from 'mobx'
import { persist } from 'mobx-persist'
import update from 'lodash/update'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import assign from 'lodash/assign'
import RootStore from './RootStore'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import * as cartServices from '@src/services/cart.service'
import { OrderVoucherParams, PayVoucherParams } from '@src/interfaces/dto/voucher.dto'
import { ICalculatePrice, Product } from '@src/interfaces/Product'
import { Voucher } from '@src/interfaces/Voucher'
import { CartType } from '@src/interfaces/enums'
import { CalculatePriceParams, CreateOrderParams, PayOrderParams } from '@src/interfaces/dto/product.dto'
import { IApiResponse } from '@src/utils/request'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

type CartItem = Product | Voucher

export type CartHydration = {
  ids?: { voucher: Array<number>; product: Array<number> }
  carts?: { voucher: Array<CartItem>; product: Array<CartItem> }
  currentCart?: { voucher: Array<CartItem>; product: Array<CartItem> }
  quantityIds?: {
    voucher: Record<string, number>
    product: Record<string, number>
  }
}

export default class CartStore {
  @observable state = 'pending'
  @observable root: RootStore
  @persist('object') @observable ids = { voucher: [], product: [] }
  @persist('object') @observable carts = { voucher: [], product: [] }
  @persist('object') @observable currentCart = { voucher: [], product: [] }
  @persist('object') @observable quantityIds = { voucher: {}, product: {} }

  constructor(root: RootStore) {
    this.root = root
    makeObservable(this)
  }

  @action addToCart({
    cartType,
    cartItem,
    quantity = 1,
  }: {
    cartType: CartType
    cartItem: CartItem
    quantity?: number
  }) {
    if (cartType === CartType.PRODUCT) {
      this.addProdToCart(cartItem as Product, quantity)
    } else if (cartType === CartType.VOUCHER) {
      this.addVoucherToCart(cartItem as Voucher, quantity)
    }
  }

  @action removeFromCart({ cartType, id }: { cartType: CartType; id: number }) {
    if (cartType === CartType.PRODUCT) {
      let _productIds = this.ids.product
      let _quantityIds = this.quantityIds.product
      if (_productIds.includes(id)) {
        _productIds = _productIds.filter((i) => i !== id)
        this.ids.product = _productIds
      }
      if (_quantityIds[id]) {
        _quantityIds = omit(_quantityIds, `${id}`)
        this.quantityIds.product = _quantityIds
      }
      const _carts = this.carts.product
      this.carts.product = _carts.filter((i) => i.id !== id)
    } else if (cartType === CartType.VOUCHER) {
      let _productIds = this.ids.voucher
      let _quantityIds = this.quantityIds.voucher
      if (_productIds.includes(id)) {
        _productIds = _productIds.filter((i) => i !== id)
        this.ids.product = _productIds
      }
      if (_quantityIds[id]) {
        _quantityIds = omit(_quantityIds, `${id}`)
        this.quantityIds.voucher = _quantityIds
      }
      const _carts = this.carts.voucher
      this.carts.voucher = _carts.filter((i) => i.id !== id)
    }
  }

  @action changeQuantityInCart({ cartType, id, quantity }: { cartType: CartType; id: number; quantity?: number }) {
    if (cartType === CartType.PRODUCT) {
      const prod = this.carts.product.find((item) => item.id === id)
      if (prod) {
        const _quantityIds = this.quantityIds.product
        this.quantityIds.product = update(_quantityIds, `${id}`, function (n) {
          if (n + quantity <= 0) {
            return 1
          }
          return n + quantity
        })
      }
    } else if (cartType === CartType.VOUCHER) {
      const prod = this.carts.voucher.find((item) => item.id === id)
      if (prod) {
        const _quantityIds = this.quantityIds.voucher
        this.quantityIds.voucher = update(_quantityIds, `${id}`, function (n) {
          if (n + quantity <= 0) {
            return 1
          }
          return n + quantity
        })
      }
    }
  }

  @action chooseToCurrentCart({ id, cartType }: { cartType: CartType; id: number }) {
    if (cartType === CartType.PRODUCT) {
      const prod = this.carts.product.find((item) => item.id === id)
      if (!prod) {
        this.currentCart.product.push(prod)
      }
    } else if (cartType === CartType.VOUCHER) {
      const prod = this.carts.voucher.find((item) => item.id === id)
      if (!prod) {
        this.currentCart.voucher.push(prod)
      }
    }
  }

  @action removeFromCurrentCart({ id, cartType }: { cartType: CartType; id: number }) {
    if (cartType === CartType.PRODUCT) {
      const prod = this.currentCart.product.find((item) => item.id === id)
      if (prod) {
        this.currentCart.product = this.currentCart.product.filter((i) => i.id !== id)
      }
    } else if (cartType === CartType.VOUCHER) {
      const prod = this.currentCart.voucher.find((item) => item.id === id)
      if (prod) {
        this.currentCart.voucher = this.currentCart.voucher.filter((i) => i.id !== id)
      }
    }
  }

  @action checkoutSuccess() {
    const curCartProdIds = this.currentCart.product.map((i) => i.id)
    const curCartVoucherIds = this.currentCart.voucher.map((i) => i.id)
    const _productIds = this.ids.product
    const _voucherIds = this.ids.product
    const _quantityProdIds = this.quantityIds.product
    const _quantityVoucherIds = this.quantityIds.voucher

    // prod
    this.ids.product = _productIds.filter((i) => !curCartProdIds.includes(i))
    this.quantityIds.product = omit(_quantityProdIds, curCartProdIds.concat(',').toString())
    const _cartProdIds = this.carts.product.filter((i) => !curCartProdIds.includes(i))
    this.carts.product = _cartProdIds

    // voucher
    this.ids.voucher = _voucherIds.filter((i) => !curCartVoucherIds.includes(i))
    this.quantityIds.voucher = omit(_quantityVoucherIds, curCartVoucherIds.concat(',').toString())
    const _cartVoucherIds = this.carts.voucher.filter((i) => !curCartVoucherIds.includes(i))
    this.carts.voucher = _cartVoucherIds
    this.currentCart = { voucher: [], product: [] }
  }

  @flow *checkout(params: OrderVoucherParams, note?: string) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const resOrder = yield cartServices.createOrderVouchers(params, this.root.authStore.token)
      if (resOrder.status === HttpStatusCode.OK && resOrder.data && resOrder.data.code == 0) {
        const paramPay: PayVoucherParams = {
          orderId: resOrder?.data?.orderInfo?.id,
          note,
          appReturnUrl: publicRuntimeConfig.BASE_URL + '/thong-tin-dat-hang',
        }
        const resPay = yield cartServices.payOrderVouchers(paramPay, this.root.authStore.token)
        this.state = 'done'
        this.root.loading = false
        if (resPay.status === HttpStatusCode.OK && resPay.data && resPay.data.code == 0) {
          this.root.authStore?.getCustomerInfo()
          return {
            order: resOrder?.data,
            pay: resPay?.data,
          }
        }
        return {
          order: resOrder?.data,
          pay: resPay?.data,
        }
      }
      return resOrder?.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *checkoutProduct(params: CreateOrderParams) {
    this.root.loading = true
    this.state = 'processing'
    const paramOrders = omit(params, 'appReturnUrl')
    const { appReturnUrl } = pick(params, 'appReturnUrl')
    try {
      const resOrder = yield cartServices.createOrder(paramOrders, this.root.authStore.token)
      if (resOrder.status === HttpStatusCode.OK && resOrder.data && resOrder.data.code == 0) {
        const paramPay: PayOrderParams = {
          orderId: resOrder?.data?.orderInfo?.id,
          appReturnUrl: publicRuntimeConfig.BASE_URL + '/thong-tin-dat-hang',
        }
        if (appReturnUrl && appReturnUrl != '') {
          paramPay.appReturnUrl = appReturnUrl
        }
        const resPay = yield cartServices.payOrder(paramPay, this.root.authStore.token)
        this.state = 'done'
        this.root.loading = false
        if (resPay.status === HttpStatusCode.OK && resPay.data && resPay.data.code == 0) {
          this.root.authStore?.getCustomerInfo()
          return {
            order: resOrder?.data,
            pay: resPay?.data,
          }
        }
        return {
          order: resOrder?.data,
          pay: resPay?.data,
        }
      }
      return resOrder?.data
    } catch (error) {
      this.state = 'error'
      this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @flow *calculatePrice(params: CalculatePriceParams) {
    this.root.loading = true
    this.state = 'processing'
    try {
      const resCal: IApiResponse<ICalculatePrice> = yield cartServices.calculatePrice(params, this.root.authStore.token)
      this.root.loading = false
      if (resCal.status === HttpStatusCode.OK && resCal.data && resCal.data.code == 0) {
        this.state = 'done'
        // this.root.loading = false
        return resCal.data
      }
      return resCal?.data
    } catch (error) {
      this.state = 'error'
      // this.root.loading = false
      return {
        errorCode: HttpStatusCode.UNKNOW_ERROR,
        message: error.message,
      }
    }
  }

  @action hydrate(data?: CartHydration) {
    if (data && data.carts) {
      this.carts = data.carts
    }
    if (data && data.ids) {
      this.ids = data.ids
    }
    if (data && data.quantityIds) {
      this.quantityIds = data.quantityIds
    }
    if (data && data.currentCart) {
      this.currentCart = data.currentCart
    }
  }

  protected addProdToCart(prod: Product, quantity: number) {
    const prodAdd = this.carts.product.find((item) => item.id === prod.id)
    let _quantityIds = this.quantityIds.product
    if (prodAdd) {
      this.quantityIds.product = update(_quantityIds, `${prod.id}`, function (n) {
        if (n + quantity <= 0) {
          return 0
        }
        return n + quantity
      })
    } else {
      this.carts.product.push(prod)
      this.ids.product.push(prod.id)
      _quantityIds = assign(_quantityIds, { [prod.id]: quantity })
      this.quantityIds.product = _quantityIds
    }
  }

  protected addVoucherToCart(voucher: Voucher, quantity: number) {
    const voucherAdd = this.carts.voucher.find((item) => item.id === voucher.id)
    let _quantityIds = this.quantityIds.voucher
    if (voucherAdd) {
      this.quantityIds.voucher = update(_quantityIds, `${voucher.id}`, function (n) {
        if (n + quantity <= 0) {
          return 0
        }
        return n + quantity
      })
    } else {
      this.carts.product.push(voucher)
      this.ids.product.push(voucher.id)
      _quantityIds = assign(_quantityIds, { [voucher.id]: quantity })
      this.quantityIds.voucher = _quantityIds
    }
  }
}
