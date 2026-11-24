import 'reflect-metadata'
import { RedisCache } from './redis.cache'
import { RedisCacheRepository } from './redis.repository'

jest.mock('./redis.cache')

describe('RedisCacheRepository unit tests', () => {
  let repository: RedisCacheRepository
  let redisCacheMock: jest.Mocked<RedisCache>

  beforeEach(() => {
    redisCacheMock = new RedisCache() as jest.Mocked<RedisCache>
    repository = new RedisCacheRepository(redisCacheMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('set', () => {
    it('should call redis.set with correct parameters', async () => {
      const key = 'test_key'
      const value = 'test_value'

      await repository.set(key, value)

      expect(redisCacheMock.set).toHaveBeenCalledWith(key, value, 'EX', 60 * 15)
    })
  })

  describe('get', () => {
    it('should call redis.get and return the value', async () => {
      const key = 'test_key'
      const expectedValue = 'cached_value'
      redisCacheMock.get.mockResolvedValue(expectedValue)

      const result = await repository.get(key)

      expect(redisCacheMock.get).toHaveBeenCalledWith(key)
      expect(result).toBe(expectedValue)
    })

    it('should return null if redis.get returns null', async () => {
      const key = 'non_existent_key'
      redisCacheMock.get.mockResolvedValue(null)

      const result = await repository.get(key)

      expect(redisCacheMock.get).toHaveBeenCalledWith(key)
      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should call redis.del with the correct key', async () => {
      const key = 'test_key'

      await repository.delete(key)

      expect(redisCacheMock.del).toHaveBeenCalledWith(key)
    })
  })

  describe('keys', () => {
    it('should call redis.keys with the correct pattern', async () => {
      const pattern = 'test_pattern'

      await repository.keys(pattern)

      expect(redisCacheMock.keys).toHaveBeenCalledWith(pattern)
    })
  })
})
