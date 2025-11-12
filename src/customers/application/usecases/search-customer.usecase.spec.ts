import 'reflect-metadata'
import { SearchCustomerUseCase } from './search-customer.usecase'
import { CustomersInMemoryRepository } from '@/customers/infrastructure/in-memory/repositories/customers-in-memory.repository'
import { CustomersDataBuilder } from '@/customers/infrastructure/testing/helpers/customers-data-builder'

describe('SearchCustomerUseCase Unit Tests', () => {
  let sut: SearchCustomerUseCase.UseCase
  let repository: CustomersInMemoryRepository

  beforeEach(() => {
    repository = new CustomersInMemoryRepository()
    sut = new SearchCustomerUseCase.UseCase(repository)
  })

  test('should return the customers ordered by created_at', async () => {
    const created_at = new Date()
    const items = [
      { ...CustomersDataBuilder({}) },
      {
        ...CustomersDataBuilder({
          created_at: new Date(created_at.getTime() + 100),
        }),
      },
      {
        ...CustomersDataBuilder({
          created_at: new Date(created_at.getTime() + 200),
        }),
      },
    ]
    repository.items = items

    const result = await sut.execute({})
    expect(result).toStrictEqual({
      items: [...items].reverse(),
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    })
  })

  test('should return output using pagination, sort and filter', async () => {
    const items = [
      { ...CustomersDataBuilder({ name: 'a' }) },
      { ...CustomersDataBuilder({ name: 'AA' }) },
      { ...CustomersDataBuilder({ name: 'Aa' }) },
      { ...CustomersDataBuilder({ name: 'b' }) },
      { ...CustomersDataBuilder({ name: 'c' }) },
    ]
    repository.items = items

    let output = await sut.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[1], items[2]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })

    output = await sut.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0], items[2]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })
  })
})
