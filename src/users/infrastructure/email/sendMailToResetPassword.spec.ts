import { FakeMailProvider } from '@/common/infrastructure/providers/mail-provider/testing/fake.mail-provider'
import { UsersDataBuilder } from '@/users/infrastructure/testing/helpers/users-data-builder'
import { sendMailToResetPassword } from './sendMailToResetPassword'

describe('sendMailToResetPassword unit tests', () => {
  let mailProvider: FakeMailProvider

  beforeEach(() => {
    mailProvider = new FakeMailProvider()
  })

  it('should send the reset password email to the user', async () => {
    const user = UsersDataBuilder({})

    await sendMailToResetPassword(mailProvider, { user, token: 'fake-token' })

    expect(mailProvider.sentMails).toHaveLength(1)
    expect(mailProvider.sentMails[0].to).toEqual({
      name: user.name,
      email: user.email,
    })
    expect(mailProvider.sentMails[0].subject).toBe('Recuperação de senha')
  })

  it('should include the reset link with the token in the html', async () => {
    const user = UsersDataBuilder({ name: 'John Doe' })

    await sendMailToResetPassword(mailProvider, { user, token: 'fake-token' })

    // O Handlebars escapa o "=" do link como "&#x3D;"; o navegador decodifica
    expect(mailProvider.sentMails[0].html).toContain(
      'http://localhost:3000/reset_password?token&#x3D;fake-token',
    )
    expect(mailProvider.sentMails[0].html).toContain('Olá John Doe!')
  })
})
