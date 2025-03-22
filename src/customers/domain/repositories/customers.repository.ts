import { RepositoryInterface } from '@/common/domain/repositories/repository.interface'
import { CustomerModel } from '../models/customers.model'

export type CreateCustomerProps = {
  name: string
  email: string
}

export interface CustomersRepository
  extends RepositoryInterface<CustomerModel, CreateCustomerProps> {
  findByEmail(email: string): Promise<CustomerModel>
  findByName(name: string): Promise<CustomerModel>
  conflictingEmail(email: string): Promise<void>
}
