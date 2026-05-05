# Desafio Financy - Faculdade de Tecnologia Rocketseat

## Objetivo

Aplicação web para controle financeiro pessoal, com cadastro de usuários, categorias e transações.

## Requisitos

- Node.js 20 ou superior
- npm

## Como executar

### 1. Backend

No terminal, execute:

```bash
cd backend
npm install
```

Crie o arquivo de ambiente a partir do exemplo (`backend/.env`) e preencha os campos obrigatórios:

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=sua_chave_secreta
```

Em seguida, aplique as migrations, popule o banco e inicie o servidor:

```bash
npx prisma migrate deploy
npm run seed
npm run dev
```

O backend ficará disponível em `http://localhost:4000`.

### 2. Frontend

Em outro terminal, execute:

```bash
cd frontend
npm install
npm run dev
```

O frontend utiliza a variável `VITE_BACKEND_URL` (arquivo `frontend/.env`).

## Acesso padrão

- Usuário: chauchuty@financy.com
- Senha: @!010203

## Observação

Para uso local, mantenha o backend em execução antes de iniciar o frontend.