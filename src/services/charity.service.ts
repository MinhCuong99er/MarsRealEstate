import { ListCharityParams, ListCharityDonateParams } from '@src/interfaces/dto/charity.dto'
import request, { IApiResponse } from '@src/utils/request'

export function getListCharities<T>(params: ListCharityParams, token?: string): Promise<IApiResponse<T>> {
  if (token) {
    return request<T>({
      url: '/charity/get-list',
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
    url: '/charity/get-list',
    options: {
      method: 'post',
      data: params,
    },
  })
}

export function getListDonates<T>(params: ListCharityDonateParams, token?: string): Promise<IApiResponse<T>> {
  if (token) {
    return request<T>({
      url: '/charity/get-list-donate',
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
    url: '/charity/get-list-donate',
    options: {
      method: 'post',
      data: params,
    },
  })
}

export function getCharityInfo<T>(id: number | string, token?: string): Promise<IApiResponse<T>> {
  if (token) {
    return request<T>({
      url: '/charity/get-info',
      options: {
        method: 'post',
        data: {
          id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return request<T>({
    url: '/charity/get-info',
    options: {
      method: 'post',
      data: {
        id,
      },
    },
  })
}

export function donate<T>(charityId: number | string, point: number, token?: string): Promise<IApiResponse<T>> {
  if (token) {
    return request<T>({
      url: '/charity/donate',
      options: {
        method: 'post',
        data: {
          charityId,
          point,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return request<T>({
    url: '/charity/donate',
    options: {
      method: 'post',
      data: {
        charityId,
        point,
      },
    },
  })
}
