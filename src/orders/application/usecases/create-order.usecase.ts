import { inject, injectable } from 'tsyringe'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { dataSource } from '@/common/infrastructure/typeorm'
import { CustomersRepository } from '@/customers/domain/repositories/customers.repository'
import { OrdersRepository } from '@/orders/domain/repositories/orders.repository'
import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { OrderOutput } from '../dtos/order-output.dto'
import { OrderInput } from '../dtos/order-input.dto'

export namespace CreateOrderUseCase {
  export type Input = OrderInput

  export type Output = OrderOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('OrdersRepository')
      private ordersRepository: OrdersRepository,
      @inject('CustomersRepository')
      private customersRepository: CustomersRepository,
      @inject('ProductsRepository')
      private productsRepository: ProductsRepository,
    ) {}
    async execute(input: Input): Promise<Output> {
      if (!input.customer_id || input.products.length <= 0) {
        throw new BadRequestError('Input data not provided or invalid')
      }
      const customer = await this.customersRepository.findById(
        input.customer_id,
      )

      const productsIds = input.products.map(product => ({ id: product.id }))
      const productsFound =
        await this.productsRepository.findAllByIds(productsIds)

      if (productsFound.length <= 0) {
        throw new BadRequestError('Product data not provided or invalid')
      }

      const orderProducts = await Promise.all(
        productsFound.map(async p => {
          const product = await this.productsRepository.findById(p.id)
          const requestedQuantity = input.products.filter(
            p => p.id === product.id,
          )[0].quantity
          product.quantity = requestedQuantity
          return product
        }),
      )

      return this.ordersRepository.createOrder(dataSource, {
        customer,
        products: orderProducts,
      })
    }
  }
}
