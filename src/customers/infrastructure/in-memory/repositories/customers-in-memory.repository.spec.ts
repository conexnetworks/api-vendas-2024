import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { CustomersInMemoryRepository } from './customers-in-memory.repository'
import { CustomersDataBuilder } from '../../testing/helpers/customers-data-builder'
import { ConflictError } from '@/common/domain/errors/conflict-error'

describe('CustomersInMemoryRepository Unit Tests', () => {
  let sut: CustomersInMemoryRepository

  beforeEach(() => {
    sut = new CustomersInMemoryRepository()
  })

  it('should throw error when customer not found - findByEmail', async () => {
    await expect(() => sut.findByEmail('a@a.com')).rejects.toBeInstanceOf(
      NotFoundError,
    )
    await expect(sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError('Customer not found using email a@a.com'),
    )
  })

  it('should find a customer by email - findByEmail', async () => {
    const customer = CustomersDataBuilder({ email: 'a@a.com' })
    await sut.insert(customer)
    const result = await sut.findByEmail(customer.email)
    expect(result).toStrictEqual(customer)
  })

  it('should throw error when customer not found - findByName', async () => {
    await expect(() => sut.findByName('John Doe')).rejects.toBeInstanceOf(
      NotFoundError,
    )
    await expect(sut.findByName('John Doe')).rejects.toThrow(
      new NotFoundError('Customer not found using name John Doe'),
    )
  })

  it('should find a customer by name - findByName', async () => {
    const customer = CustomersDataBuilder({ name: 'John Doe' })
    await sut.insert(customer)
    const result = await sut.findByName(customer.name)
    expect(result).toStrictEqual(customer)
  })

  it('should throw error when customer found - conflictingEmail', async () => {
    const customer = CustomersDataBuilder({ email: 'a@a.com' })
    await sut.insert(customer)
    await expect(sut.conflictingEmail('a@a.com')).rejects.toThrow(ConflictError)
    await expect(sut.conflictingEmail('a@a.com')).rejects.toThrow(
      new ConflictError('Email already used on another customer'),
    )
  })

  it('should not find a customer by email - conflictingEmail', async () => {
    expect.assertions(0)
    await sut.conflictingEmail('a@a.com')
  })

  it('should no filter items when filter object is null', async () => {
    const customer = CustomersDataBuilder({})
    sut.insert(customer)
    const spyFilter = jest.spyOn(sut.items, 'filter' as any)

    const filteredItems = await sut['applyFilter'](sut.items, null as any)
    expect(spyFilter).not.toHaveBeenCalled()
    expect(filteredItems).toStrictEqual(sut.items)
  })

  it('should filter name field using filter parameter', async () => {
    const items = [
      CustomersDataBuilder({ name: 'Test' }),
      CustomersDataBuilder({ name: 'TEST' }),
      CustomersDataBuilder({ name: 'fake' }),
    ]
    sut.items = items
    const spyFilter = jest.spyOn(sut.items, 'filter' as any)

    const filteredItems = await sut['applyFilter'](sut.items, 'TEST')
    expect(spyFilter).toHaveBeenCalledTimes(1)
    expect(filteredItems).toStrictEqual([sut.items[0], sut.items[1]])
  })
})
