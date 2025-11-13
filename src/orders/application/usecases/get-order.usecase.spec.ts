import 'reflect-metadata'
import { randomUUID } from 'node:crypto'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { GetOrderUseCase } from './get-order.usecase'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { CustomersInMemoryRepository } from '@/customers/infrastructure/in-memory/repositories/customers-in-memory.repository'
import { OrdersInMemoryRepository } from '@/orders/infrastructure/in-memory/repositories/orders-in-memory.repository'
import { ProductsDataBuilder } from '@/products/infrastructure/testing/helpers/products-data-builder'
import { CustomersDataBuilder } from '@/customers/infrastructure/testing/helpers/customers-data-builder'
import { ProductModel } from '@/products/domain/models/products.model'
import { CustomerModel } from '@/customers/domain/models/customers.model'

describe('GetOrderUseCase Unit Tests', () => {
  let sut: GetOrderUseCase.UseCase
  let ordersRepository: OrdersInMemoryRepository
  let customersRepository: CustomersInMemoryRepository
  let productsRepository: ProductsInMemoryRepository
  let customerData: CustomerModel
  let productData: ProductModel

  beforeEach(() => {
    customerData = CustomersDataBuilder({})
    productData = ProductsDataBuilder({})
    ordersRepository = new OrdersInMemoryRepository()
    customersRepository = new CustomersInMemoryRepository()
    productsRepository = new ProductsInMemoryRepository()
    sut = new GetOrderUseCase.UseCase(ordersRepository)
  })

  test('should throws error when order not found', async () => {
    const id = randomUUID()
    await expect(async () => sut.execute({ id })).rejects.toThrow(NotFoundError)
    await expect(async () => sut.execute({ id })).rejects.toThrow(
      new NotFoundError(`Model not found using ID ${id}`),
    )
  })

  test('should be able to get a order', async () => {
    const spyFindById = jest.spyOn(ordersRepository, 'findById')
    const product = await productsRepository.insert(productData)
    const customer = await customersRepository.insert(customerData)
    const order = await ordersRepository.createOrder(null, {
      customer,
      products: [product],
    })

    const result = await sut.execute({ id: order.id })
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(result.customer_id).toEqual(customer.id)
    expect(result.order_products[0].product_id).toEqual(product.id)
  })
})
