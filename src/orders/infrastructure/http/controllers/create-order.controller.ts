import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateOrderUseCase } from '@/orders/application/usecases/create-order.usecase'

export async function createOrderController(
  request: Request,
  response: Response,
): Promise<Response> {
  const bodySchema = z.object({
    customer_id: z.string().uuid(),
    products: z.array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().positive(),
      }),
    ),
  })

  const { customer_id, products } = dataValidation(bodySchema, request.body)

  const createOrderUseCase: CreateOrderUseCase.UseCase =
    container.resolve('CreateOrderUseCase')

  const order = await createOrderUseCase.execute({
    customer_id,
    products,
  })

  return response.status(201).json(order)
}
