import { AppError } from '@/common/domain/errors/app-error'
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
  createOrder(
    connection: any,
    { customer, products }: CreateOrderProps,
  ): Promise<OrderModel> {
    throw new Error('Method not implemented.')
  }

  protected applyFilter(
    items: OrderModel[],
    filter: string | null,
  ): Promise<OrderModel[]> {
    throw new AppError('Method not implemented.')
  }
}
