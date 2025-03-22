import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { CustomerModel } from '@/customers/domain/models/customers.model'

export function CustomersDataBuilder(
  props: Partial<CustomerModel>,
): CustomerModel {
  return {
    id: props.id ?? randomUUID(),
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  }
}
