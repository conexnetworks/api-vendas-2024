import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { HashProvider } from '@/common/domain/providers/hash-provider'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dtos/user-output.dto'

export namespace UpdateUserUseCase {
  export type Input = {
    user_id: string
    name: string
    email: string
    old_password?: string
    password?: string
  }

  export type Output = UserOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
      @inject('HashProvider')
      private hasProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, name, user_id, old_password, password } = input

      const user = await this.usersRepository.findById(user_id)

      if (user.email !== email) {
        await this.usersRepository.conflictingEmail(email)
        user.email = email
      }

      if (password && !old_password) {
        throw new BadRequestError('Old password is required')
      }

      if (password && old_password) {
        const checkOldPassword = await this.hasProvider.compareHash(
          old_password,
          user.password,
        )
        if (!checkOldPassword) {
          throw new BadRequestError('Old password does not match')
        }
        user.password = await this.hasProvider.generateHash(password)
      }

      if (user.name !== name) {
        user.name = name
      }

      return this.usersRepository.update(user)
    }
  }
}
