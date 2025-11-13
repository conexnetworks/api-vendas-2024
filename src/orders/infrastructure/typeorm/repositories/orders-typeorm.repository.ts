import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { OrderModel } from '@/orders/domain/models/orders.model'
import {
  CreateOrderProps,
  OrdersRepository,
} from '@/orders/domain/repositories/orders.repository'
import { inject } from 'tsyringe'
import { Repository } from 'typeorm'
import { Order } from '../entities/orders.entity'
import { ProductsTypeormRepository } from '@/products/infrastructure/typeorm/repositories/products-typeorm.repository'

export class OrdersTypeormRepository implements OrdersRepository {
  constructor(
    @inject('OrdersDefaultRepositoryTypeorm')
    private ordersRepository: Repository<Order>,
    @inject('ProductsRepository')
    private productsRepository: ProductsTypeormRepository,
  ) {}

  async createOrder({
    customer,
    products,
  }: CreateOrderProps): Promise<OrderModel> {
    throw new Error('Method not implemented.')
  }

  create(props: CreateOrderProps): OrderModel {
    throw new Error('Method not implemented.')
  }

  insert(model: OrderModel): Promise<OrderModel> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<OrderModel> {
    throw new Error('Method not implemented.')
  }

  update(model: OrderModel): Promise<OrderModel> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  search(props: SearchInput): Promise<SearchOutput<OrderModel>> {
    throw new Error('Method not implemented.')
  }
}
