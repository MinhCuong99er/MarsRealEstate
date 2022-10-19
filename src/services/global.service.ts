import { CartType } from '@src/interfaces/enums'
import request, { IApiResponse } from '@src/utils/request'

export function search<T>(text: string, token?: string): Promise<IApiResponse<T>> {
  if (token) {
    return request<T>({
      url: '/home/search',
      options: {
        method: 'post',
        data: {
          text,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return request<T>({
    url: '/home/search',
    options: {
      method: 'post',
      data: {
        text,
      },
    },
  })
}

export function getListBanner<T>(token?: string): Promise<IApiResponse<T>> {
  if (token) {
    return request<T>({
      url: '/banner/get-all-banners',
      options: {
        method: 'post',
        data: {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return request<T>({
    url: '/banner/get-all-banners',
    options: {
      method: 'post',
      data: {},
    },
  })
}

export function getListCategory<T>(type: CartType = CartType.VOUCHER, token?: string): Promise<IApiResponse<T>> {
  if (token) {
    return request<T>({
      url: '/category/get-categories',
      options: {
        method: 'post',
        data: {
          type,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return request<T>({
    url: '/category/get-categories',
    options: {
      method: 'post',
      data: {
        type,
      },
    },
  })
}

export function getListQuestionAnswer<T>(token?: string): Promise<IApiResponse<T>> {
  const url = `/qa/get-list-qa`
  if (token) {
    return request<T>({
      url,
      options: {
        method: 'post',
        data: {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return request<T>({
    url,
    options: {
      method: 'post',
      data: {},
    },
  })
}

export function putInvite<T>(code: string, token?: string): Promise<IApiResponse<T>> {
  const url = `/invite/put-invite`
  if (token) {
    return request<T>({
      url,
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
  return request<T>({
    url,
    options: {
      method: 'post',
      data: {
        code,
      },
    },
  })
}

export function getTransactionCode<T>(token: string): Promise<IApiResponse<T>> {
  const url = `/exchange/create-transaction-code`
  return request<T>({
    url,
    options: {
      method: 'post',
      data: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}
