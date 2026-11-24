import {
  MailProvider,
  SendMailProps,
} from '@/common/domain/providers/mail-provider'

export class FakeMailProvider implements MailProvider {
  sentMails: SendMailProps[] = []

  async sendMail(props: SendMailProps): Promise<void> {
    this.sentMails.push(props)
  }
}
