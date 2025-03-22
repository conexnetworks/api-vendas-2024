import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source'
import { CustomersTypeormRepository } from './customers-typeorm.repository'
import { Customer } from '../entities/customers.entity'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { CustomersDataBuilder } from '../../testing/helpers/customers-data-builder'
import { ConflictError } from '@/common/domain/errors/conflict-error'
import { CustomerModel } from '@/customers/domain/models/customers.model'
import { randomUUID } from 'node:crypto'

describe('CustomersTypeormRepository Integration Tests', () => {
  let ormRepository: CustomersTypeormRepository
  let typeormEntityManager: any

  beforeAll(async () => {
    await testDataSource.initialize()
    typeormEntityManager = testDataSource.createEntityManager()
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM customers')
    ormRepository = new CustomersTypeormRepository(
      typeormEntityManager.getRepository(Customer),
    )
  })

  it('should generate an error when the customer is not found - findById', async () => {
    await expect(() =>
      ormRepository.findById('a5b620a1-f91b-4de2-b0bb-1a32e9e6dc86'),
    ).rejects.toBeInstanceOf(NotFoundError)
    await expect(
      ormRepository.findById('a5b620a1-f91b-4de2-b0bb-1a32e9e6dc86'),
    ).rejects.toThrow(
      new NotFoundError(
        'Customer not found using ID a5b620a1-f91b-4de2-b0bb-1a32e9e6dc86',
      ),
    )
  })

  it('should finds a customer by id - findById', async () => {
    const data = CustomersDataBuilder({})
    const customer = testDataSource.manager.create(Customer, data)
    await testDataSource.manager.save(customer)

    const result = await ormRepository.findById(customer.id)
    expect(result.id).toEqual(customer.id)
    expect(result.name).toEqual(customer.name)
    expect(result.email).toEqual(customer.email)
  })

  it('should create a new customer object - create', () => {
    const data = {
      name: 'John Doe',
      email: 'a@a.com',
      password: '1234',
    }
    const result = ormRepository.create(data)

    expect(result.name).toEqual('John Doe')
    expect(result.email).toEqual('a@a.com')
  })

  it('should inserts a new customer - insert', async () => {
    const data = CustomersDataBuilder({ name: 'John Doe', email: 'a@a.com' })
    const result = await ormRepository.insert(data)

    expect(result.name).toEqual('John Doe')
    expect(result.email).toEqual('a@a.com')
  })

  it('should throw error on update when a customer not found - update', async () => {
    const data = CustomersDataBuilder({})
    await expect(() => ormRepository.update(data)).rejects.toBeInstanceOf(
      NotFoundError,
    )
    await expect(ormRepository.update(data)).rejects.toThrow(
      new NotFoundError(`Customer not found using ID ${data.id}`),
    )
  })

  it('should update a customer - update', async () => {
    const data = CustomersDataBuilder({})
    const customer = await ormRepository.insert(data)

    customer.name = 'new name'
    customer.email = 'a@a.com'
    const result = await ormRepository.update(customer)

    expect(result.name).toBe('new name')
    expect(result.email).toBe('a@a.com')
  })

  it('should throw error on delete when a customer not found - delete', async () => {
    const data = CustomersDataBuilder({})
    await expect(() => ormRepository.delete(data.id)).rejects.toBeInstanceOf(
      NotFoundError,
    )
    await expect(ormRepository.delete(data.id)).rejects.toThrow(
      new NotFoundError(`Customer not found using ID ${data.id}`),
    )
  })

  it('should delete a customer - delete', async () => {
    const data = CustomersDataBuilder({})
    await ormRepository.insert(data)

    await ormRepository.delete(data.id)

    const result = await testDataSource.manager.findOneBy(Customer, {
      id: data.id,
    })
    expect(result).toBeNull()
  })

  it('should throw error when customer not found - findByEmail', async () => {
    await expect(() =>
      ormRepository.findByEmail('a@a.com'),
    ).rejects.toBeInstanceOf(NotFoundError)
    await expect(ormRepository.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError('Customer not found using email a@a.com'),
    )
  })

  it('should finds a customer by email - findByEmail', async () => {
    const data = CustomersDataBuilder({ email: 'a@a.com' })
    const customer = testDataSource.manager.create(Customer, data)
    await testDataSource.manager.save(customer)

    const result = await ormRepository.findByEmail('a@a.com')
    expect(result.email).toEqual('a@a.com')
  })

  it('should throw error when customer not found - findByName', async () => {
    await expect(() =>
      ormRepository.findByName('John Doe'),
    ).rejects.toBeInstanceOf(NotFoundError)
    await expect(ormRepository.findByName('John Doe')).rejects.toThrow(
      new NotFoundError('Customer not found using name John Doe'),
    )
  })

  it('should finds a customer by name - findByName', async () => {
    const data = CustomersDataBuilder({ name: 'John Doe' })
    const customer = testDataSource.manager.create(Customer, data)
    await testDataSource.manager.save(customer)

    const result = await ormRepository.findByName('John Doe')
    expect(result.name).toEqual('John Doe')
  })

  it('should throw error when customer found - conflictingEmail', async () => {
    const customer = CustomersDataBuilder({ email: 'a@a.com' })
    await ormRepository.insert(customer)

    await expect(() =>
      ormRepository.conflictingEmail('a@a.com'),
    ).rejects.toBeInstanceOf(ConflictError)
    await expect(ormRepository.conflictingEmail('a@a.com')).rejects.toThrow(
      new ConflictError('Email already used on another customer'),
    )
  })

  it('should not find a customer by email - conflictingEmail', async () => {
    expect.assertions(0)
    await ormRepository.conflictingEmail('a@a.com')
  })

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const arrange = Array(16).fill(CustomersDataBuilder({}))
      arrange.map(async element => delete element.id)
      const data = testDataSource.manager.create(Customer, arrange)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })

      expect(result.total).toBe(16)
      expect(result.items.length).toBe(15)
      result.items.map(item => {
        expect(item.id).toBeDefined()
        expect(item).toBeInstanceOf(Customer)
        expect(item.created_at).toBeInstanceOf(Date)
      })
    })

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      const models: CustomerModel[] = []
      const arrange = Array(16).fill(CustomersDataBuilder({}))
      arrange.forEach(async (element, index) => {
        delete element.id
        models.push({
          ...element,
          name: `Customer ${index}`,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Customer, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })
      expect(result.items[0].name).toEqual('Customer 15')
      expect(result.items[14].name).toEqual('Customer 1')

      result = await ormRepository.search({
        page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })
      expect(result.items[0].name).toEqual('Customer 0')
    })

    it('should apply paginate and sort', async () => {
      const created_at = new Date()
      const models: CustomerModel[] = []
      'badec'.split('').forEach((element, index) => {
        models.push({
          id: randomUUID(),
          name: element,
          email: `a${index}@a.com`,
          created_at: new Date(created_at.getTime() + index),
          updated_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Customer, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: null,
      })

      expect(result.items[0].name).toEqual('a')
      expect(result.items[1].name).toEqual('b')

      result = await ormRepository.search({
        page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: null,
      })

      expect(result.items[0].name).toEqual('c')
      expect(result.items[1].name).toEqual('d')
    })

    it('should search using filter, sort and paginate', async () => {
      const created_at = new Date()
      const models: CustomerModel[] = []
      const values = ['test', 'a', 'TEST', 'b', 'TeSt']
      values.forEach((element, index) => {
        models.push({
          id: randomUUID(),
          name: element,
          email: `a${index}@a.com`,
          created_at: new Date(created_at.getTime() + index),
          updated_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Customer, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'TEST',
      })
      expect(result.total).toEqual(3)
      expect(result.items[0].name).toEqual('test')
      expect(result.items[1].name).toEqual('TeSt')
      expect(result.items[2].name).toEqual('TEST')
    })
  })
})
