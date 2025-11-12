import { inject, injectable } from 'tsyringe'
import { CustomersRepository } from '@/customers/domain/repositories/customers.repository'
import { CustomerOutput } from '../dtos/customer-output.dto'

export namespace GetCustomerUseCase {
  export type Input = {
    id: string
  }

  export type Output = CustomerOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('CustomersRepository')
      private customersRepository: CustomersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      return this.customersRepository.findById(input.id)
    }
  }
}
