import { dataValidation } from '@/common/infrastructure/validation/zod'
import { SendEmailToResetPasswordUseCase } from '@/users/application/usecases/send-email-to-reset-password.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'
import { sendMailToResetPassword } from '../../email/nodemailer/sendMailToResetPassword'

export async function sendEmailToResetPasswordController(
  request: Request,
  response: Response,
): Promise<Response> {
  const paramsSchema = z.object({
    email: z.string().email(),
  })
  const { email } = dataValidation(paramsSchema, request.body)

  const sendEmailToResetPasswordUseCase: SendEmailToResetPasswordUseCase.UseCase =
    container.resolve('SendEmailToResetPasswordUseCase')

  const { user, token } = await sendEmailToResetPasswordUseCase.execute({
    email,
  })

  await sendMailToResetPassword({ user, token })
  // console.log('user: ', user)
  // console.log('token: ', token)

  return response.status(204).json()
}
