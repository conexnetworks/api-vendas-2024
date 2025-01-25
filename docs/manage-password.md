## Gerenciamento de Senhas

Neste módulo implementaremos os recursos para gerenciamento de senhas, dando ao usuário a opção de recuperar a senha através do email cadastrado e, com isso, definir nova senha.

### Requisitos

1. Basicamente, o usuário informa o seu email, recebe um email com um link para proceder com o cadastro de nova senha.

2. Esse link deve ter validade de até 2 horas, contendo a identificação do usuário para evitar que qualquer pessoa possa redefinir senha em nome de outra pessoa. Após o prazo definido, o token será invalidado e o usuário terá que enviar uma nova solicitação.

3. Precisaremos armazenar essa informação do token para que possamos controlar a validade e a identificação do usuario. E para isso criaremos uma nova entidade na aplicação, denominada `UserToken`.

4. Utilizaremos o `Ethereal Email` para testar envio de email em ambiente de desenvolvimento.

### Ethereal.email

[Ethereal Email](https://ethereal.email/) é um serviço de email falso e gratuito, projetado principalmente para fins de teste. Ele é especialmente popular entre usuários do `Nodemailer`. Os emails enviados através do Ethereal nunca são entregues, tornando-o seguro para testes.

Como funciona:

`Configuração`: Você configura o Ethereal como seu servidor SMTP de saída em seu aplicativo de email ou ambiente de desenvolvimento.
`Envio de emails`: Quando você envia emails através do Ethereal, eles não são realmente entregues aos destinatários. Em vez disso, o Ethereal captura e armazena os emails, permitindo que você os visualize através de uma interface web ou usando um cliente IMAP.
`Acesso IMAP/POP3`: Você pode acessar os emails capturados usando seu cliente de email favorito.
`Interface web`: O Ethereal fornece uma interface web para visualizar e gerenciar os emails.

Principais usos do Ethereal.email:

`Testar a funcionalidade de email`: O Ethereal é ótimo para testar a funcionalidade de envio de email de seus aplicativos sem enviar emails reais.
`Depurar problemas de email`: Se você estiver tendo problemas com a entrega de email, o Ethereal pode ajudá-lo a diagnosticar o problema.
`Visualizar emails`: Você pode usar o Ethereal para visualizar como seus emails ficarão antes de enviá-los para destinatários reais.

### Nodemailer

[Nodemailer](https://nodemailer.com/) é uma biblioteca popular e amplamente utilizada no ecossistema Node.js para lidar com o envio de emails em diversos tipos de aplicações.

