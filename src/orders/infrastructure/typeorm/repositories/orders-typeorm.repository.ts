import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { OrderModel } from '@/orders/domain/models/orders.model'
import {
  CreateOrderProps,
  OrdersRepository,
} from '@/orders/domain/repositories/orders.repository'
import { inject, injectable } from 'tsyringe'
import { DataSource, Repository } from 'typeorm'
import { Order } from '../entities/orders.entity'
import { Product } from '@/products/infrastructure/typeorm/entities/products.entity'
import { ProductsTypeormRepository } from '@/products/infrastructure/typeorm/repositories/products-typeorm.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

@injectable()
export class OrdersTypeormRepository implements OrdersRepository {
  constructor(
    @inject('OrdersDefaultRepositoryTypeorm')
    private ordersRepository: Repository<Order>,
    @inject('ProductRepository')
    private productsRepository: ProductsTypeormRepository,
  ) {}

  async createOrder(
    connection: DataSource,
    props: CreateOrderProps,
  ): Promise<OrderModel> {
    const order = await this.createOrderTransaction(connection, props)
    // O estoque mudou: a listagem de produtos em cache ficou desatualizada
    await this.productsRepository.invalidateCache()
    return order
  }

  private async createOrderTransaction(
    connection: DataSource,
    { customer, products: requestedProducts }: CreateOrderProps,
  ): Promise<OrderModel> {
    return connection.manager.transaction(async transactionalEntityManager => {
      // Criar itens do pedido
      const serializedOrderProducts = requestedProducts.map(product => ({
        product_id: product.id,
        quantity: product.quantity,
        price: product.price,
      }))

      // Ler cada produto dentro da transação, com trava de escrita, em ordem de id
      const productIds = [
        ...new Set(serializedOrderProducts.map(p => p.product_id)),
      ].sort()
      const lockedProducts = new Map<string, Product>()
      for (const productId of productIds) {
        const product = await transactionalEntityManager.findOne(Product, {
          where: { id: productId },
          lock: { mode: 'pessimistic_write' },
        })
        if (!product) {
          throw new NotFoundError(`Product not found using ID ${productId}`)
        }
        lockedProducts.set(productId, product)
      }

      // Verificar e baixar o estoque de cada item
      for (const serializedOrderProduct of serializedOrderProducts) {
        const product = lockedProducts.get(serializedOrderProduct.product_id)
        if (serializedOrderProduct.quantity > product.quantity) {
          throw new BadRequestError(`Product ${product.id} is out of stock`)
        }
        product.quantity -= serializedOrderProduct.quantity
      }

      // Criar pedido
      const newOrder = transactionalEntityManager.create(Order, {
        customer_id: customer.id,
        order_products: serializedOrderProducts,
      })
      const order = await transactionalEntityManager.save(newOrder)

      // Atualizar estoque de cada produto
      await transactionalEntityManager.save([...lockedProducts.values()])

      return order
    })
  }

  create(props: CreateOrderProps): OrderModel {
    throw new Error('Method not implemented.')
  }

  insert(model: OrderModel): Promise<OrderModel> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<OrderModel> {
    return this._get(id)
  }

  update(model: OrderModel): Promise<OrderModel> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  search(props: SearchInput): Promise<SearchOutput<OrderModel>> {
    throw new Error('Method not implemented.')
  }

  protected async _get(id: string): Promise<OrderModel> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        order_products: true,
      },
    })
    if (!order) {
      throw new NotFoundError(`Order not found using ID ${id}`)
    }
    return order
  }
}
