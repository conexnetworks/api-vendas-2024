## Upload de arquivos

Este documento conterá um resumo do que implementaremos na parte de upload de arquivos.

E quando trabalhamos com uma API Restful, geralmente transacionamos os dados entre front-end e back-end utilizando o formato `JSON`.

Porém, o formato de dados JSON não funciona pra upload de arquivos, é até possível enviar um arquivo dentro de um JSON, mas teríamos que converter o arquivo para o formato base64, o que não é recomendável porque o tamanho fica enorme.

A prática comum é criar uma rota separada para tratar as requisições que envolvem upload de arquivos, definindo o formato de dados para `multipart/form-data`.

### Requisitos Funcionais

Em nosso projeto implementaremos o recurso de upload de arquivos para cadastramento de imagem de avatar (perfil) dos usuários.

O serviço de upload de arquivo deverá atender as regras de negócios listadas abaixo.

**Requisitos Funcionais:**

- O usuário deverá estar autenticado para atualizar a própria imagem de avatar.
- Não permitir upload de arquivo com tamanho maior que 3MB.
- Permitir upload de arquivo com tipo somente entre as seguintes opções: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`.

### Multer

[Multer](https://github.com/expressjs/multer/blob/master/doc/README-pt-br.md)

Multer é um middleware Node.js para manipulação de dados no formato `multipart/form-data`, que é usado principalmente para upload de arquivos. Estaremos instalando e usando o Multer no projeto.

### Cloudflare R2

[Cloudflare R2](https://dash.cloudflare.com/sign-up/r2/)

Existem vários sistemas específicos para upload de arquivos, e com certeza você já deve ter ouvido falar do `Amazon S3`, que é o mais famoso.

O Amazon S3 é uma aplicação de armazenamento da Amazon, muito antiga e muito robusta.

Mas aqui neste projeto não usaremos o Amazon S3, por dois motivos principais:

- O primeiro é porque você é obrigado a cadastrar um cartão de crédito ao criar sua conta na Amazon.
- O segundo motivo é o custo.

Porque o Amazon S3, apesar de ser barato, não é o mais barato, cobra uma taxa de egresso de arquivos, ou seja, cada vez que você baixa um arquivo, você vai pagar essa taxa de egresso.

E isso pode ficar bem caro caso você tenha uma aplicação que faz upload de arquivos, por exemplo, vídeos, imagens, e os usuários da aplicação podem interagir com esses arquivos. Por isso usaremos o `Cloudflare R2`.

O `Cloudflare R2` funciona da mesma maneira que o Amazon S3 para armazenamento de arquivos, só que ele não cobra taxa de egressos, ficando bem mais barato que o Amazon S3.

Outra vantagem é que o Cloudflare R2 permite o uso da API do Amazon S3, ou seja, se você em algum momento quiser migrar para o Amazon S3, a implementação será a mesma.

### Implementação do Uploader com o Multer e o SDK Client S3 da Amazon

[SDK do Client S3](https://docs.aws.amazon.com/pt_br/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html)

Instalar o Multer e a SDK do Client S3 para criar a implementação do upload de imagens para avatar de usuários.

```shell
npm install multer @aws-sdk/client-s3

npm install @types/multer -D
```

