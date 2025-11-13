import { randomUUID } from 'node:crypto'
import { AppError } from '@/common/domain/errors/app-error'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { InMemoryRepository } from '@/common/domain/repositories/in-memory.repository'
import { OrderModel } from '@/orders/domain/models/orders.model'
import {
  CreateOrderProps,
  OrdersRepository,
} from '@/orders/domain/repositories/orders.repository'

export class OrdersInMemoryRepository
  extends InMemoryRepository<OrderModel>
  implements OrdersRepository
{
  async createOrder(
    connection: any,
    props: CreateOrderProps,
  ): Promise<OrderModel> {
    const { customer, products } = props
    if (!customer || products.length <= 0) {
      throw new BadRequestError('Input data not provided or invalid')
    }
    const order = {
      id: randomUUID(),
      customer_id: customer.id,
      order_products: products.map(product => {
        return {
          product_id: product.id,
          quantity: product.quantity,
          price: product.price,
        }
      }),
    } as OrderModel
    this.items.push(order)
    return order
  }

  protected applyFilter(
    items: OrderModel[],
    filter: string | null,
  ): Promise<OrderModel[]> {
    throw new AppError('Method not implemented.')
  }
}
