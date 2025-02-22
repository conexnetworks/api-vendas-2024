import { Router } from 'express'
import { sendEmailToResetPasswordController } from '../controllers/send-email-to-reset-password.controller'

const passwordRouter = Router()

passwordRouter.post('/forgot', sendEmailToResetPasswordController)

export { passwordRouter }
