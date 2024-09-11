## Integration Tests

Definição retirada do site [Wikipedia](https://pt.wikipedia.org/wiki/Teste_de_integra%C3%A7%C3%A3o).

**Teste de integração** é a fase do teste de software em que módulos são combinados e testados em grupo. Ela sucede o teste de unidade, em que os módulos são testados individualmente, e antecede o teste de sistema, em que o sistema completo (integrado) é testado num ambiente que simula o ambiente de produção.

Tarefas que precisamos executar:

1. Criar o arquivo de configuração do Jest para testes de integracao especificamente.
2. Customizar o script para rodar os testes de integracao.
3. Criar um banco de dados específico para execucao dos testes. Faremos isso diretamente nos scripts do arquivo `package.json`.
4. Criar a conexão do TypeORM específica para os testes.


### Executando cada etapa

1. Arquivo de configuração.

Arquivo `jest.int.config.ts`:

```js
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

export default {
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testRegex: '.*\\.int-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
}
```

2. Criar o script para rodar os testes de integração.

> Esse script dos testes de integração precisará executar o comando `docker` para subir o banco de dados de testes.

Arquivo `package.json`:

```json
"scripts": {
  "pretest:int": "docker run --name testsdb -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d postgres",
  "test:int": "npx dotenv-cli -e .env.test -- jest --runInBand --config ./jest.int.config.ts",
  "posttest:int": "docker stop testsdb && docker rm testsdb"
}
```

3. Criar a conexão do TypeORM específica para os testes.


Arquivo `src/common/infrastrcture/typeorm/testing/data-source.ts`:

```js
import { DataSource } from 'typeorm'
import { env } from '@/common/infrastructure/env'

export const testDataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  schema: env.DB_SCHEMA,
  entities: ['**/entities/**/*.ts'],
  migrations: ['**/migrations/**/*.ts'],
  synchronize: true,
  logging: true,
})
```

> IMPORTANTE: ajustar a porta de conexao com o banco de dados de testes para 5433, no arquivo `.env.test`.

Arquivo `.env.test`:

```shell
PORT=3333
NODE_ENV=test

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5433
DB_SCHEMA=public
DB_NAME=postgres
DB_USER=postgres
DB_PASS=postgres
```

