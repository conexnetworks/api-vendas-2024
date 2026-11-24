import { JsonMailProvider } from './json.mail-provider'
import { mailProviderFor } from './mail-provider-for'
import { SesMailProvider } from './ses.mail-provider'
import { SmtpMailProvider } from './smtp.mail-provider'

describe('mailProviderFor unit tests', () => {
  it('should return the JSON provider for the json driver', () => {
    expect(mailProviderFor('json')).toBe(JsonMailProvider)
  })

  it('should return the SMTP provider for the smtp driver', () => {
    expect(mailProviderFor('smtp')).toBe(SmtpMailProvider)
  })

  it('should return the SES provider for the ses driver', () => {
    expect(mailProviderFor('ses')).toBe(SesMailProvider)
  })
})
