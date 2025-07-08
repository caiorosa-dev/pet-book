# Pet Book 🐾

Uma plataforma social moderna dedicada a ajudar tutores a encontrar seus pets perdidos e conectar a comunidade. Construído com Next.js 15, React 19 e TypeScript.

![Pet Book](https://img.shields.io/badge/Next.js-15.3.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.10.1-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Funcionalidades

### Funcionalidades Principais
- **🔍 Postagens de Pets Perdidos**: Crie postagens detalhadas sobre pets perdidos com fotos e localização
- **🏠 Postagens de Pets Encontrados**: Informe pets encontrados para ajudar a reuni-los com seus tutores
- **👥 Feed da Comunidade**: Navegue e interaja com postagens da comunidade
- **🐕 Perfis de Pets**: Crie e gerencie perfis detalhados dos seus pets
- **📱 Design Responsivo**: Interface otimizada para dispositivos móveis e desktop
- **🔐 Autenticação Segura**: Login por e-mail/senha com Better Auth
- **📸 Gerenciamento de Fotos**: Faça upload e gerencie várias fotos para pets e postagens
- **💬 Recursos Sociais**: Curtidas, comentários e compartilhamento de postagens
- **🔍 Busca Avançada**: Pesquise pets, pessoas e organizações

### Recursos Técnicos
- **⚡ Stack Web**: Next.js 15 com App Router, React 19, TypeScript
- **🎨 UI Bonita**: Componentes Shadcn/ui com Tailwind CSS
- **🗄️ Banco de Dados**: PostgreSQL com Prisma ORM
- **☁️ Armazenamento de Arquivos**: Compatível com S3 (MinIO) para fotos
- **🔒 Segurança**: Better Auth com gerenciamento de sessões

## 🏗️ Arquitetura

### Stack Tecnológica
- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilização**: Tailwind CSS 4, Shadcn/ui
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: Better Auth
- **Armazenamento**: AWS S3 / MinIO
- **Dev**: ESLint, Prettier, Turbopack

## 🚀 Primeiros Passos

### Pré-requisitos
- Node.js 18+
- Yarn ou npm
- Docker e Docker Compose
- Git

### Guia Rápido

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd pet-book
   ```

2. **Suba o ambiente de desenvolvimento**
   ```bash
   # Inicia PostgreSQL e MinIO
   docker compose up -d
   ```

3. **Instale as dependências e configure o projeto**
   ```bash
   yarn setup
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   yarn dev
   ```

5. **Acesse no navegador**
   [http://localhost:3000](http://localhost:3000)

### Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Banco de Dados
DATABASE_URL="postgresql://charles:docker@localhost:5432/pet-book"

# S3/MinIO
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_BUCKET_NAME="pet-book"
S3_REGION="us-east-1"

# Autenticação
BETTER_AUTH_SECRET="sua-chave-secreta"
BETTER_AUTH_URL="http://localhost:3000"
```

### MinIO (Armazenamento de Arquivos)

1. **Acesse o console do MinIO**
   - URL: http://localhost:9001
   - Usuário: `minioadmin`
   - Senha: `minioadmin`

2. **Crie o bucket**
   - No console, crie um bucket chamado `pet-book`
   - Configure a política de acesso público se necessário

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
yarn dev          # Inicia o servidor de desenvolvimento (Turbopack)
yarn build        # Build de produção
yarn start        # Inicia o servidor em produção
yarn lint         # Lint do código
yarn setup        # Instala dependências e executa migrações
```

### Banco de Dados

```bash
# Executar migrações
yarn prisma migrate dev

# Gerar cliente Prisma
yarn prisma generate

# Abrir Prisma Studio
yarn prisma studio
```

### Qualidade de Código
- **ESLint** com configuração customizada
- **Prettier** para formatação
- **TypeScript** para segurança de tipos

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

Feito com ❤️ para quem ama pets!
