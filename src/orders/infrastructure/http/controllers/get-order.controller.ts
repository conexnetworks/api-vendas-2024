import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'
import { AppError } from '@/common/domain/errors/app-error'
import { GetOrderUseCase } from '@/orders/application/usecases/get-order.usecase'

export async function getOrderController(
  request: Request,
  response: Response,
): Promise<Response> {
  const getOrderParamSchema = z.object({
    id: z.string().uuid(),
  })

  const validatedData = getOrderParamSchema.safeParse(request.params)
  if (validatedData.success === false) {
    console.error('Invalid params', validatedData.error.format())
    throw new AppError(
      `${validatedData.error.errors.map(err => {
        return `${err.path} -> ${err.message}`
      })}`,
    )
  }

  const { id } = validatedData.data

  const getOrderUseCase: GetOrderUseCase.UseCase =
    container.resolve('GetOrderUseCase')
  const order = await getOrderUseCase.execute({ id })
  return response.status(200).json(order)
}
