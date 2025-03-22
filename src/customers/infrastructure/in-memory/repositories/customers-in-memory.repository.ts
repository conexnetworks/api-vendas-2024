import { ConflictError } from '@/common/domain/errors/conflict-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { InMemoryRepository } from '@/common/domain/repositories/in-memory.repository'
import { CustomerModel } from '@/customers/domain/models/customers.model'
import { CustomersRepository } from '@/customers/domain/repositories/customers.repository'

export class CustomersInMemoryRepository
  extends InMemoryRepository<CustomerModel>
  implements CustomersRepository
{
  sortableFields: string[] = ['name', 'email', 'created_at']

  async findByEmail(email: string): Promise<CustomerModel> {
    const model = this.items.find(item => item.email === email)
    if (!model) {
      throw new NotFoundError(`Customer not found using email ${email}`)
    }
    return model
  }

  async findByName(name: string): Promise<CustomerModel> {
    const model = this.items.find(item => item.name === name)
    if (!model) {
      throw new NotFoundError(`Customer not found using name ${name}`)
    }
    return model
  }

  async conflictingEmail(email: string): Promise<void> {
    const customer = this.items.find((item: any) => item.email === email)
    if (customer) {
      throw new ConflictError('Email already used on another customer')
    }
  }

  protected async applyFilter(
    items: CustomerModel[],
    filter: string,
  ): Promise<CustomerModel[]> {
    if (!filter) {
      return items
    }
    return items.filter(item => {
      return item.name.toLowerCase().includes(filter.toLowerCase())
    })
  }

  protected async applySort(
    items: CustomerModel[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<CustomerModel[]> {
    return super.applySort(items, sort ?? 'created_at', sortDir ?? 'desc')
  }
}
