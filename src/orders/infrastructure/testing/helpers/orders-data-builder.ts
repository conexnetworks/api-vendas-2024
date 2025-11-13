import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { CustomersDataBuilder } from '@/customers/infrastructure/testing/helpers/customers-data-builder'
import { OrderModel } from '@/orders/domain/models/orders.model'
import { CreateOrderProps } from '@/orders/domain/repositories/orders.repository'

type BuildOrderProps = CreateOrderProps & {
  id: string
  created_at: Date
  updated_at: Date
}

export function OrdersDataBuilder(props: Partial<OrderModel>): BuildOrderProps {
  const customer_id = props.customer_id ?? randomUUID()
  return {
    id: props.id ?? randomUUID(),
    customer: CustomersDataBuilder({ id: customer_id }),
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
    products: [
      {
        id: randomUUID(),
        name: faker.commerce.productName(),
        price: Number(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
        quantity: Number(faker.finance.amount({ min: 3, max: 10, dec: 0 })),
        created_at: props.created_at ?? new Date(),
        updated_at: props.updated_at ?? new Date(),
      },
      {
        id: randomUUID(),
        name: faker.commerce.productName(),
        price: Number(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
        quantity: Number(faker.finance.amount({ min: 3, max: 10, dec: 0 })),
        created_at: props.created_at ?? new Date(),
        updated_at: props.updated_at ?? new Date(),
      },
    ],
  }
}
