# Sistema de Mensalidades

API backend em Node.js para gerenciamento de clientes, planos, assinaturas, pagamentos e administradores. O projeto usa Express, TypeScript, Prisma, PostgreSQL, Zod, Supabase Storage para imagens e jobs com `node-cron`.

## Stack

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod
- Multer
- Supabase Storage
- JWT
- bcrypt
- nodemailer
- node-cron
- date-fns

## Funcionalidades

- Cadastro, login e avatar de administradores
- Cadastro, listagem, busca, atualizacao e exclusao de clientes
- Cadastro, listagem, atualizacao e alteracao de status de planos
- Upload de banner para planos
- Criacao automatica de assinatura e pagamento pendente ao cadastrar cliente
- Criacao manual de novas assinaturas para um cliente existente
- Listagem, consulta e cancelamento de assinaturas
- Confirmacao de pagamentos pendentes
- Verificacao automatica de assinaturas vencidas
- Cancelamento automatico de assinaturas iniciais com pagamento pendente apos 1 dia

## Estrutura

```text
src/
  config/        # Prisma, Supabase, Multer e email
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
- Projeto/bucket no Supabase para upload de imagens
- Conta Gmail ou credenciais SMTP compativeis com a configuracao atual

## Instalacao

```bash
npm install
```

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/sistema_mensalidades"

JWT_SECRET="sua-chave-jwt"

SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
SUPABASE_BUCKET="bucket-para-avatar-admin"
SUPABASE_BUCKET_PLANO="bucket-para-banner-plano"

EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-ou-app-password"
```

Observacoes:

- O Prisma e configurado em `src/config/prisma.ts` com `@prisma/adapter-pg`.
- Uploads usam `multer` em memoria, com limite de 5 MB e apenas arquivos `image/*`.
- O envio de email usa Gmail via `nodemailer` em `src/config/mail.ts`.

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

## Executando

```bash
npm run dev
```

Servidor padrao:

```text
http://localhost:3000
```

A porta esta fixa em `src/server.ts`.

## Scripts

```bash
npm run dev
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
```

## Modelos principais

### Admin

- `id`
- `avatar`
- `nome`
- `email` unico
- `senha`
- `criado_em`

### Cliente

- `id`
- `nome`
- `email` unico
- `cpf` unico
- `telefone` unico
- `criado_em`

### Plano

- `id`
- `banner`
- `nome` unico
- `descricao`
- `preco`
- `status`: `ACTIVE`, `INACTIVE`, `ARCHIVED`
- `criado_em`
- `atualizado_em`

### Assinatura

- `id`
- `client_id`
- `plano_id`
- `status`: `ACTIVE`, `PENDING`, `CANCELLED`, `OVERDUE`
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
- `pago_em`
- `referencia_mes`
- `referencia_ano`
- `obs`
- `criado_em`

Restricao importante:

- `Pagamento` possui chave unica composta por `assinatura_id + referencia_mes + referencia_ano`.

## Endpoints

### Admins

#### `POST /admins`

Cadastra um administrador, envia o avatar para o Supabase e retorna um token JWT.

Formato: `multipart/form-data`

Campos:

- `avatar`: arquivo de imagem obrigatorio
- `nome`: minimo de 3 caracteres
- `email`: email valido
- `senha`: minimo de 6 caracteres

Exemplo de resposta:

```json
{
  "message": "Admin cadastrado!",
  "data": {
    "token": "jwt"
  }
}
```

#### `POST /admins/login`

Autentica um administrador.

Body:

```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```

### Clientes

#### `POST /clientes`

Cadastra um cliente, cria uma assinatura `PENDING` e gera o primeiro pagamento `PENDING`.

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

Regras:

- O plano precisa existir e estar com status `ACTIVE`.
- `email`, `cpf` e `telefone` nao podem estar cadastrados.
- O primeiro vencimento e definido para 30 dias apos o cadastro.

#### `GET /clientes`

Lista clientes.

#### `GET /clientes/:id`

Busca um cliente por ID.

#### `POST /clientes/:id/assinaturas`

Cria uma nova assinatura para um cliente existente e gera o primeiro pagamento pendente.

Body:

```json
{
  "id_plano": 1
}
```

Regras:

- `:id` deve ser um numero inteiro positivo.
- `id_plano` deve ser um numero inteiro positivo.
- O plano precisa existir e estar `ACTIVE`.

#### `PUT /clientes/:id`

Atualiza dados do cliente.

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

### Planos

#### `POST /planos`

Cria um plano e envia o banner para o Supabase.

Formato: `multipart/form-data`

Campos:

- `banner`: arquivo de imagem obrigatorio
- `nome`: minimo de 3 e maximo de 100 caracteres
- `descricao`: minimo de 3 e maximo de 500 caracteres
- `preco`: string numerica, como `"99.90"`
- `status`: opcional, `ACTIVE`, `INACTIVE` ou `ARCHIVED`

Observacoes:

- `nome` e salvo em minusculas.
- Quando `status` nao e enviado, o padrao e `ACTIVE`.

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

#### `PATCH /planos/:id/status`

Atualiza o status do plano.

Body:

```json
{
  "status": "INACTIVE"
}
```

### Assinaturas

#### `GET /assinaturas`

Lista todas as assinaturas.

#### `GET /assinaturas/:id`

Busca uma assinatura por ID.

#### `POST /assinaturas/:id`

Cancela uma assinatura, alterando o status para `CANCELLED`.

#### `PATCH /assinaturas/:id/confirmar-pagamento`

Confirma um pagamento pendente da assinatura.

Body:

```json
{
  "metodo": "PIX",
  "obs": "Pagamento confirmado no caixa"
}
```

Regras:

- A assinatura precisa existir.
- Assinaturas `CANCELLED` nao recebem pagamento.
- Precisa existir um pagamento `PENDING` para a assinatura.
- O pagamento vira `PAID`, recebe `pago_em`, e a assinatura vira `ACTIVE`.
- `proximo_vencimento` e atualizado para 1 mes apos a confirmacao.

## Jobs agendados

Os jobs sao iniciados em `src/server.ts` junto com a API.

### Verificacao de assinaturas vencidas

Arquivo: `src/cron/jobs.ts`

Expressao:

```ts
"07 15 * * *"
```

Executa todos os dias as 15:07 no timezone `America/Sao_Paulo`.

Comportamento:

- Busca assinaturas `ACTIVE` com `proximo_vencimento` anterior a data atual.
- Envia email a cada multiplo de 3 dias de atraso.
- Atualiza as assinaturas encontradas para `OVERDUE`.

### Cancelamento de pagamento inicial pendente

Expressao:

```ts
"0 0 * * *"
```

Executa todos os dias a meia-noite no timezone `America/Sao_Paulo`.

Comportamento:

- Busca assinaturas `PENDING` criadas ha pelo menos 1 dia com pagamento `PENDING`.
- Atualiza pagamentos pendentes para `FAILED`.
- Atualiza a assinatura para `CANCELLED`.

## Validacao e erros

- Validacoes de body e params usam Zod em `src/schemas`.
- Erros de validacao retornam status `400` com `details`.
- O middleware global em `src/middleware/error.ts` retorna status `400` com:

```json
{
  "error": "Mensagem do erro"
}
```

## Observacoes do estado atual

- O projeto ainda nao possui testes automatizados.
- Nao existe `.env.example`.
- A API nao possui rota de health check.
- Algumas mensagens no codigo ainda apresentam problemas de codificacao.
- A rota `POST /clientes/:id/assinaturas` retorna apenas mensagem de sucesso no controller atual.
