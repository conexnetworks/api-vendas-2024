## Interface para Repositórios

Um Repositório terá como responsabilidade salvar, buscar, atualizar e excluir os dados em uma estrutura de dados, podendo ser um SGBD, arquivo, memória, etc.

> IMPORTANTE: um repositório NAO deve conter regras de negócio. As regras de negócios devem ficar nas entidades e/ou nos casos de usos.

Outro ponto importante para ressaltar é que um Repositório terá que acessar recursos externos, que estarão nas camadas mais externas, para acessar a estrutura de dados.

Por conta disso, precisaremos criar "contratos" através de interfaces para isolar esses recursos externos da camada de domínio da aplicacao.

Ou seja, na camada de domínio ficarão as interfaces que definem tudo que precisaremos manipular através de um repositório.

Nesta aula criaremos a abstração com as definições dos contratos a serem seguidos por cada implementação de repositórios em nossa api.

É importante lembrar que essa interface deve representar qualquer tipo de model a ser manipulado.
