# Sistema de Mensalidades

API backend em Node.js para gerenciamento de clientes de um sistema de mensalidades. O projeto foi construído com Express, TypeScript, Prisma e PostgreSQL e, no estado atual, já expõe operações CRUD para clientes.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod

## Estrutura do projeto

```text
src/
  config/        # conexao com o banco
  controller/    # controllers da API
  middleware/    # middlewares de validacao e tratamento de erro
  routes/        # definicao das rotas
  schemas/       # schemas Zod
  services/      # regras de negocio
prisma/
  schema.prisma  # models do banco de dados
```

## Requisitos

- Node.js 18 ou superior
- PostgreSQL em execucao
- Variavel `DATABASE_URL` configurada

## Instalacao

```bash
npm install
```

## Configuracao de ambiente

Crie um arquivo `.env` na raiz do projeto com a conexao do PostgreSQL.

Para a aplicacao, use `DATABASE_URL`.
Para `prisma migrate`, prefira `DIRECT_URL` quando estiver usando pooler (como Neon):

```env
DATABASE_URL="postgresql://usuario:senha@host-pooler:5432/sistema_mensalidades"
DIRECT_URL="postgresql://usuario:senha@host-direto:5432/sistema_mensalidades"
```

No Prisma 7, o `schema.prisma` pode ficar sem `url`, mas o bloco `datasource` continua obrigatorio:

```prisma
datasource db {
  provider = "postgresql"
}
```

## Banco de dados

O projeto utiliza Prisma com PostgreSQL. Para gerar o client e sincronizar o schema:

```bash
npm run prisma:generate
npm run prisma:push
```

Se preferir trabalhar com migrations em ambiente de desenvolvimento:

```bash
npm run prisma:migrate
```

## Executando o projeto

```bash
npm run dev
```

Servidor padrao:

```text
http://localhost:3000
```

## Modelos do banco

### Client

- `id`: inteiro autoincremental
- `nome`: nome do cliente
- `email`: unico
- `cpf`: unico
- `telefone`: telefone do cliente
- `criado_em`: data de criacao

### Plano

- `id`
- `nome`
- `preco`
- `criado_em`
- `atualizado_em`

### Assinaturas

- `id`
- `client_id`
- `plano_id`
- `status`
- `data_inicio`
- `data_ultimo_pagamento`
- `proximo_vencimento`
- `criado_em`
- `atualizado_em`

### Pagamento

- `id`
- `assinatura_id`
- `valor`
- `data_pagamento`
- `status`
- `metodo`
- `obs`
- `criado_em`

## Endpoints disponiveis

### `POST /cadastrar`

Cadastra um novo cliente.

#### Body

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cpf": "12345678901",
  "telefone": "11999998888"
}
```

#### Validacoes

- `nome`: minimo de 3 caracteres
- `email`: deve ser valido
- `cpf`: deve conter 11 digitos
- `telefone`: deve seguir um formato valido

#### Resposta de sucesso

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cpf": "12345678901",
  "telefone": "11999998888",
  "criado_em": "2026-04-07T00:00:00.000Z",
  "assinaturas": []
}
```

### `GET /clientes`

Lista todos os clientes cadastrados.

#### Resposta de sucesso

```json
[
  {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "cpf": "12345678901",
    "telefone": "11999998888",
    "criado_em": "2026-04-07T00:00:00.000Z"
  }
]
```

### `GET /cliente/:id`

Busca um cliente pelo ID.

#### Exemplo

```bash
GET /cliente/1
```

### `PUT /cliente/:id`

Atualiza os dados de um cliente.

#### Body

```json
{
  "nome": "Maria Souza",
  "email": "maria.souza@email.com",
  "cpf": "12345678901",
  "telefone": "11988887777"
}
```

#### Resposta de sucesso

```json
{
  "message": "Cliente atualizado com sucesso",
  "data": {
    "id": 1,
    "nome": "Maria Souza",
    "email": "maria.souza@email.com",
    "cpf": "12345678901",
    "telefone": "11988887777",
    "criado_em": "2026-04-07T00:00:00.000Z"
  }
}
```

### `DELETE /cliente/:id`

Remove um cliente pelo ID.

#### Resposta de sucesso

```json
{
  "message": "Cliente excluído com sucesso!"
}
```

## Padrao de erros

### Erros de validacao

Quando o body, params ou query nao respeitam o schema Zod, a API responde com `400 Bad Request`:

```json
{
  "error": "Erro validação",
  "details": [
    {
      "campo": "body.email",
      "mensagem": "Insira um email válido!"
    }
  ]
}
```

### Erros de regra de negocio

Exemplos:

- email ja cadastrado
- telefone ja cadastrado
- cliente nao encontrado
- id invalido

## Scripts disponiveis

```bash
npm run dev
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
```

## Observacoes importantes

- A API atualmente possui rotas implementadas apenas para `Client`.
- O schema Prisma ja possui as entidades `Plano`, `Assinaturas` e `Pagamento`, mas ainda sem rotas expostas.
- O projeto usa a porta `3000` fixamente em `src/server.ts`.
- O client do Prisma esta sendo gerado em `src/generated/prisma`.

## Melhorias sugeridas

- Adicionar um endpoint de health check
- Criar arquivo `.env.example`
- Padronizar mensagens e codigos de erro
- Implementar testes automatizados
- Documentar a API com Swagger/OpenAPI no futuro
