import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { CustomerOutput } from '../dtos/customer-output.dto'
import { inject, injectable } from 'tsyringe'
import { CustomersRepository } from '@/customers/domain/repositories/customers.repository'

export namespace CreateCustomerUseCase {
  export type Input = {
    name: string
    email: string
  }

  export type Output = CustomerOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('CustomersRepository')
      private customersRepository: CustomersRepository,
    ) {}
    async execute(input: Input): Promise<Output> {
      if (!input.name || !input.email) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      await this.customersRepository.conflictingEmail(input.email)

      const customer = this.customersRepository.create(input)
      return this.customersRepository.insert(customer)
    }
  }
}
