import { productsRouter } from '@/products/infrastructure/http/routes/products.route'
import { authRouter } from '@/users/infrastructure/http/routes/auth.route'
import { passwordRouter } from '@/users/infrastructure/http/routes/password.route'
import { usersRouter } from '@/users/infrastructure/http/routes/users.route'
import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  return res.status(200).json({ message: 'Olá Dev!' })
})

routes.use('/products', productsRouter)

routes.use('/auth', authRouter)

routes.use('/users', usersRouter)

routes.use('/password', passwordRouter)

export { routes }
