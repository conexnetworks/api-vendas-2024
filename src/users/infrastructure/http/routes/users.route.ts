import { Router } from 'express'
import { createUserController } from '../controllers/create-user.controller'

const usersRouter = Router()

usersRouter.post('/', createUserController)

export { usersRouter }
