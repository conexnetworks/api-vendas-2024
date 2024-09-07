import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ProductsInMemoryRepository } from './products-in-memory.repository'
import { ProductsDataBuilder } from '../../testing/helpers/products-data-builder'
import { ConflictError } from '@/common/domain/errors/conflict-error'

describe('ProductsInMemoryRepository unit tests', () => {
  let sut: ProductsInMemoryRepository

  beforeEach(() => {
    sut = new ProductsInMemoryRepository()
  })

  describe('findByName', () => {
    it('should throw error when product not found', async () => {
      await expect(() => sut.findByName('fake_name')).rejects.toThrow(
        new NotFoundError('Product not found using name fake_name'),
      )
      await expect(() => sut.findByName('fake_name')).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })

    it('should find a product by name', async () => {
      const data = ProductsDataBuilder({ name: 'Curso nodejs' })
      sut.items.push(data)
      const result = await sut.findByName('Curso nodejs')
      expect(result).toStrictEqual(data)
    })
  })

  describe('conflictingName', () => {
    it('should throw error when product found', async () => {
      const data = ProductsDataBuilder({ name: 'Curso nodejs' })
      sut.items.push(data)

      await expect(() => sut.conflictingName('Curso nodejs')).rejects.toThrow(
        new ConflictError('Name already used on another product'),
      )
      await expect(() =>
        sut.conflictingName('Curso nodejs'),
      ).rejects.toBeInstanceOf(ConflictError)
    })

    it('should not find a product by name', async () => {
      expect.assertions(0)
      await sut.conflictingName('Curso nodejs')
    })
  })
})
