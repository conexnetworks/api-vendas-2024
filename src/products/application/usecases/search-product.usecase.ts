import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { inject, injectable } from 'tsyringe'
import { SearchInputDto } from '../dtos/search-input.dto'

export namespace SearchProductUseCase {
  export type Input = SearchInputDto

  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductsRepository')
      private productsRepository: ProductsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.productsRepository.search(input)
      return
    }
  }
}
