import { z } from 'zod'
import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { AppError } from '@/common/domain/errors/app-error'
import { GetCustomerUseCase } from '@/customers/application/usecases/get-customer.usecase'

export async function getCustomerController(
  request: Request,
  response: Response,
): Promise<Response> {
  const getCustomerParamSchema = z.object({
    id: z.string().uuid(),
  })

  const validatedData = getCustomerParamSchema.safeParse(request.params)
  if (validatedData.success === false) {
    console.error('Invalid params', validatedData.error.format())
    throw new AppError(
      `${validatedData.error.errors.map(err => {
        return `${err.path} -> ${err.message}`
      })}`,
    )
  }

  const { id } = validatedData.data

  const getCustomerUseCase: GetCustomerUseCase.UseCase =
    container.resolve('GetCustomerUseCase')
  const customer = await getCustomerUseCase.execute({ id })
  return response.status(200).json(customer)
}
