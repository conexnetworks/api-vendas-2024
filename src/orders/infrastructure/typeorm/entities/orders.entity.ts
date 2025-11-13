import { Customer } from '@/customers/infrastructure/typeorm/entities/customers.entity'
import { OrderModel } from '@/orders/domain/models/orders.model'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { OrderProduct } from './orders-products.entity'

@Entity('orders')
export class Order implements OrderModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  customer_id: string

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer

  @OneToMany(() => OrderProduct, order_products => order_products.order, {
    cascade: true,
  })
  order_products: OrderProduct[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
