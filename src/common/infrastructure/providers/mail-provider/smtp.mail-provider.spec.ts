import nodemailer from 'nodemailer'
import { SmtpMailProvider } from './smtp.mail-provider'

jest.mock('nodemailer')

describe('SmtpMailProvider unit tests', () => {
  const sendMail = jest.fn()

  beforeEach(() => {
    jest.mocked(nodemailer.createTransport).mockReturnValue({
      sendMail,
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create the transport with the SMTP host and port', () => {
    new SmtpMailProvider()

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ host: 'localhost', port: 1025, secure: false }),
    )
  })

  it('should send the email with the default sender', async () => {
    const provider = new SmtpMailProvider()

    await provider.sendMail({
      to: { name: 'John Doe', email: 'john@example.com' },
      subject: 'Assunto',
      html: '<p>Olá</p>',
    })

    expect(sendMail).toHaveBeenCalledWith({
      from: { name: 'API Vendas', address: 'nao-responda@example.com' },
      to: { name: 'John Doe', address: 'john@example.com' },
      subject: 'Assunto',
      html: '<p>Olá</p>',
    })
  })
})
