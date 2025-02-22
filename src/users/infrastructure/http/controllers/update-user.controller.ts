import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
import { instanceToInstance } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function updateUserController(
  request: Request,
  response: Response,
): Promise<Response> {
  if (!request.user) {
    return response.status(401).json({ error: 'Unauthorized' })
  }

  const id = request.user.id

  const bodySchema = z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().optional(),
      old_password: z.string().optional(),
    })
    .refine(
      data => {
        if (data.password && !data.old_password) {
          return false
        }
        return true
      },
      {
        message: 'Old password is required',
        path: ['old_password'],
      },
    )
  const { name, email, password, old_password } = dataValidation(
    bodySchema,
    request.body,
  )

  const updateUserUseCase: UpdateUserUseCase.UseCase =
    container.resolve('UpdateUserUseCase')

  const user = await updateUserUseCase.execute({
    user_id: id,
    name,
    email,
    password,
    old_password,
  })

  return response.status(200).json(instanceToInstance(user))
}
