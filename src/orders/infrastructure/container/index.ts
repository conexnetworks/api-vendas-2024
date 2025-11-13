import { container } from 'tsyringe'
import { OrdersTypeormRepository } from '../typeorm/repositories/orders-typeorm.repository'
import { dataSource } from '@/common/infrastructure/typeorm'
import { Order } from '../typeorm/entities/orders.entity'

container.registerSingleton('OrdersRepository', OrdersTypeormRepository)
container.registerInstance(
  'OrdersDefaultRepositoryTypeorm',
  dataSource.getRepository(Order),
)
