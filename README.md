# Video Unpack Frontend

Uma aplicação React + TypeScript para extração de frames de vídeos.

## Funcionalidades

- **Autenticação**: Sistema completo de login e cadastro
- **Upload de Vídeos**: Interface drag-and-drop para envio de arquivos
- **Monitoramento de Jobs**: Acompanhe o status do processamento
- **Download de Resultados**: Baixe os frames extraídos quando estiverem prontos
- **Interface Responsiva**: Design moderno e responsivo com Tailwind CSS

### Estrutura de Pastas

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── Layout.tsx
│   ├── ProtectedRoute.tsx
│   ├── SignInForm.tsx
│   ├── SignUpForm.tsx
│   ├── VideoUpload.tsx
│   └── VideoList.tsx
├── contexts/           # Contextos React
│   ├── AuthContext.ts
│   └── AuthProvider.tsx
├── hooks/              # Custom hooks
│   └── useAuth.ts
├── pages/              # Páginas da aplicação
│   ├── DashboardPage.tsx
│   └── UploadPage.tsx
├── services/           # Camada de serviços
│   ├── HttpClient.ts
│   ├── AuthService.ts
│   └── VideoService.ts
├── types/              # Definições de tipos TypeScript
│   └── index.ts
└── App.tsx             # Componente raiz
```

## Como Executar Localmente

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm
- Backend da aplicação rodando

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd hackathon-soat10-phase5-frontend
```

2. Instale as dependências:
```bash
npm install
```

Edite o arquivo `.env` com a URL do seu backend:
```
VITE_API_BASE_URL=/
```

4. Execute a aplicação:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter

## Deploy

### Build de Produção

1. Gere a build:
```bash
npm run build
```

2. Os arquivos serão gerados na pasta `dist/`

### Deploy Vercel
1. Instale a CLI do Vercel: `npm i -g vercel`
2. Execute: `vercel`
3. Siga as instruções

## Configuração da API

A aplicação se comunica com as seguintes rotas do backend:

### Autenticação
- `POST /api/v1/auth/signup` - Cadastro de usuário
- `POST /api/v1/auth/signin` - Login

### Vídeos
- `GET /api/v1/videos` - Lista jobs de processamento
- `POST /api/v1/videos` - Upload de vídeo
- `GET /api/v1/zip/download?job_ref=<id>` - Download do resultado

## Tecnologias Utilizadas

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **React Router DOM** - Roteamento para SPAs
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de esquemas
- **React Hot Toast** - Notificações toast
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones
