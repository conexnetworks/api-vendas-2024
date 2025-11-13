import { Customer } from '@/customers/infrastructure/typeorm/entities/customers.entity'
import { OrderProductModel } from '@/orders/domain/models/orders-products.model'
import { OrderModel } from '@/orders/domain/models/orders.model'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

@Entity('orders')
export class Order implements OrderModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  customer_id: string

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer

  order_products: OrderProductModel[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
