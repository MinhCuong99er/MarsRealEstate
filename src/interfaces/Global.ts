import { BANNER_ACTION, CartType } from './enums'

export interface ISearchResult {
  _index?: string
  _type?: string
  _id?: string
  _score?: number
  _source: {
    id?: number
    itemId?: number
    categoryId?: number
    name?: string
    images?: string
    tags?: string
    categoryName?: string
    typeSearch?: string
  }
}

export interface IBanner {
  createdAt?: number
  updatedAt?: number
  id: number
  image?: string
  isActive: boolean
  action: BANNER_ACTION
  actionData?: string
  sequence?: number
  position?: string
  dataItem?: Array<string | number | Record<string, any>>
  app?: string
}

export interface ICategory {
  id: number
  name: string
  parentId?: number
  image: string
  imageMb?: string
  type: CartType
  sequence?: number
  hotSequence?: number
  megamallSequence?: number
  isHot?: boolean
  merchantIds?: Array<number>
}

export interface IQuestionAnswer {
  id: number
  question: string
  answer: string
  sequence: number
  parentId: number
  icon: string
  type: string
}
