import 'reflect-metadata'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { CreateOrderUseCase } from './create-order.usecase'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { CustomersInMemoryRepository } from '@/customers/infrastructure/in-memory/repositories/customers-in-memory.repository'
import { OrdersInMemoryRepository } from '@/orders/infrastructure/in-memory/repositories/orders-in-memory.repository'
import { ProductsDataBuilder } from '@/products/infrastructure/testing/helpers/products-data-builder'
import { CustomersDataBuilder } from '@/customers/infrastructure/testing/helpers/customers-data-builder'
import { ProductModel } from '@/products/domain/models/products.model'
import { CustomerModel } from '@/customers/domain/models/customers.model'

describe('CreateOrderUseCase Unit Tests', () => {
  let sut: CreateOrderUseCase.UseCase
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
    sut = new CreateOrderUseCase.UseCase(
      ordersRepository,
      customersRepository,
      productsRepository,
    )
  })

  test('should throws error when customer not provided', async () => {
    const product = await productsRepository.insert(productData)
    const orderProps = {
      customer_id: undefined,
      products: [{ id: product.id, quantity: 1 }],
    }
    await expect(async () => sut.execute(orderProps)).rejects.toBeInstanceOf(
      BadRequestError,
    )

    await expect(async () => sut.execute(orderProps)).rejects.toThrow(
      new BadRequestError('Input data not provided or invalid'),
    )
  })

  test('should throws error when product not provided', async () => {
    const customer = await customersRepository.insert(customerData)
    const orderProps = {
      customer_id: customer.id,
      products: [],
    }
    await expect(async () => sut.execute(orderProps)).rejects.toBeInstanceOf(
      BadRequestError,
    )

    await expect(async () => sut.execute(orderProps)).rejects.toThrow(
      new BadRequestError('Input data not provided or invalid'),
    )
  })

  test('should throws error when customer not found', async () => {
    const product = await productsRepository.insert(productData)
    const orderProps = {
      customer_id: customerData.id,
      products: [{ id: product.id, quantity: 1 }],
    }
    await expect(async () => sut.execute(orderProps)).rejects.toBeInstanceOf(
      NotFoundError,
    )

    await expect(async () => sut.execute(orderProps)).rejects.toThrow(
      new NotFoundError(`Model not found using ID ${customerData.id}`),
    )
  })

  test('should throws error when product not found', async () => {
    const customer = await customersRepository.insert(customerData)
    const orderProps = {
      customer_id: customerData.id,
      products: [{ id: productData.id, quantity: 1 }],
    }
    await expect(async () => sut.execute(orderProps)).rejects.toBeInstanceOf(
      BadRequestError,
    )

    await expect(async () => sut.execute(orderProps)).rejects.toThrow(
      new BadRequestError('Product data not provided or invalid'),
    )
  })

  test('should create an order', async () => {
    const spyCreateOrder = jest.spyOn(ordersRepository, 'createOrder')
    const product = await productsRepository.insert(productData)
    const customer = await customersRepository.insert(customerData)

    const result = await sut.execute({
      customer_id: customer.id,
      products: [{ id: product.id, quantity: 1 }],
    })

    expect(result.id).toBeDefined()
    expect(result.customer_id).toEqual(customer.id)
    expect(result.order_products[0].product_id).toEqual(product.id)
    expect(spyCreateOrder).toHaveBeenCalledTimes(1)
  })
})
