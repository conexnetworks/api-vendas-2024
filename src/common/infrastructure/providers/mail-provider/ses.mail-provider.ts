import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import {
  MailContact,
  MailProvider,
  SendMailProps,
} from '@/common/domain/providers/mail-provider'
import { env } from '@/common/infrastructure/env'
import { defaultSender } from './default-sender'

// Nome com acento vai no formato MIME encoded-word, como o SES exige
export function formatAddress({ name, email }: MailContact): string {
  const encoded = /^[\x20-\x7e]*$/.test(name)
    ? `"${name.replace(/["\\]/g, '\\$&')}"`
    : `=?UTF-8?B?${Buffer.from(name).toString('base64')}?=`
  return `${encoded} <${email}>`
}

export class SesMailProvider implements MailProvider {
  private client: SESClient

  constructor() {
    this.client = new SESClient({
      region: env.AWS_SES_REGION,
      endpoint: env.AWS_SES_ENDPOINT || undefined,
      credentials: env.AWS_SES_ACCESS_KEY_ID
        ? {
            accessKeyId: env.AWS_SES_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SES_SECRET_ACCESS_KEY ?? '',
          }
        : undefined,
    })
  }

  async sendMail({ to, from, subject, html }: SendMailProps): Promise<void> {
    await this.client.send(
      new SendEmailCommand({
        Source: formatAddress(from ?? defaultSender),
        Destination: { ToAddresses: [formatAddress(to)] },
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: { Html: { Data: html, Charset: 'UTF-8' } },
        },
      }),
    )
  }
}
