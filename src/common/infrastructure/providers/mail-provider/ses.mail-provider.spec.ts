import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { SesMailProvider, formatAddress } from './ses.mail-provider'

jest.mock('@aws-sdk/client-ses')

describe('SesMailProvider unit tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should send the email with the SendEmailCommand', async () => {
    const provider = new SesMailProvider()

    await provider.sendMail({
      to: { name: 'John Doe', email: 'john@example.com' },
      subject: 'Assunto',
      html: '<p>Olá</p>',
    })

    expect(SendEmailCommand).toHaveBeenCalledWith({
      Source: '"API Vendas" <nao-responda@example.com>',
      Destination: { ToAddresses: ['"John Doe" <john@example.com>'] },
      Message: {
        Subject: { Data: 'Assunto', Charset: 'UTF-8' },
        Body: { Html: { Data: '<p>Olá</p>', Charset: 'UTF-8' } },
      },
    })
    expect(SESClient.prototype.send).toHaveBeenCalledTimes(1)
  })

  it('should encode a name with accents as MIME encoded-word', () => {
    expect(formatAddress({ name: 'João', email: 'joao@example.com' })).toBe(
      '=?UTF-8?B?Sm/Do28=?= <joao@example.com>',
    )
  })
})
