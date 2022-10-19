import { IApiResponse, instance as request } from '@src/utils/request'
import Config from '@src/contains/Config'

export type HelloParam = {
  phone?: string
}

export function hello<T>(): Promise<IApiResponse<T>> {
  return request<T>(`${Config.publicRuntimeConfig.BASE_URL}`, {
    url: '/api/hello',
    options: {},
  })
}

export function helloPost<T>(params: HelloParam): Promise<IApiResponse<T>> {
  return request<T>(`${Config.publicRuntimeConfig.BASE_URL}`, {
    url: '/api/hello',
    options: {
      method: 'post',
      data: params,
    },
  })
}
