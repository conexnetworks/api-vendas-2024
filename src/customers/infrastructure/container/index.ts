import { dataSource } from '@/common/infrastructure/typeorm'
import { CustomersTypeormRepository } from '@/customers/infrastructure/typeorm/repositories/customers-typeorm.repository'
import { container } from 'tsyringe'
import { Customer } from '../typeorm/entities/customers.entity'

container.registerSingleton('CustomersRepository', CustomersTypeormRepository)
container.registerInstance(
  'CustomersDefaultRepositoryTypeorm',
  dataSource.getRepository(Customer),
)
