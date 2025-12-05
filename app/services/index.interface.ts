export interface PaginationInterface {
  total: number
  page: number
  limit: number
  pages: number
}

export interface QueryInterface {
  page: number
  limit: number
  search?: string
  category?: string
  status?: string
}
