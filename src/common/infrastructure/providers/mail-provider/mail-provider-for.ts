import { MailProvider } from '@/common/domain/providers/mail-provider'
import { JsonMailProvider } from './json.mail-provider'
import { SesMailProvider } from './ses.mail-provider'
import { SmtpMailProvider } from './smtp.mail-provider'

export type MailDriver = 'json' | 'smtp' | 'ses'

const mailProviders: Record<MailDriver, new () => MailProvider> = {
  json: JsonMailProvider,
  smtp: SmtpMailProvider,
  ses: SesMailProvider,
}

export function mailProviderFor(driver: MailDriver) {
  return mailProviders[driver]
}
