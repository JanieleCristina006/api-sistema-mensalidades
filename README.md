# Sistema de Mensalidades

API backend em Node.js para gerenciamento de clientes, planos, assinaturas e pagamentos recorrentes. O projeto usa Express, TypeScript, Prisma e PostgreSQL, com validacao de entrada via Zod e um job em `node-cron` para marcar assinaturas vencidas.

## Stack

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod
- node-cron
- nodemailer
- date-fns

## Funcionalidades atuais

- Cadastro, listagem, busca, atualizacao e exclusao de clientes
- Cadastro, listagem, atualizacao e alteracao de status de planos
- Criacao automatica de assinatura ao cadastrar um cliente
- Listagem e consulta de assinaturas
- Cancelamento manual de assinatura
- Confirmacao de pagamento de assinatura
- Verificacao manual e automatica de assinaturas vencidas

## Estrutura do projeto

```text
src/
  config/        # configuracao do Prisma
  controller/    # controllers HTTP
  cron/          # jobs agendados
  middleware/    # validacao e tratamento de erro
  routes/        # rotas da API
  schemas/       # validacoes com Zod
  services/      # regras de negocio
prisma/
  migrations/    # historico de migrations
  schema.prisma  # schema do banco
```

## Requisitos

- Node.js 18 ou superior
- PostgreSQL disponivel
- Variavel de ambiente `DATABASE_URL` configurada

## Instalacao

```bash
npm install
```

## Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/sistema_mensalidades"
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-ou-app-password"
```

O projeto instancia o Prisma em [src/config/prisma.ts](c:\Users\janie\Desktop\projetos_backend\sistema_mensalidades\src\config\prisma.ts) usando `@prisma/adapter-pg`, entao a aplicacao falha ao iniciar se `DATABASE_URL` nao estiver definida.

Para envio de e-mails, o transporter em [src/config/mail.ts](c:\Users\janie\Desktop\projetos_backend\sistema_mensalidades\src\config\mail.ts) usa Gmail via `nodemailer`, com `EMAIL_USER` e `EMAIL_PASS`.

## Banco de dados

Gerar o client do Prisma:

```bash
npm run prisma:generate
```

Sincronizar o schema sem criar migration:

```bash
npm run prisma:push
```

Criar e aplicar migration em desenvolvimento:

```bash
npm run prisma:migrate
```

## Executando a API

```bash
npm run dev
```

Servidor padrao:

```text
http://localhost:3000
```

A porta esta fixa em [src/server.ts](c:\Users\janie\Desktop\projetos_backend\sistema_mensalidades\src\server.ts).

## Regras de negocio importantes

- Ao criar um cliente, a API tambem cria uma assinatura automaticamente com o `plano_id` informado.
- O plano escolhido no cadastro do cliente precisa existir e estar com status `ACTIVE`.
- O primeiro vencimento da assinatura e definido para 30 dias apos o cadastro.
- Ao confirmar um pagamento, a API registra um pagamento com status `PAID` e avanca o `proximo_vencimento` em 1 mes.
- A API impede pagamento duplicado para a mesma assinatura no mesmo mes/ano de referencia.
- Assinaturas canceladas nao podem receber confirmacao de pagamento.
- O job de vencimento agenda a verificacao diaria no horario configurado em `src/cron/jobs.ts`.
- Assinaturas atrasadas sao alteradas de `ACTIVE` para `OVERDUE`.
- Quando o atraso e multiplo de 3 dias, a aplicacao tenta enviar um e-mail real ao cliente.

## Modelos do banco

### Client

- `id`
- `nome`
- `email` unico
- `cpf` unico
- `telefone` unico
- `criado_em`

### Plano

- `id`
- `nome` unico
- `preco`
- `status`: `ACTIVE`, `INACTIVE`, `ARCHIVED`
- `criado_em`
- `atualizado_em`

### Assinatura

- `id`
- `client_id`
- `plano_id`
- `status`: `ACTIVE`, `CANCELLED`, `OVERDUE`
- `data_inicio`
- `data_ultimo_pagamento`
- `proximo_vencimento`
- `criado_em`
- `atualizado_em`

### Pagamento

- `id`
- `assinatura_id`
- `valor`
- `status`: `PAID`, `PENDING`, `FAILED`, `REFUNDED`
- `metodo`: `PIX`, `CREDIT_CARD`
- `referencia_mes`
- `referencia_ano`
- `obs`
- `criado_em`

Restricao importante:

- Existe uma chave unica composta em `Pagamento` para `assinatura_id + referencia_mes + referencia_ano`.

## Endpoints

### Clientes

#### `POST /clientes`

Cadastra um cliente e cria a primeira assinatura.

Body:

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cpf": "12345678901",
  "telefone": "11999998888",
  "plano_id": 1
}
```

Validacoes:

- `nome`: minimo de 3 caracteres
- `email`: formato valido
- `cpf`: exatamente 11 digitos
- `telefone`: formato numerico valido
- `plano_id`: numero maior que 0

Resposta esperada:

```json
{
  "message": "Cliente cadastrado!",
  "data": {
    "createdClient": {
      "id": 1,
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "cpf": "12345678901",
      "telefone": "11999998888"
    },
    "createdSubscription": {
      "id": 1,
      "client_id": 1,
      "plano_id": 1,
      "status": "ACTIVE"
    }
  }
}
```

#### `GET /clientes`

Lista clientes com suas assinaturas.

#### `GET /clientes/:id`

Busca um cliente por ID.

#### `PUT /clientes/:id`

Atualiza `nome`, `email`, `cpf` e `telefone`.

Body:

```json
{
  "nome": "Maria Souza",
  "email": "maria.souza@email.com",
  "cpf": "12345678901",
  "telefone": "11988887777"
}
```

#### `DELETE /clientes/:id`

Remove um cliente pelo ID.

Observacao:

- O servico atual usa `deleteMany`, entao a resposta de sucesso nao retorna o cliente excluido, apenas a mensagem do controller.

### Planos

#### `POST /planos`

Cria um plano.

Body:

```json
{
  "nome": "Premium",
  "preco": "99.90",
  "status": "ACTIVE"
}
```

Observacoes:

- `nome` e normalizado para minusculas antes de salvar.
- `status` e opcional. Quando omitido, o padrao e `ACTIVE`.

#### `GET /planos`

Lista todos os planos.

#### `PUT /planos/:id`

Atualiza `nome` e `preco` de um plano.

Body:

```json
{
  "nome": "Premium anual",
  "preco": "109.90"
}
```

Observacao:

- Essa rota nao possui validacao de body via Zod no estado atual do projeto.

#### `PATCH /planos/:id/status`

Atualiza apenas o status do plano.

Body:

```json
{
  "status": "INACTIVE"
}
```

Valores aceitos:

- `ACTIVE`
- `INACTIVE`
- `ARCHIVED`

### Assinaturas

#### `GET /assinaturas`

Lista todas as assinaturas.

#### `GET /assinaturas/:id`

Busca uma assinatura por ID.

#### `POST /assinaturas/:id`

Cancela uma assinatura, alterando o status para `CANCELLED`.

#### `POST /assinaturas/verificar-vencidas`

Executa manualmente a verificacao de assinaturas vencidas.

Observacoes:

- O servico procura assinaturas `ACTIVE` com `proximo_vencimento` menor que a data atual.
- Assinaturas encontradas sao atualizadas para `OVERDUE`.
- Se o atraso for multiplo de 3 dias, o servico tenta enviar um e-mail com o assunto `Sua assinatura venceu`.
- Hoje o controller retorna `message`, mas o campo `data` tende a vir `null`/`undefined`, porque o servico nao devolve explicitamente o resultado.

#### `PATCH /assinaturas/:id/confirmar-pagamento`

Registra o pagamento de uma assinatura.

Body:

```json
{
  "metodo": "PIX",
  "obs": "Pagamento confirmado no caixa"
}
```

Valores aceitos para `metodo`:

- `PIX`
- `CREDIT_CARD`

Observacao:

- Embora o controller leia `valor` do body, o servico usa o preco do plano vinculado a assinatura para criar o pagamento.

## Job agendado

O arquivo [src/cron/jobs.ts](c:\Users\janie\Desktop\projetos_backend\sistema_mensalidades\src\cron\jobs.ts) agenda a verificacao de vencimento com a expressao:

```ts
"27 11 * * *"
```

Na pratica, isso significa:

- execucao diaria as 11:27
- disparo automatico no boot da aplicacao
- timezone `America/Sao_Paulo`
- log no console com timestamp ISO no momento da execucao

## Padrao de erro atual

O middleware global em [src/middleware/error.ts](c:\Users\janie\Desktop\projetos_backend\sistema_mensalidades\src\middleware\error.ts) responde com status `400` para erros lancados pela aplicacao:

```json
{
  "error": "Mensagem do erro"
}
```

Nao ha, no estado atual, uma diferenciacao entre erros de validacao, regra de negocio e recursos nao encontrados.

## Scripts disponiveis

```bash
npm run dev
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
```

## Observacoes do estado atual

- O projeto ainda nao possui testes automatizados.
- Nao existe `.env.example`.
- A API nao possui rota de health check.
- O envio de email depende de credenciais Gmail configuradas no `.env`.
- Alguns textos de erro retornados pelo codigo apresentam problemas de codificacao.
- O README foi atualizado com base no comportamento implementado hoje, nao em um contrato futuro.
