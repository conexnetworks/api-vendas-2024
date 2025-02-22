import nodemailer from 'nodemailer'
import {
  HandlebarsEmailTemplate,
  HandlebarsEmailTemplateProps,
} from './handlebars-email-template'

type MailContactProps = {
  name: string
  email: string
}

type SendEmailProps = {
  to: MailContactProps
  from?: MailContactProps
  subject: string
  templateData: HandlebarsEmailTemplateProps
}

export async function apiSendEmail(props: SendEmailProps): Promise<void> {
  const transporter = nodemailer.createTransport({
    jsonTransport: true,
  })

  const mailTemplate = new HandlebarsEmailTemplate()

  transporter.sendMail(
    {
      from: {
        name: props.from?.name || 'API Vendas',
        address: props.from?.email || 'aluiziodeveloper@gmail.com',
      },
      to: {
        name: props.to.name,
        address: props.to.email,
      },
      subject: props.subject,
      html: await mailTemplate.parse(props.templateData),
    },
    (err, info) => {
      console.log(info.envelope)
      console.log(info.messageId)
      console.log(info.message)
    },
  )
}
