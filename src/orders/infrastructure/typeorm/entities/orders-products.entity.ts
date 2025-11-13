import { OrderProductModel } from '@/orders/domain/models/orders-products.model'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Order } from './orders.entity'
import { Product } from '@/products/infrastructure/typeorm/entities/products.entity'

@Entity('orders_products')
export class OrderProduct implements OrderProductModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column()
  product_id: string

  @Column()
  order_id: string

  @Column('decimal')
  price: number

  @Column('int')
  quantity: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
