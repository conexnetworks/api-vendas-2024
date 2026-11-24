import nodemailer from 'nodemailer'
import {
  MailProvider,
  SendMailProps,
} from '@/common/domain/providers/mail-provider'
import { defaultSender } from './default-sender'

export class JsonMailProvider implements MailProvider {
  private transporter = nodemailer.createTransport({ jsonTransport: true })

  async sendMail({ to, from, subject, html }: SendMailProps): Promise<void> {
    const sender = from ?? defaultSender
    const info = await this.transporter.sendMail({
      from: { name: sender.name, address: sender.email },
      to: { name: to.name, address: to.email },
      subject,
      html,
    })
    console.log(info.message)
  }
}
