export type MailContact = {
  name: string
  email: string
}

export type SendMailProps = {
  to: MailContact
  from?: MailContact
  subject: string
  html: string
}

export interface MailProvider {
  sendMail(props: SendMailProps): Promise<void>
}
