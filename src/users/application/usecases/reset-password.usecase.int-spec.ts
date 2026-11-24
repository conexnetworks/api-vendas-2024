import 'reflect-metadata'
import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source'
import { BcryptjsHashProvider } from '@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { UsersDataBuilder } from '@/users/infrastructure/testing/helpers/users-data-builder'
import { User } from '@/users/infrastructure/typeorm/entities/users.entity'
import { UserToken } from '@/users/infrastructure/typeorm/entities/user-tokens.entity'
import { UsersTypeormRepository } from '@/users/infrastructure/typeorm/repositories/users-typeorm.repository'
import { UserTokensTypeormRepository } from '@/users/infrastructure/typeorm/repositories/user-tokens-typeorm.repository'
import { ResetPasswordUseCase } from './reset-password.usecase'

describe('ResetPasswordUseCase integration tests', () => {
  let sut: ResetPasswordUseCase.UseCase
  let usersRepository: UsersTypeormRepository
  let userTokensRepository: UserTokensTypeormRepository
  const hashProvider = new BcryptjsHashProvider()

  beforeAll(async () => {
    await testDataSource.initialize()
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM user_tokens')
    await testDataSource.manager.query('DELETE FROM users')
    usersRepository = new UsersTypeormRepository(
      testDataSource.getRepository(User),
    )
    userTokensRepository = new UserTokensTypeormRepository(
      testDataSource.getRepository(UserToken),
      usersRepository,
    )
    sut = new ResetPasswordUseCase.UseCase(
      usersRepository,
      userTokensRepository,
      hashProvider,
    )
  })

  it('should reset the user password', async () => {
    const user = await usersRepository.insert(UsersDataBuilder({}))
    const { token } = await userTokensRepository.generate({ user_id: user.id })

    await sut.execute({ token, password: 'novaSenha123' })

    const updated = await usersRepository.findById(user.id)
    await expect(
      hashProvider.compareHash('novaSenha123', updated.password),
    ).resolves.toBe(true)
  })

  it('should not allow reusing the token', async () => {
    const user = await usersRepository.insert(UsersDataBuilder({}))
    const { token } = await userTokensRepository.generate({ user_id: user.id })
    await sut.execute({ token, password: 'novaSenha123' })

    await expect(
      sut.execute({ token, password: 'outraSenha456' }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
