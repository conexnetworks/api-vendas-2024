## O que são casos de uso - Use Cases?

Os casos de uso são os serviços da nossa aplicação responsáveis por operacionalizar as entidades e repositórios, para atender determinadas regras de negócios.

No livro "Arquitetura Limpa" o autor define que as entidades são as regras cruciais do negócio, mas existem outras regras a serem implementadas, que são as regras de aplicação.

As regras cruciais são aquelas mais puras, que não sofrem interferência de nada externo, como por exemplo bibliotecas ou frameworks.

Já as regras de aplicação normalmente farão uso de outras bibliotecas para que se tenha a funcionalidade esperada, como por exemplo, para "salvar um produto" usaremos um ORM para armazenar os dados em banco de dados.

Os casos de uso serão responsáveis por resolver essas regras de aplicação.

Através dos casos de uso podemos ver o motivo da existência do software, eles expõem cada necessidade a ser atendida e podem ser vistos como um manual de uso do software.

Todos os recursos externos (HTTP, mensageria, email, banco de dados, etc) se relacionam com a nossa aplicação através dos casos de uso.

A ideia é criarmos os casos de uso na camada `application` exatamente por ser a estrutura responsável por tratar as regras de aplicação.

> Alguns desenvolvedores preferem criar os casos de uso na camada de dominio.


## Configurando os serviços de produtos

Criaremos cada caso de uso seguindo o princípio de `Single Responsability` do SOLID, que implica em criação de classes com apenas uma responsabilidade.

Outro ponto importante para a implementação de um caso de uso é a definição de quais dados devem ser recebidos para que o processamento aconteça. A mesma coisa devemos considerar no retorno da informação que foi criada. Devemos converter a entidade criada em uma estrutura específica, para que seja enviada como dados de retorno.

### Implementação dos casos de usos para produtos

*Requisitos que precisam ser atendidos:*

- O nome do produto é obrigatório.
- O preço do produto é obrigatório.
- A quantidade do produto é obrigatória.
- Não pode cadastrar um produto com nome igual ao de outro produto.

E para persistir os dados precisaremos de um repositório. Como devemos considerar qualquer tipo de estrutura de dados sendo usada para essa operação (memoria, mysql, mongodb, etc), usaremos o método construtor para injetar o repositório como uma dependencia da nossa classe do caso de uso.

## Configurando os serviços de usuários

### Implementação dos casos de usos para usuários

*Requisitos que precisam ser atendidos:*

- O nome é obrigatório.
- O email é obrigatório.
- Não pode cadastrar um usuario com email igual ao de outro usuario.
- A senha é obrigatória.
- A senha deve ser armazenada com criptografia.
- O campo avatar é opcional e será preenchido através de uma rota específica de atualização.
