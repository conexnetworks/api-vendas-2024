import { OrderProductModel } from '@/orders/domain/models/orders-products.model'

export type OrderOutput = {
  id: string
  customer_id: string
  order_products: OrderProductModel[]
  created_at: Date
  updated_at: Date
}
