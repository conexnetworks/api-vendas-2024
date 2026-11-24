import { NextFunction, Request, Response } from 'express'
import { container } from 'tsyringe'
import { RateLimiterRedis } from 'rate-limiter-flexible'

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const rateLimiterRedis: RateLimiterRedis =
    container.resolve('RateLimiterRedis')

  rateLimiterRedis
    .consume(req.ip)
    .then(() => {
      next()
    })
    .catch(_ => {
      res.status(429).send('Muitas requisições! Tente novamente mais tarde.')
    })
}
