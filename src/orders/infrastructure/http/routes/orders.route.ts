import { Router } from 'express'
import { createOrderController } from '../controllers/create-order.controller'
import { isAuthenticated } from '@/common/infrastructure/http/middlewares/isAuthenticated'

const ordersRouter = Router()

ordersRouter.post('/', isAuthenticated, createOrderController)

export { ordersRouter }
