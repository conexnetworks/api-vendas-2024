import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase'
import { instanceToInstance } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export async function getUserController(
  request: Request,
  response: Response,
): Promise<Response> {
  if (!request.user) {
    return response.status(401).json({ error: 'Unauthorized' })
  }

  const id = request.user.id

  const getUserUseCase: GetUserUseCase.UseCase =
    container.resolve('GetUserUseCase')

  const user = await getUserUseCase.execute({ id })

  return response.status(200).json(instanceToInstance(user))
}
