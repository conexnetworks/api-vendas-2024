import { CacheRepository } from '../cache.repository'

export class CacheInMemoryRepository implements CacheRepository {
  items = new Map<string, string>()

  async set(key: string, value: string): Promise<void> {
    this.items.set(key, value)
  }

  async get(key: string): Promise<string | null> {
    return this.items.get(key) ?? null
  }

  async delete(key: string): Promise<void> {
    this.items.delete(key)
  }
}
