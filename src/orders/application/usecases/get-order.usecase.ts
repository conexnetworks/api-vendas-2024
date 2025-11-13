import { inject, injectable } from 'tsyringe'
import { OrdersRepository } from '@/orders/domain/repositories/orders.repository'
import { OrderOutput } from '../dtos/order-output.dto'

export namespace GetOrderUseCase {
  export type Input = {
    id: string
  }

  export type Output = OrderOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('OrdersRepository')
      private ordersRepository: OrdersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      return this.ordersRepository.findById(input.id)
    }
  }
}
