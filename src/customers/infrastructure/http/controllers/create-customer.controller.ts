import { Request, Response } from 'express'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateCustomerUseCase } from '@/customers/application/usecases/create-customer.usecase'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function createCustomerController(
  request: Request,
  response: Response,
): Promise<Response> {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
  })

  const { name, email } = dataValidation(bodySchema, request.body)

  const createCustomerUseCase: CreateCustomerUseCase.UseCase =
    container.resolve('CreateCustomerUseCase')

  const customer = await createCustomerUseCase.execute({
    name,
    email,
  })

  return response.status(201).json(customer)
}
