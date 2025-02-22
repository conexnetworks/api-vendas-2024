import { Router } from 'express'
import { sendEmailToResetPasswordController } from '../controllers/send-email-to-reset-password.controller'
import { resetPasswordController } from '../controllers/reset-password.controller'

const passwordRouter = Router()

passwordRouter.post('/forgot', sendEmailToResetPasswordController)

passwordRouter.post('/reset', resetPasswordController)

export { passwordRouter }
