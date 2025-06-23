# Pet Book

This is a [Next.js](https://nextjs.org) project for managing pet information and profiles. Pet Book allows users to create profiles for their pets, track health records, schedule appointments, and connect with other pet owners.

## Overview

Pet Book is built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Shadcn UI components. It uses Prisma with a PostgreSQL database for data storage.

## Configuração do Ambiente

### Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pet-book"

# S3/MinIO Configuration
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_BUCKET_NAME="pet-book"
S3_REGION="us-east-1"

# Auth (Better Auth)
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
```

### Configuração do MinIO

1. **Instalar MinIO:**
   ```bash
   # Windows (usando Chocolatey)
   choco install minio

   # Ou baixar diretamente de https://min.io/download
   ```

2. **Iniciar MinIO:**
   ```bash
   minio server C:\minio-data --console-address ":9001"
   ```

3. **Acessar Console:**
   - URL: http://localhost:9001
   - Login: minioadmin / minioadmin

4. **Criar Bucket:**
   - Acesse o console do MinIO
   - Crie um bucket chamado `pet-book`
   - Configure as permissões de acesso público se necessário

### Instalação e Execução

```bash
# Instalar dependências
yarn install

# Configurar banco de dados
npx prisma migrate dev

# Iniciar desenvolvimento
yarn dev
```

## Funcionalidades

- ✅ Autenticação com Better Auth
- ✅ Cadastro e gerenciamento de pets
- ✅ Upload múltiplo de fotos (máx. 5 por pet)
- ✅ Integração com S3/MinIO para armazenamento
- ✅ Interface responsiva e moderna

## Getting Started

1. **Start the database**
   ```bash
   docker compose up -d
   ```

2. **Setup the project**
   ```bash
   yarn setup
   ```

3. **Run development server**
   ```
