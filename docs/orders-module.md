## Orders Module

Nesta seção implementaremos os recursos referentes aos pedidos de compras.

Através desse módulo poderemos explorar mais recursos do TypeORM, principalmente as funcionalidades de relacionamento muitos-para-muitos entre tabelas.

### Requisitos para criação de Pedido de Compra

Validações que devem ser implementadas durante a criação de um pedido de compras na aplicação:

1. Não permitir a criação de um pedido de compras com um cliente que não existe na aplicação.
2. Não permitir a criação de um pedido de compras com um produto que não existe na aplicação.
3. Não permitir a criação de um pedido de compras com um produto que não possue quantidade em estoque suficiente.
4. Ao criar um novo pedido, atualizar a quantidade em estoque de cada produto.

### Módulo de Pedidos de Compras

Tabelas envolvidas nesse módulo:

**- `orders`** - tabela dos pedidos de compras.

**- `customers`** - tabela dos clientes.

**- `products`** - tabela dos produtos.

**- `orders_products`** - tabela **pivô** para armazenar os dados do relacionamento `ManyToMany` entre `products` e `orders`, onde vários produtos podem estar em vários pedidos de compras.

Para cadastrar um novo pedido de compras na tabela `orders`, os dados enviados no corpo da requisição devem ser: o `customer_id` e um array de `products` contendo o `id` e a `quantity` para cada produto. Exemplo:

```json
{
  "customer_id": "b5694f2a-4048-63ae-bd42-593860adf6e9",
  "products": [
    {
      "id": "e39595ae-63ae-4048-9a8a-593860adf6e9",
      "quantity": 1
    },
    {
      "id": "b5694f2a-3f31-40c6-803d-593860adf6e9",
      "quantity": 3
    }
  ]
}
```

### Tratamento dos dados da requisição (POST /orders)

Implementar um relacionamento `ManyToMany` entre produtos e pedidos, para permitir que um produto possa ser incluído em mais de um pedido, bem como permitir que um pedido contenha mais de um produto.

Com isso, você deve sempre armazenar o valor do produto e a quantidade pedida no momento da compra, na tabela pivô `orders_products`.

Essa tabela `orders_products` deve ter os campos: `id`, `order_id`, `product_id`, `quantity`, `price`, `created_at` e `updated_at`.

Com os dados recebidos, devemos cadastrar na tabela `orders` um novo pedido, que estará relacionado ao cliente informado em `customer_id`, além dos campos `created_at` e `updated_at`. Os dados do array de produtos devem ser cadastrados na tabela `orders_products`, que são eles: o `product_id`, `order_id`, `price`, `quantity`, `created_at` e `updated_at`.

> Github do TypeORM: [Relacionamentos](https://github.com/typeorm/typeorm/blob/master/docs/relations.md)

### Retornando os dados de um Pedido (GET /orders/:id)

Precisaremos retornar as informações de um pedido específico, com todas as informações que podem ser recuperadas através dos relacionamentos entre as tabelas `orders`, `customers` e `orders_products`. Exemplo:

```json
{
  "id": "b5694f2a-4048-63ae-bd42-593860adf6e9",
  "created_at": "2023-11-28T07:19:12.430Z",
  "updated_at": "2023-11-28T07:19:12.431Z",
  "customer": {
    "id": "c3264f2a-4048-63ae-bd42-593860adf6e9",
    "name": "Aluizio Developer",
    "email": "aluiziodeveloper@gmail.com",
    "created_at": "2023-11-28T07:19:12.430Z",
    "updated_at": "2023-11-28T07:19:12.431Z",
  },
  "order_products": [
    {
      "product_id": "e39595ae-63ae-4048-9a8a-593860adf6e9",
      "price": "400.00",
      "quantity": 1,
      "order_id": "b5694f2a-4048-63ae-bd42-593860adf6e9",
      "id": "e1694f2a-63ae-4048-9a8a-593860adf6e9",
      "created_at": "2023-11-28T07:19:12.430Z",
      "updated_at": "2023-11-28T07:19:12.431Z",
    },
    {
      "product_id": "b5694f2a-3f31-40c6-803d-593860adf6e9",
      "price": "200.00",
      "quantity": 3,
      "order_id": "b5694f2a-4048-63ae-bd42-593860adf6e9",
      "id": "c4694f2a-63ae-4048-9a8a-593860adf6e9",
      "created_at": "2023-11-28T07:19:12.430Z",
      "updated_at": "2023-11-28T07:19:12.431Z",
    }
  ]
}
```

O TypeORM define um maneira prática de buscar os dados relacionados com o recurso que estamos buscando no banco de dados, através do uso da opção **relations** nos métodos de buscas. Você precisará informar o nome da tabela relacionada para trazer os dados. Exemplo:

```js
userRepository.find({
  relations: {
    profile: true,
    photos: true,
    videos: {
      videoAttributes: true,
    },
  },
})
```

> Github do TypeORM: [opções para buscar dados em banco de dados.](https://github.com/typeorm/typeorm/blob/master/docs/find-options.md).
