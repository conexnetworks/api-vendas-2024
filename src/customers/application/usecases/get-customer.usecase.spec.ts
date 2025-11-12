import 'reflect-metadata'
import { CustomersInMemoryRepository } from '@/customers/infrastructure/in-memory/repositories/customers-in-memory.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { GetCustomerUseCase } from './get-customer.usecase'

describe('GetCustomerUseCase Unit Tests', () => {
  let sut: GetCustomerUseCase.UseCase
  let repository: CustomersInMemoryRepository

  beforeEach(() => {
    repository = new CustomersInMemoryRepository()
    sut = new GetCustomerUseCase.UseCase(repository)
  })

  test('should throws error when customer not found', async () => {
    await expect(async () => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      NotFoundError,
    )
    await expect(async () => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError(`Model not found using ID fakeId`),
    )
  })

  test('should be able to get a customer', async () => {
    const spyFindById = jest.spyOn(repository, 'findById')
    const props = {
      name: 'test name',
      email: 'a@a.com',
    }
    const model = repository.create(props)
    await repository.insert(model)

    const result = await sut.execute({ id: model.id })
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject(model)
  })
})
