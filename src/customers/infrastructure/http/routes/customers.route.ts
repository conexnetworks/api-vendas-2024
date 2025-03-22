import { Router } from 'express'
import { createCustomerController } from '../controllers/create-customer.controller'
import { isAuthenticated } from '@/common/infrastructure/http/middlewares/isAuthenticated'

const customersRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the customer
 *         name:
 *           type: string
 *           description: The name of the customer
 *         email:
 *           type: string
 *           description: The email of the customer
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the customer was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the customer was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         name: Sample Customer
 *         email: samplecustomer@mail.com
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: The customers managing API
 */

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: The customer was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Input data not provided or invalid
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already used on another customer
 */
customersRouter.post('/', isAuthenticated, createCustomerController)

export { customersRouter }
