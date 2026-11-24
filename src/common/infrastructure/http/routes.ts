import { Router } from 'express'
import { customersRouter } from '@/customers/infrastructure/http/routes/customers.route'
import { ordersRouter } from '@/orders/infrastructure/http/routes/orders.route'
import { productsRouter } from '@/products/infrastructure/http/routes/products.route'
import { authRouter } from '@/users/infrastructure/http/routes/auth.route'
import { passwordRouter } from '@/users/infrastructure/http/routes/password.route'
import { usersRouter } from '@/users/infrastructure/http/routes/users.route'
import { rateLimiter } from './middlewares/rateLimiter'

const routes = Router()

routes.use(rateLimiter)

routes.get('/', (req, res) => {
  return res.status(200).json({ message: 'Olá Dev!' })
})

routes.use('/products', productsRouter)

routes.use('/auth', authRouter)

routes.use('/users', usersRouter)

routes.use('/password', passwordRouter)

routes.use('/customers', customersRouter)

routes.use('/orders', ordersRouter)

export { routes }
