# Visao geral JWT

## O que é JWT?

[JWT](https://jwt.io/) é uma forma segura de transmitir informações entre duas partes, seguindo o padrão definido na RFC 7519.

A autenticação é stateless ou sem estado, ou seja, as partes não armazenam as informações de acesso, que são mantidas no próprio token.

O token é composto por 3 partes:

* `Header` - informações do próprio token, como por exemplo o tipo de algoritmo usado.

* `Payload` - contém as informações que desejamos enviar entre as duas partes.

* `Verify Signature` - é a garantia de que um token não foi alterado; o resultado dessa assinatura é uma combinação com os outros três campos, e se algo for modificado em qualquer dos campos, a assinatura também se modificará, e então o token será considerado inválido.

Para validar o token, e consequentemente as informações, pode-se ter uma chave secreta ou ainda trabalhar com chaves pública e privada. Essa mesma chave também é usada para assinar o token na criação.

O [JWT](https://jwt.io/) é amplamente utilizado como uma forma de autenticação em APIs, porém, se não tivermos o conhecimento necessário para implementar essa funcionalidade com boas práticas, o sistema de autenticação poderá apresentar falhas que comprometerão a segurança da aplicação como um todo.

## Instalação JWT

[Instalação do JWT](https://jwt.io/libraries?language=Node.js).

```bash
npm install jsonwebtoken

npm install -D @types/jsonwebtoken
```

Configurar as variaveis de ambiente para trabalhar com o JWT.

Arquivos `.env`, `.env.test` e `.env.example`:

```bash
JWT_SECRET=my_secret
JWT_EXPIRES_IN=86400    # 1 dia em segundos
```
