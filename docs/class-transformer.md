## Class transformer

Neste módulo estaremos instalando e configurando o uso da biblioteca `Class Transformer` em nossa API.

[Class Transformer](https://github.com/typestack/class-transformer) é uma biblioteca JavaScript que facilita a conversão entre classes TypeScript/JavaScript e objetos planos (plain objects). Ela é frequentemente usada em conjunto com frameworks como o NestJs para simplificar a serialização e desserialização de dados.

Class Transformer permitirá, entre outras coisas, modificar a forma como as informações de nossas Entidades são retornadas, podendo inclusive inibir atributos que não desejamos incluir nas respostas.

Principais recursos e benefícios:

- `Serialização e desserialização`: Facilita a transformação de objetos de classe em formatos como JSON e vice-versa. Isso é especialmente útil ao lidar com APIs REST, onde os dados geralmente são transmitidos em JSON.
- `Mapeamento de propriedades`: Permite mapear propriedades de classes para diferentes nomes ou formatos em objetos planos, usando decoradores como @Expose, @Type e @Transform.
- `Validação`: Pode ser integrado com bibliotecas de validação como o class-validator para garantir a integridade dos dados durante a transformação.
- `Simplificação do código`: Reduz a quantidade de código clichê necessário para realizar a conversão manual de objetos, tornando o código mais limpo e legível.

Exemplo de uso:

```ts
import { plainToClass, classToPlain } from 'class-transformer';

class User {
  id: number;
  firstName: string;
  lastName: string;
}

const userPlainObject = { id: 1, firstName: 'John', lastName: 'Doe' };
const userClassObject = plainToClass(User, userPlainObject); // Converte para objeto de classe
const plainObjectAgain = classToPlain(userClassObject); // Converte de volta para objeto plano
```

