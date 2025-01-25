import { env } from '@/common/infrastructure/env'
import { UserModel } from '@/users/domain/models/users.model'
import { Exclude, Expose } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class User implements UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  @Exclude()
  password: string

  @Column()
  avatar?: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Expose({ name: 'avatar_url' })
  getAvatarUrl() {
    if (!this.avatar) return null
    return `${env.CLOUDFLARE_R2_URL}/${this.avatar}`
  }
}
