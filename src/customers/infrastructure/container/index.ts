import { dataSource } from '@/common/infrastructure/typeorm'
import { CustomersTypeormRepository } from '@/customers/infrastructure/typeorm/repositories/customers-typeorm.repository'
import { container } from 'tsyringe'
import { Customer } from '../typeorm/entities/customers.entity'
import { CreateCustomerUseCase } from '@/customers/application/usecases/create-customer.usecase'

container.registerSingleton('CustomersRepository', CustomersTypeormRepository)
container.registerInstance(
  'CustomersDefaultRepositoryTypeorm',
  dataSource.getRepository(Customer),
)
container.registerSingleton(
  'CreateCustomerUseCase',
  CreateCustomerUseCase.UseCase,
)
