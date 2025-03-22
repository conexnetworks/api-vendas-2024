import 'reflect-metadata'
import { CreateCustomerUseCase } from './create-customer.usecase'
import { CustomersInMemoryRepository } from '@/customers/infrastructure/in-memory/repositories/customers-in-memory.repository'
import { CustomersDataBuilder } from '@/customers/infrastructure/testing/helpers/customers-data-builder'

describe('CreateCustomerUseCase Unit Tests', () => {
  let sut: CreateCustomerUseCase.UseCase
  let repository: CustomersInMemoryRepository

  beforeEach(() => {
    repository = new CustomersInMemoryRepository()
    sut = new CreateCustomerUseCase.UseCase(repository)
  })

  test('should create a customer', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = CustomersDataBuilder({})
    const result = await sut.execute({
      name: props.name,
      email: props.email,
    })
    expect(result.id).toBeDefined()
    expect(result.created_at).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })
})
