import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { GetProductUseCase } from '@/products/application/usecases/get-product.usecase'
import { dataValidation } from '@/common/infrastructure/validation/zod'

export async function getProductController(
  request: Request,
  response: Response,
) {
  const getProductParamSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(getProductParamSchema, request.params)

  const getProductUseCase: GetProductUseCase.UseCase =
    container.resolve('GetProductUseCase')

  const product = await getProductUseCase.execute({ id })

  return response.status(200).json(product)
}
