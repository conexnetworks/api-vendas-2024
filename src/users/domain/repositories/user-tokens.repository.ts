import { RepositoryInterface } from '@/common/domain/repositories/repository.interface'
import { UserTokensModel } from '../models/user-tokens.model'

export type CreateUserTokensProps = {
  user_id: string
}

export interface UserTokensRepository
  extends RepositoryInterface<UserTokensModel, CreateUserTokensProps> {
  generate(props: CreateUserTokensProps): Promise<UserTokensModel>
  findByToken(token: string): Promise<UserTokensModel>
}
