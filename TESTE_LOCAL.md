# Como Testar Localmente

## Configuração Rápida

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

### 3. Acessar o Projeto
Abra seu navegador e acesse: `http://localhost:3000`

## Configuração do Banco de Dados

### Para Desenvolvimento Local (SQLite)
O projeto está configurado para usar SQLite automaticamente em desenvolvimento. Não precisa de configuração adicional.

### Para Produção (Postgres)
Se quiser testar com Postgres localmente:

1. Crie um arquivo `.env.local`:
```bash
POSTGRES_URL=sua_url_do_postgres
JWT_SECRET=sua_chave_secreta
```

2. O projeto usará Postgres automaticamente se `POSTGRES_URL` estiver definida.

## Inicializar o Banco

### Opção 1: Via Navegador
1. Acesse: `http://localhost:3000/api/init`
2. Você verá uma mensagem de sucesso

### Opção 2: Via Terminal
```bash
curl -X POST http://localhost:3000/api/init
```

## Testar Funcionalidades

### 1. Visualização Pública
- Acesse `http://localhost:3000`
- Você verá a página principal sem dashboards
- Clique no ícone de engrenagem no canto superior direito

### 2. Login Administrativo
- Use as credenciais padrão:
  - **Usuário**: admin
  - **Senha**: admin123

### 3. Adicionar Dashboards
- Após fazer login, você verá o painel administrativo
- Vá para a aba "Dashboards"
- Adicione um dashboard de teste:
  - **Título**: "Dashboard de Teste"
  - **URL**: `https://app.powerbi.com/view?r=eyJrIjoi...` (exemplo)

### 4. Personalizar Aparência
- Vá para a aba "Aparência"
- Altere o nome do portal
- Escolha uma cor personalizada
- Faça upload de uma logo

## Exemplos de URLs de Dashboard

### Power BI
```
https://app.powerbi.com/view?r=eyJrIjoi...
```

### Google Data Studio
```
https://datastudio.google.com/embed/reporting/...
```

### Tableau
```
https://public.tableau.com/views/...
```

### Grafana
```
http://localhost:3000/d-solo/...
```

## Troubleshooting

### Erro de Banco de Dados
- Verifique se o arquivo `dashboards.db` foi criado
- Tente acessar `/api/init` novamente

### Erro de Compilação
- Execute `npm run build` para verificar erros
- Verifique se todas as dependências estão instaladas

### Problemas de CORS
- Para dashboards externos, pode ser necessário configurar CORS
- Teste com dashboards da mesma origem primeiro

## Estrutura de Arquivos Locais

```
dashboards-app/
├── dashboards.db          # Banco SQLite (criado automaticamente)
├── .env.local            # Variáveis de ambiente (opcional)
└── ...
```

## Próximos Passos

Após testar localmente:

1. **Commit das mudanças**:
   ```bash
   git add .
   git commit -m "Adiciona suporte a SQLite para desenvolvimento local"
   ```

2. **Deploy na Vercel**:
   - Siga as instruções em `DEPLOY.md`
   - Configure as variáveis de ambiente
   - Acesse `/api/init` para inicializar o banco

## Dicas de Desenvolvimento

- Use `console.log()` para debug
- Verifique os logs no terminal onde o servidor está rodando
- Use as ferramentas de desenvolvedor do navegador para inspecionar requisições
- Teste diferentes tipos de dashboards para garantir compatibilidade 