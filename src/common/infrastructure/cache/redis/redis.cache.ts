import { Redis } from 'ioredis'
import { env } from '../../env'

export class RedisCache extends Redis {
  constructor() {
    super({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      username: env.REDIS_USER || undefined,
      password: env.REDIS_PASS || undefined,
      db: 0,
    })
  }
}
