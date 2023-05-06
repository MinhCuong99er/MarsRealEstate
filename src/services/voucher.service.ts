import { ListVoucherParams } from '@src/interfaces/dto/voucher.dto'
import request, { IApiResponse } from '@src/utils/request'

export function getListVouchers<T>(params: ListVoucherParams, token?: string): Promise<IApiResponse<T>> {
  if (token) {
    return request<T>({
      url: '/voucher/get-list-vouchers',
      options: {
        method: 'post',
        data: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return request<T>({
    url: '/voucher/get-list-vouchers',
    options: {
      method: 'post',
      data: params,
    },
  })
}

export function getVouchersInfo<T>(voucher: number | string, token?: string): Promise<IApiResponse<T>> {
  if (token) {
    return request<T>({
      url: '/voucher/get-voucher-info',
      options: {
        method: 'post',
        data: {
          voucher,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return request<T>({
    url: '/voucher/get-voucher-info',
    options: {
      method: 'post',
      data: {
        voucher,
      },
    },
  })
}
