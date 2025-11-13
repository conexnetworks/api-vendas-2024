import { OrderProduct } from '@/orders/infrastructure/typeorm/entities/orders-products.entity'
import { ProductModel } from '@/products/domain/models/products.model'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('products')
export class Product implements ProductModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('decimal')
  price: number

  @Column('int')
  quantity: number

  @OneToMany(() => OrderProduct, order_products => order_products.product)
  order_products: OrderProduct[]

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date
}
