import { CustomerModel } from '@/customers/domain/models/customers.model'
import { CustomersRepository } from '@/customers/domain/repositories/customers.repository'
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from '@/products/application/dtos/pagination-output.dto'
import { SearchInputDto } from '@/products/application/dtos/search-input.dto'
import { inject, injectable } from 'tsyringe'

export namespace SearchCustomerUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutputDto<CustomerModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('CustomersRepository')
      private customersRepository: CustomersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.customersRepository.search(input)
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
