import { Router } from 'express'
import { createOrderController } from '../controllers/create-order.controller'
import { isAuthenticated } from '@/common/infrastructure/http/middlewares/isAuthenticated'
import { getOrderController } from '../controllers/get-order.controller'

const ordersRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customer_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the order
 *         customer_id:
 *           type: string
 *           description: The id of the customer
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the order was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the order was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         customer_id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: The orders managing API
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: The order was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Input data not provided or invalid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 *       409:
 *         description: Email already used on another order
 */
ordersRouter.post('/', isAuthenticated, createOrderController)

ordersRouter.get('/:id', isAuthenticated, getOrderController)

export { ordersRouter }
