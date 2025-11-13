export type ProductsInput = {
  id: string
  quantity: number
}

export type OrderInput = {
  customer_id: string
  products: ProductsInput[]
}
