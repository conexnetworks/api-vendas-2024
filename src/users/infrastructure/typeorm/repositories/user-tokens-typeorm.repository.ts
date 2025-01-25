import { NotFoundError } from '@/common/domain/errors/not-found-error'
import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { UserTokensModel } from '@/users/domain/models/user-tokens.model'
import {
  CreateUserTokensProps,
  UserTokensRepository,
} from '@/users/domain/repositories/user-tokens.repository'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import { ILike, Repository } from 'typeorm'

@injectable()
export class UserTokensTypeormRepository implements UserTokensRepository {
  sortableFields: string[] = ['created_at']

  constructor(
    @inject('UserTokensDefaultRepositoryTypeorm')
    private userTokensRepository: Repository<UserTokensModel>,
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  create(props: CreateUserTokensProps): UserTokensModel {
    return this.userTokensRepository.create(props)
  }

  async insert(model: UserTokensModel): Promise<UserTokensModel> {
    return this.userTokensRepository.save(model)
  }

  async findById(id: string): Promise<UserTokensModel> {
    return this._get(id)
  }

  async update(model: UserTokensModel): Promise<UserTokensModel> {
    await this._get(model.id)
    await this.userTokensRepository.update({ id: model.id }, model)
    return model
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.userTokensRepository.delete(id)
  }

  async search(props: SearchInput): Promise<SearchOutput<UserTokensModel>> {
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc', 'desc']
    const validSortDir =
      (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'

    const [userTokens, total] = await this.userTokensRepository.findAndCount({
      ...(props.filter && {
        where: {
          user_id: ILike(`%${props.filter}%`),
        },
      }),
      order: {
        [orderByField]: orderByDir,
      },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: userTokens,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    }
  }

  async generate(props: CreateUserTokensProps): Promise<UserTokensModel> {
    const user = await this.usersRepository.findById(props.user_id)
    const userToken = this.userTokensRepository.create({
      user_id: user.id,
    })
    return this.userTokensRepository.save(userToken)
  }

  async findByToken(token: string): Promise<UserTokensModel> {
    const userToken = await this.userTokensRepository.findOneBy({
      token,
    })
    if (!userToken) {
      throw new NotFoundError('User token not found')
    }
    return userToken
  }

  protected async _get(id: string): Promise<UserTokensModel> {
    const userToken = await this.userTokensRepository.findOneBy({ id })
    if (!userToken) {
      throw new NotFoundError(`User token not found using ID ${id}`)
    }
    return userToken
  }
}
