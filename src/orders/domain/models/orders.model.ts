import { OrderProductModel } from './orders-products.model'

export interface OrderModel {
  id: string
  customer_id: string
  order_products: OrderProductModel[]
  created_at: Date
  updated_at: Date
}
