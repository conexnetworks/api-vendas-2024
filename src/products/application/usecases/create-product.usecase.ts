export namespace CreateProductUseCase {
  export type Input = {
    name: string
    price: number
    quantity: number
  }

  export type Output = {
    id: string
    name: string
    price: number
    quantity: number
    created_at: Date
    updated_at: Date
  }

  export class UseCase {
    async execute(input: Input): Promise<Output> {
      // Do something
    }
  }
}
