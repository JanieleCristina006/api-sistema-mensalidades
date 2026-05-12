# Sistema de Mensalidades

API backend em Node.js para gerenciar clientes, planos, assinaturas, pagamentos e administradores. O projeto usa Express, TypeScript, Prisma, PostgreSQL, Zod, Supabase Storage para imagens, JWT para autenticacao e `node-cron` para rotinas automaticas.

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

- Cadastro de administradores com upload de avatar
- Login de administradores com JWT
- Recuperacao e redefinicao de senha de administradores
- Cadastro, listagem, busca, atualizacao e exclusao de clientes
- Cadastro, listagem, atualizacao e alteracao de status de planos
- Upload de banner para planos
- Criacao automatica de assinatura e pagamento pendente ao cadastrar cliente
- Criacao manual de assinatura para cliente existente
- Listagem, consulta e cancelamento de assinaturas
- Confirmacao de pagamentos pendentes
- Verificacao automatica de assinaturas vencidas
- Cancelamento automatico de assinaturas iniciais sem pagamento apos 1 dia
- Erros padronizados com mensagem, codigo e detalhes quando houver validacao

## Estrutura

```text
src/
  config/        # Prisma, Supabase, Multer e email
  controller/    # controllers HTTP
  cron/          # jobs agendados
  errors/        # erros customizados da API
  middleware/    # validacao e tratamento de erro
  routes/        # rotas da API
  schemas/       # validacoes com Zod
  services/      # regras de negocio
  utils/         # utilitarios compartilhados
prisma/
  migrations/    # historico de migrations
  schema.prisma  # schema do banco
```

Padrao de nomes:

- Arquivos da aplicacao: `camelCase`, exemplo `createClientService.ts`.
- Classes: `PascalCase`, exemplo `CreateClientService`.
- Codigo gerado em `src/generated/prisma` nao deve ser renomeado manualmente.

## Requisitos

- Node.js 18 ou superior
- PostgreSQL disponivel
- Projeto no Supabase com buckets para avatar de admin e banner de plano
- Conta Gmail ou credenciais compativeis com a configuracao atual do `nodemailer`

## Instalacao

```bash
npm install
```

Copie o arquivo de exemplo e preencha os valores reais:

```bash
cp .env.example .env
```

Variaveis usadas pela aplicacao:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/sistema_mensalidades"

JWT_SECRET="sua-chave-jwt"
JWT_RESET_SECRET="sua-chave-jwt-para-recuperacao-de-senha"

SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
SUPABASE_BUCKET="bucket-para-avatar-admin"
SUPABASE_BUCKET_PLANO="bucket-para-banner-plano"

EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-ou-app-password"
EMAIL_FROM="Sistema de Mensalidades <noreply@seudominio.com>"
```

Observacoes:

- `DATABASE_URL` e obrigatoria para iniciar o Prisma.
- `JWT_SECRET` assina os tokens de sessao.
- `JWT_RESET_SECRET` assina apenas os tokens de recuperacao de senha.
- `EMAIL_FROM` e opcional; quando nao informado, o envio usa `EMAIL_USER`.
- Uploads usam `multer` em memoria, limite de 5 MB e apenas arquivos `image/*`.

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

## Autenticacao

O middleware `src/middleware/auth.ts` libera sem token apenas:

- `POST /admins`
- `POST /admins/login`
- `POST /admins/recuperar-senha`
- `POST /admins/redefinir-senha`

Todas as outras rotas exigem o header:

```http
Authorization: Bearer seu-token-jwt
```

Se o token nao for enviado, estiver em formato invalido, expirado ou assinado com outro segredo, a API retorna `401`.

## Scripts

```bash
npm run dev
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
```

Para checar TypeScript manualmente:

```bash
.\node_modules\.bin\tsc.cmd --noEmit
```

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

#### `POST /admins/login`

Autentica um administrador.

```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```

#### `POST /admins/recuperar-senha`

Gera um token temporario de 15 minutos e envia um link de recuperacao para o email informado.

```json
{
  "email": "admin@email.com"
}
```

#### `POST /admins/redefinir-senha`

Redefine a senha do administrador usando o token recebido.

```json
{
  "token": "token-de-recuperacao",
  "novaSenha": "nova-senha"
}
```

### Clientes

#### `POST /clientes`

Cadastra um cliente, cria uma assinatura `PENDING` e gera o primeiro pagamento `PENDING`.

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

- O plano precisa existir e estar `ACTIVE`.
- `email`, `cpf` e `telefone` nao podem estar cadastrados.
- O primeiro vencimento e definido para 30 dias apos o cadastro.

#### `GET /clientes`

Lista clientes.

#### `GET /clientes/:id`

Busca um cliente por ID.

#### `POST /clientes/:id/assinaturas`

Cria uma nova assinatura para um cliente existente e gera o primeiro pagamento pendente.

```json
{
  "id_plano": 1
}
```

#### `PUT /clientes/:id`

Atualiza dados do cliente.

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

```json
{
  "nome": "Premium anual",
  "preco": "109.90"
}
```

#### `PATCH /planos/:id/status`

Atualiza o status do plano.

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
- `proximo_vencimento` avanca conforme o ciclo da assinatura.
- Um novo pagamento `PENDING` e gerado automaticamente para a proxima referencia mensal.

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

Restricao:

- `Pagamento` possui chave unica composta por `assinatura_id + referencia_mes + referencia_ano`.

## Jobs agendados

Os jobs sao iniciados em `src/server.ts` junto com a API.

### Verificacao de assinaturas vencidas

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

Validacoes de body, params e query usam Zod em `src/schemas`.

Erro de validacao:

```json
{
  "error": "Dados invalidos no corpo da requisicao.",
  "code": "VALIDACAO_BODY",
  "details": [
    {
      "campo": "email",
      "mensagem": "Insira um email valido."
    }
  ]
}
```

Erro de negocio:

```json
{
  "error": "Cliente nao encontrado.",
  "code": "CLIENTE_NAO_ENCONTRADO"
}
```

O middleware global em `src/middleware/error.ts` tambem trata:

- Erros de upload do Multer
- Erros conhecidos do Prisma, como registro duplicado e registro nao encontrado
- Erros inesperados com status `500` e codigo `ERRO_NAO_MAPEADO`

