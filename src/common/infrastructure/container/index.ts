import { container } from 'tsyringe'
import '@/products/infrastructure/container'
import '@/users/infrastructure/container'
import '@/customers/infrastructure/container'
import '@/orders/infrastructure/container'
import { BcryptjsHashProvider } from '../providers/hash-provider/bcryptjs-hash.provider'
import { JwtAuthProvider } from '../providers/auth-provider/auth-provider.jwt'
import { R2Uploader } from '../providers/storage-provider/r2.uploader'
import { RedisCache } from '../cache/redis/redis.cache'
import { RedisCacheRepository } from '../cache/redis/redis.repository'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import { JsonMailProvider } from '../providers/mail-provider/json.mail-provider'

container.registerSingleton('HashProvider', BcryptjsHashProvider)
container.registerSingleton('AuthProvider', JwtAuthProvider)
container.registerSingleton('UploaderProvider', R2Uploader)
container.registerSingleton('RedisCache', RedisCache)
container.registerSingleton('CacheRepository', RedisCacheRepository)
container.registerSingleton('MailProvider', JsonMailProvider)

container.register('RateLimiterRedis', {
  useValue: new RateLimiterRedis({
    storeClient: container.resolve('RedisCache'),
    keyPrefix: 'rate-limit:',
    points: 5, // Limite de 5 pontos por IP
    duration: 1, // Período de tempo (em segundos)
    blockDuration: 60, // Bloqueio de 1 minuto (em segundos) se o limite for excedido
  }),
})
