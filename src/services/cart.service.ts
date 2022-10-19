import { CalculatePriceParams, CreateOrderParams, PayOrderParams } from '@src/interfaces/dto/product.dto'
import { OrderVoucherParams, PayVoucherParams } from '@src/interfaces/dto/voucher.dto'
import request, { IApiResponse } from '@src/utils/request'

export function createOrderVouchers<T>(data: OrderVoucherParams, token: string): Promise<IApiResponse<T>> {
  return request<T>({
    url: '/order/create-order',
    options: {
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function payOrderVouchers<T>(data: PayVoucherParams, token: string): Promise<IApiResponse<T>> {
  return request<T>({
    url: '/payment/pay-order',
    options: {
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function calculatePrice<T>(params: CalculatePriceParams, token: string): Promise<IApiResponse<T>> {
  const url = '/v2/order/calculate-price'
  return request<T>({
    url,
    options: {
      method: 'post',
      data: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function createOrder<T>(params: CreateOrderParams, token: string): Promise<IApiResponse<T>> {
  const url = '/v2/order/create-order'
  return request<T>({
    url,
    options: {
      method: 'post',
      data: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function payOrder<T>(params: PayOrderParams, token: string): Promise<IApiResponse<T>> {
  const url = '/v2/order/pay-order'
  return request<T>({
    url,
    options: {
      method: 'post',
      data: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}
