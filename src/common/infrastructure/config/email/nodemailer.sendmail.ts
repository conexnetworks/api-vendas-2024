import nodemailer from 'nodemailer'

type SendEmailProps = {
  to: string
  body: string
}

export class SendEmail {
  static async apiSendEmail(props: SendEmailProps): Promise<void> {
    const transporter = nodemailer.createTransport({
      jsonTransport: true,
    })

    transporter.sendMail(
      {
        from: 'aluiziodeveloper@gmail.com',
        to: props.to,
        subject: 'Reset Password',
        text: props.body,
      },
      (err, info) => {
        console.log(info.envelope)
        console.log(info.messageId)
        console.log(info.message)
      },
    )
  }
}
