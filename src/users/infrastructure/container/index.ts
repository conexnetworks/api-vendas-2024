import { dataSource } from '@/common/infrastructure/typeorm'
import { UsersTypeormRepository } from '@/users/infrastructure/typeorm/repositories/users-typeorm.repository'
import { container } from 'tsyringe'
import { User } from '../typeorm/entities/users.entity'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { SearchUserUseCase } from '@/users/application/usecases/search-user.usecase'
import { AuthenticateUserUseCase } from '@/users/application/usecases/authenticate-user.usecase'
import { UpdateAvatarUseCase } from '@/users/application/usecases/update-avatar.usecase'
import { UserTokensTypeormRepository } from '../typeorm/repositories/user-tokens-typeorm.repository'
import { UserToken } from '../typeorm/entities/user-tokens.entity'
import { SendEmailToResetPasswordUseCase } from '@/users/application/usecases/send-email-to-reset-password.usecase'
import { ResetPasswordUseCase } from '@/users/application/usecases/reset-password.usecase'
import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'

container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance(
  'UsersDefaultRepositoryTypeorm',
  dataSource.getRepository(User),
)
container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)
container.registerSingleton('SearchUserUseCase', SearchUserUseCase.UseCase)
container.registerSingleton(
  'AuthenticateUserUseCase',
  AuthenticateUserUseCase.UseCase,
)
container.registerSingleton('UpdateAvatarUseCase', UpdateAvatarUseCase.UseCase)
container.registerSingleton('UserTokensRepository', UserTokensTypeormRepository)
container.registerInstance(
  'UserTokensDefaultRepositoryTypeorm',
  dataSource.getRepository(UserToken),
)
container.registerSingleton(
  'SendEmailToResetPasswordUseCase',
  SendEmailToResetPasswordUseCase.UseCase,
)
container.registerSingleton(
  'ResetPasswordUseCase',
  ResetPasswordUseCase.UseCase,
)
container.registerSingleton('GetUserUseCase', GetUserUseCase.UseCase)
container.registerSingleton('UpdateUserUseCase', UpdateUserUseCase.UseCase)
