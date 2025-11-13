import { RepositoryInterface } from '@/common/domain/repositories/repository.interface'
import { CustomerModel } from '@/customers/domain/models/customers.model'
import { ProductModel } from '@/products/domain/models/products.model'
import { OrderModel } from '../models/orders.model'

export type CreateOrderProps = {
  customer: CustomerModel
  products: ProductModel[]
}

export interface OrdersRepository
  extends RepositoryInterface<OrderModel, CreateOrderProps> {
  createOrder(
    connection: any,
    { customer, products }: CreateOrderProps,
  ): Promise<OrderModel>
}
