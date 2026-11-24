import path from 'node:path'
import { DataSource } from 'typeorm'
import { env } from '../env'

// a pasta src com o ts-node-dev, a pasta dist no código compilado
const root = path.resolve(__dirname, '..', '..', '..')

export const dataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  schema: env.DB_SCHEMA,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASS,
  entities: [`${root}/**/entities/**/*.{ts,js}`],
  migrations: [`${root}/**/migrations/**/*.{ts,js}`],
  synchronize: false,
  logging: false,
})
