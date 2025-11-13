import { CustomerModel } from '@/customers/domain/models/customers.model'
import { OrdersInMemoryRepository } from './orders-in-memory.repository'
import { ProductModel } from '@/products/domain/models/products.model'
import { CustomersDataBuilder } from '@/customers/infrastructure/testing/helpers/customers-data-builder'
import { ProductsDataBuilder } from '@/products/infrastructure/testing/helpers/products-data-builder'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

describe('OrdersInMemoryRepository unit tests', () => {
  let sut: OrdersInMemoryRepository
  let customer: CustomerModel
  let products: ProductModel[]

  beforeEach(() => {
    sut = new OrdersInMemoryRepository()
    customer = CustomersDataBuilder({})
    products = [ProductsDataBuilder({})]
  })

  describe('createOrder', () => {
    test('should create a new order', async () => {
      const result = await sut.createOrder(null, {
        customer,
        products,
      })

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.customer_id).toBe(customer.id)
      expect(result.order_products[0].product_id).toEqual(products[0].id)
    })

    test('should throw an error if customer is missing', async () => {
      await expect(
        sut.createOrder(null, { customer: undefined, products }),
      ).rejects.toBeInstanceOf(BadRequestError)
      await expect(
        sut.createOrder(null, { customer: undefined, products }),
      ).rejects.toThrow(
        new BadRequestError('Input data not provided or invalid'),
      )
    })

    test('should throw an error if products are missing', async () => {
      await expect(
        sut.createOrder(null, { customer, products: [] }),
      ).rejects.toBeInstanceOf(BadRequestError)
      await expect(
        sut.createOrder(null, { customer, products: [] }),
      ).rejects.toThrow(
        new BadRequestError('Input data not provided or invalid'),
      )
    })
  })
})
