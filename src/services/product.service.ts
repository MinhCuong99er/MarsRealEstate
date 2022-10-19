import { ListProductParams } from '@src/interfaces/dto/product.dto'
import request, { IApiResponse } from '@src/utils/request'

export function getListProducts<T>(params: ListProductParams, token?: string): Promise<IApiResponse<T>> {
  const url = '/product-type/get-list-product-types'
  if (token) {
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
  return request<T>({
    url,
    options: {
      method: 'post',
      data: params,
    },
  })
}

export function getProductsInfo<T>(productTypeId: number, token?: string): Promise<IApiResponse<T>> {
  const url = 'product-type/get-product-type-info'
  if (token) {
    return request<T>({
      url,
      options: {
        method: 'post',
        data: {
          productTypeId,
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
        productTypeId,
      },
    },
  })
}
