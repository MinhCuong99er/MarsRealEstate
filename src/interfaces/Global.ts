import { BANNER_ACTION } from './enums'
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
