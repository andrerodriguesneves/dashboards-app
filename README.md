# Portal Corporativo de Dashboards Interativos

Um portal web moderno para exibição centralizada de dashboards e relatórios gerenciais através de links incorporados.

## Funcionalidades

### Para Usuários Comuns
- Visualização de todos os dashboards em layout responsivo
- Acesso direto sem necessidade de login
- Interface limpa e intuitiva

### Para Administradores
- Sistema de autenticação seguro
- Gerenciamento completo de dashboards (adicionar/remover)
- Personalização da aparência do portal
- Upload de logo da empresa
- Configuração de cores personalizadas

## Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: Vercel Postgres
- **Autenticação**: JWT
- **Deploy**: Vercel

## Configuração Inicial

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` com:
```
POSTGRES_URL=sua_url_do_postgres
JWT_SECRET=sua_chave_secreta_jwt
```

### 3. Inicializar Banco de Dados
Acesse `/api/init` para criar as tabelas e usuário admin padrão.

### 4. Credenciais Padrão
- **Usuário**: admin
- **Senha**: admin123

## Deploy na Vercel

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente no painel da Vercel:
   - `POSTGRES_URL`: URL do seu banco Vercel Postgres
   - `JWT_SECRET`: Chave secreta para JWT (mude em produção)
3. Deploy automático será realizado

## Estrutura do Projeto

```
dashboards-app/
├── app/
│   ├── components/          # Componentes React
│   ├── api/                # APIs Next.js
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
├── lib/
│   ├── database.ts         # Configuração do banco
│   ├── auth.ts             # Autenticação JWT
│   └── env.ts              # Variáveis de ambiente
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Segurança

- Validação e sanitização de todas as entradas
- Proteção contra XSS e CSRF
- Autenticação JWT segura
- Sessões gerenciadas adequadamente

## Como Usar

1. **Acesso Público**: Qualquer usuário pode acessar e visualizar os dashboards
2. **Acesso Administrativo**: 
   - Clique no ícone de engrenagem no canto superior direito
   - Use as credenciais padrão (admin/admin123)
   - Gerencie dashboards e personalize o portal

## Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento. 
