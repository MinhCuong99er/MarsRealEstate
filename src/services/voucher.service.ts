import { ListVoucherParams } from '@src/interfaces/dto/voucher.dto'
import request, { IApiResponse } from '@src/utils/request'

export function getListCourses<T>(params: ListVoucherParams, token?: string): Promise<IApiResponse<T>> {
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

export function getMyVouchers<T>(params: ListVoucherParams, token: string): Promise<IApiResponse<T>> {
  return request<T>({
    url: '/code/get-codes-of-customer',
    options: {
      method: 'post',
      data: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function reChargeByCode<T>(code: string, token: string): Promise<IApiResponse<T>> {
  return request<T>({
    url: '/code/checkout-code-coalition',
    options: {
      method: 'post',
      data: {
        code,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export function getVoucherByCode<T>(code: string, token?: string): Promise<IApiResponse<T>> {
  return request<T>({
    url: '/code/get-voucher-by-code',
    options: {
      method: 'post',
      data: {
        code,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}
