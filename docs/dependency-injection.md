## Injeção de Dependências

Agora que já temos a primeira funcionalidade disponível na API, vamos refatorar esse processo de criação de produtos fazendo uso da biblioteca [tsyringe](https://github.com/microsoft/tsyringe).

`tsyringe` é uma biblioteca de injeção de dependência projetada para ser fácil de usar e integrar em projetos TypeScript, proporcionando uma maneira eficaz de gerenciar dependências e facilitar o desenvolvimento de aplicativos modulares.

Principais recursos:

- `Injeção de Dependência`: Permite a injeção de dependências em classes sem a necessidade de instanciar manualmente as dependências.
- `Decorators`: Usa decorators como `@injectable`, `@inject` e `@singleton` para marcar classes e gerenciar dependências.
- `Container de Dependência`: Fornece um container que gerencia as instâncias das dependências.
- `Resolução Automática`: Resolve automaticamente as dependências sem a necessidade de configuração explícita.


Instalar a biblioteca:

```shell
npm install tsyringe
```

Existem algumas formas de registrar uma classe no container.


### registerSingleton

`Uso`: Registra uma única instância de uma classe para ser usada em todo o aplicativo.

`Comportamento`: A primeira vez que a dependência é resolvida, uma nova instância é criada e, em seguida, essa mesma instância é reutilizada para todas as resoluções subsequentes.

`Ideal Para`: Serviços ou componentes que devem ter uma única instância compartilhada em todo o aplicativo, como serviços de configuração ou gerenciadores de estado.


### registerInstance

`Uso`: Registra uma instância específica de uma classe ou objeto para ser usada como dependência.

`Comportamento`: A instância registrada é usada sempre que a dependência é resolvida.

`Ideal Para`: Quando você já tem uma instância existente de um serviço ou objeto e deseja registrá-la diretamente no container.


### register

`Uso`: Permite registrar uma dependência com uma configuração personalizada.

`Comportamento`: Pode ser configurado para registrar uma instância, uma fábrica de instâncias ou uma classe, e pode especificar se a instância deve ser singleton ou não. O comportamento padrão não garante uma instância única (não é singleton).

`Ideal Para`: Situações em que você precisa de mais controle sobre como a dependência é resolvida.


### O método container.resolve()

O método `container.resolve()` é essencial para utilizar a injeção de dependência com `tsyringe`, permitindo que você obtenha do container as instâncias das classes registradas de forma fácil e eficiente, mantendo seu código modular e desacoplado.


### Decorator @injectable()

`Propósito`: Marca uma classe como disponível para a injeção de dependências.

`Uso`: Deve ser usado em qualquer classe que você deseja que seja injetável pelo container de injeção de dependências.


### @inject()

`Propósito`: Especifica que uma dependência deve ser injetada em um parâmetro de construtor ou propriedade.

`Uso`: Deve ser usado quando você deseja injetar uma dependência específica em um parâmetro de construtor ou propriedade de uma classe.
