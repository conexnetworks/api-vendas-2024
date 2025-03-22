import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { CustomerModel } from '@/customers/domain/models/customers.model'
import {
  CreateCustomerProps,
  CustomersRepository,
} from '@/customers/domain/repositories/customers.repository'
import { inject, injectable } from 'tsyringe'
import { ILike, Repository } from 'typeorm'
import { Customer } from '../entities/customers.entity'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ConflictError } from '@/common/domain/errors/conflict-error'

@injectable()
export class CustomersTypeormRepository implements CustomersRepository {
  sortableFields: string[] = ['name', 'email', 'createdAt']

  constructor(
    @inject('CustomersDefaultRepositoryTypeorm')
    private repository: Repository<Customer>,
  ) {}

  async findByName(name: string): Promise<CustomerModel> {
    const customer = await this.repository.findOneBy({ name })
    if (!customer) {
      throw new NotFoundError(`Customer not found using name ${name}`)
    }
    return customer
  }

  async findByEmail(email: string): Promise<CustomerModel> {
    const customer = await this.repository.findOneBy({ email })
    if (!customer) {
      throw new NotFoundError(`Customer not found using email ${email}`)
    }
    return customer
  }

  async conflictingEmail(email: string): Promise<void> {
    const customer = await this.repository.findOneBy({ email })
    if (customer) {
      throw new ConflictError('Email already used on another customer')
    }
  }

  create(props: CreateCustomerProps): CustomerModel {
    return this.repository.create(props)
  }

  async insert(model: CustomerModel): Promise<CustomerModel> {
    return this.repository.save(model)
  }

  async findById(id: string): Promise<CustomerModel> {
    return this._get(id)
  }

  async update(model: CustomerModel): Promise<CustomerModel> {
    await this._get(model.id)
    await this.repository.update({ id: model.id }, model)
    return model
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.repository.delete(id)
  }

  async search(props: SearchInput): Promise<SearchOutput<CustomerModel>> {
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc', 'desc']
    const validSortDir =
      (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'

    const [customers, total] = await this.repository.findAndCount({
      ...(props.filter && { where: { name: ILike(`%${props.filter}%`) } }),
      order: { [orderByField]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: customers,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<CustomerModel> {
    const customer = await this.repository.findOneBy({ id })
    if (!customer) {
      throw new NotFoundError(`Customer not found using ID ${id}`)
    }
    return customer
  }
}
