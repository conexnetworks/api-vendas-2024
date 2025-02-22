import { UserModel } from '@/users/domain/models/users.model'
import { UserTokensRepository } from '@/users/domain/repositories/user-tokens.repository'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'

export namespace SendEmailToResetPasswordUseCase {
  export type Input = {
    email: string
  }

  export type Output = {
    user: UserModel
    token: string
  }

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
      @inject('UserTokensRepository')
      private userTokensRepository: UserTokensRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const user = await this.usersRepository.findByEmail(input.email)

      const { token } = await this.userTokensRepository.generate({
        user_id: user.id,
      })

      return { user, token }
    }
  }
}
