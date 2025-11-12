import { Router } from 'express'
import { createCustomerController } from '../controllers/create-customer.controller'
import { isAuthenticated } from '@/common/infrastructure/http/middlewares/isAuthenticated'
import { searchCustomerController } from '../controllers/search-customer.controller'
import { getCustomerController } from '../controllers/get-customer.controller'

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

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Returns a paginated list of customers
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: null
 *         description: Field to sort by
 *       - in: query
 *         name: sort_dir
 *         schema:
 *           type: string
 *           default: null
 *         description: Sort direction (asc or desc)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           default: null
 *         description: Filter string to search for specific customers
 *     responses:
 *       200:
 *         description: A paginated list of customers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerListResponse'
 *       401:
 *         description: Unauthorized
 */
customersRouter.get('/', isAuthenticated, searchCustomerController)

customersRouter.get('/:id', isAuthenticated, getCustomerController)

export { customersRouter }
