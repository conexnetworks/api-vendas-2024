import { container } from 'tsyringe'
import { OrdersTypeormRepository } from '../typeorm/repositories/orders-typeorm.repository'
import { dataSource } from '@/common/infrastructure/typeorm'
import { Order } from '../typeorm/entities/orders.entity'
import { CreateOrderUseCase } from '@/orders/application/usecases/create-order.usecase'
import { GetOrderUseCase } from '@/orders/application/usecases/get-order.usecase'

container.registerSingleton('OrdersRepository', OrdersTypeormRepository)
container.registerInstance(
  'OrdersDefaultRepositoryTypeorm',
  dataSource.getRepository(Order),
)

container.registerSingleton('CreateOrderUseCase', CreateOrderUseCase.UseCase)

container.registerSingleton('GetOrderUseCase', GetOrderUseCase.UseCase)
