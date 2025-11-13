import { ProductsTypeormRepository } from '@/products/infrastructure/typeorm/repositories/products-typeorm.repository'
import { OrdersTypeormRepository } from './orders-typeorm.repository'
import { Customer } from '@/customers/infrastructure/typeorm/entities/customers.entity'
import { Product } from '@/products/infrastructure/typeorm/entities/products.entity'
import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source'
import { Order } from '../entities/orders.entity'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { CustomersDataBuilder } from '@/customers/infrastructure/testing/helpers/customers-data-builder'
import { OrdersDataBuilder } from '../../testing/helpers/orders-data-builder'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { CreateOrderProps } from '@/orders/domain/repositories/orders.repository'

describe('OrdersTypeormRepository Integration Tests', () => {
  let ordersRepository: OrdersTypeormRepository
  let productsRepository: ProductsTypeormRepository
  let typeormEntityManager: any
  let customer: Customer
  let product1: Product
  let product2: Product

  beforeAll(async () => {
    await testDataSource.initialize()
    typeormEntityManager = testDataSource.createEntityManager()
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM orders_products')
    await testDataSource.manager.query('DELETE FROM orders')
    await testDataSource.manager.query('DELETE FROM customers')
    await testDataSource.manager.query('DELETE FROM products')
    productsRepository = new ProductsTypeormRepository(
      typeormEntityManager.getRepository(Product),
    )
    ordersRepository = new OrdersTypeormRepository(
      typeormEntityManager.getRepository(Order),
      productsRepository,
    )

    customer = new Customer()
    customer.name = 'John Doe'
    customer.email = 'a@a.com'
    await testDataSource.manager.save(customer)

    product1 = new Product()
    product1.name = 'Product A'
    product1.price = 10.5
    product1.quantity = 50
    await testDataSource.manager.save(product1)

    product2 = new Product()
    product2.name = 'Product B'
    product2.price = 25.99
    product2.quantity = 20
    await testDataSource.manager.save(product2)
  })

  test('should generate an error when the order is not found - findById', async () => {
    await expect(() =>
      ordersRepository.findById('a5b620a1-f91b-4de2-b0bb-1a32e9e6dc86'),
    ).rejects.toBeInstanceOf(NotFoundError)
    await expect(
      ordersRepository.findById('a5b620a1-f91b-4de2-b0bb-1a32e9e6dc86'),
    ).rejects.toThrow(
      new NotFoundError(
        'Order not found using ID a5b620a1-f91b-4de2-b0bb-1a32e9e6dc86',
      ),
    )
  })

  test('should finds a order by id - findById', async () => {
    const customerData = CustomersDataBuilder({})
    const customer = testDataSource.manager.create(Customer, customerData)
    await testDataSource.manager.save(customer)
    const data = OrdersDataBuilder({ customer_id: customer.id })
    const order = testDataSource.manager.create(Order, data)
    await testDataSource.manager.save(order)

    const result = await ordersRepository.findById(order.id)
    expect(result.id).toBeDefined()
    expect(result.customer_id).toEqual(data.customer.id)
  })

  test('should create a new order and update product quantities - createOrder', async () => {
    const orderData: CreateOrderProps = {
      customer,
      products: [
        {
          ...product1,
          quantity: 1,
        },
        {
          ...product2,
          quantity: 2,
        },
      ],
    }
    const result = await ordersRepository.createOrder(testDataSource, orderData)
    expect(result).toBeDefined()
    expect(result.order_products).toHaveLength(2)

    //Verificar se as quantidades dos produtos foram atualizadas
    const updatedProduct1 = await productsRepository.findById(product1.id)
    const updatedProduct2 = await productsRepository.findById(product2.id)
    expect(updatedProduct1.quantity).toBe(49)
    expect(updatedProduct2.quantity).toBe(18)
  })

  test('should generate an error when the transaction is not completed', async () => {
    const orderData: CreateOrderProps = {
      customer,
      products: [{ ...product1, quantity: 51 }],
    }
    await expect(
      ordersRepository.createOrder(testDataSource, orderData),
    ).rejects.toThrow(
      new BadRequestError(`Product ${product1.id} is out of stock`),
    )

    //Verificar se a quantidade do produto ficou inalterada
    const product = await productsRepository.findById(product1.id)
    expect(product.quantity).toBe(50)
  })
})
