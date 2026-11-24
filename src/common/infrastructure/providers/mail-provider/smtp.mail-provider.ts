import nodemailer, { Transporter } from 'nodemailer'
import {
  MailProvider,
  SendMailProps,
} from '@/common/domain/providers/mail-provider'
import { env } from '@/common/infrastructure/env'
import { defaultSender } from './default-sender'

export class SmtpMailProvider implements MailProvider {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: env.SMTP_USER
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
    })
  }

  async sendMail({ to, from, subject, html }: SendMailProps): Promise<void> {
    const sender = from ?? defaultSender
    await this.transporter.sendMail({
      from: { name: sender.name, address: sender.email },
      to: { name: to.name, address: to.email },
      subject,
      html,
    })
  }
}
