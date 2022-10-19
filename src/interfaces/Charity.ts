export interface Charity extends Record<string, any> {
  createdAt?: number
  updatedAt?: number
  id: number
  name: string
  images?: Array<string>
  description?: string
  fromDate?: number
  toDate?: number
  budget?: number
  tags?: string
  isActive?: number | boolean
  isExpired?: number | boolean
}
