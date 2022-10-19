export interface ListParam {
  skip: number
  limit: number
}

export interface ResponseType<T> {
  code: number
  message: number
  data: Array<T> | T
  total?: number
}

export interface IPagination {
  skip?: number
  page?: number
  limit?: number
  totalPage?: number
  total?: number
  loadMore?: boolean
}
