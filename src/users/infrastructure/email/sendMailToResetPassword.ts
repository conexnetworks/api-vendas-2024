import { HandlebarsEmailTemplate } from '@/common/infrastructure/config/email/handlebars-email-template'
import { MailProvider } from '@/common/domain/providers/mail-provider'
import { UserOutput } from '@/users/application/dtos/user-output.dto'
import path from 'node:path'

type SendMailToResetPasswordProps = {
  user: UserOutput
  token: string
}

export async function sendMailToResetPassword(
  mailProvider: MailProvider,
  { user, token }: SendMailToResetPasswordProps,
) {
  const emailTemplate = path.resolve(
    __dirname,
    '..',
    'views',
    'forgot_password.hbs',
  )

  const html = await new HandlebarsEmailTemplate().parse({
    file: emailTemplate,
    variables: {
      name: user.name,
      link: `http://localhost:3000/reset_password?token=${token}`,
    },
  })

  await mailProvider.sendMail({
    to: {
      name: user.name,
      email: user.email,
    },
    subject: 'Recuperação de senha',
    html,
  })
}
