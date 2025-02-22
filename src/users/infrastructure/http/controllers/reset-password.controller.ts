import { dataValidation } from '@/common/infrastructure/validation/zod'
import { ResetPasswordUseCase } from '@/users/application/usecases/reset-password.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function resetPasswordController(
  request: Request,
  response: Response,
): Promise<Response> {
  const bodySchema = z.object({
    token: z.string().uuid(),
    password: z.string(),
  })
  const { token, password } = dataValidation(bodySchema, request.body)

  const resetPasswordUseCase: ResetPasswordUseCase.UseCase = container.resolve(
    'ResetPasswordUseCase',
  )

  await resetPasswordUseCase.execute({ token, password })

  return response.status(204).json()
}
