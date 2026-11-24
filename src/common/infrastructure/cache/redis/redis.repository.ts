import { inject, injectable } from 'tsyringe'
import { CacheRepository } from '../cache.repository'
import { RedisCache } from './redis.cache'

@injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(
    @inject('RedisCache')
    private readonly redis: RedisCache,
  ) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60 * 15)
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern)
  }
}
