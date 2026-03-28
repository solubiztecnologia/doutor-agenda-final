# Resumo de Deploy - Doutor Agenda na Vercel

**Data**: 27 de Março de 2026
**Versão**: 0.1.0
**Plataforma**: Vercel
**Banco de Dados**: Supabase (PostgreSQL gerenciado)

---

## ✅ O que já foi Preparado

### 1. Código e Repositório
- ✅ Projeto clonado do repositório original
- ✅ GitHub fork criado em `https://github.com/solubiztecnologia/doutor-agenda-final.git`
- ✅ Código limpo e atualizado com todas as dependências
- ✅ `.env.example` adicionado ao repositório
- ✅ Todos os commits sincronizados com GitHub

### 2. Documentação de Deploy
- ✅ **DEPLOYMENT_VERCEL.md** - Guia completo passo a passo para Vercel
- ✅ **QUICK_START_VERCEL.md** - Guia rápido (30 minutos)
- ✅ **CREDENTIALS_CHECKLIST.md** - Checklist de credenciais necessárias
- ✅ **DEPLOYMENT_VERCEL.md** - Troubleshooting incluído

### 3. Estrutura do Projeto
- ✅ Next.js 15.3.2 com React 19
- ✅ Drizzle ORM para gerenciamento de banco
- ✅ Better Auth para autenticação (Google OAuth)
- ✅ Stripe integrado para pagamentos
- ✅ Componentes shadcn/ui pré-configurados

### 4. Stack Tecnológico
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (Server Actions)
- **Banco de Dados**: PostgreSQL (via Supabase)
- **Autenticação**: Better Auth + Google OAuth
- **Pagamentos**: Stripe
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network

---

## ⏳ O que falta fazer (Ordem de Prioridade)

### **FASE 1: Configurar Supabase** (5-10 minutos)

#### 1.1 Criar Conta e Projeto
1. Vá para https://supabase.com
2. Crie conta ou faça login
3. Clique "New Project"
4. Configure:
   - **Name**: `doutor-agenda`
   - **Database Password**: Crie senha forte
   - **Region**: `South America / sa-east-1` (São Paulo, Brasil)
5. Aguarde o projeto ser criado (~2-3 minutos)

#### 1.2 Obter DATABASE_URL
1. Vá para "Settings" → "Database"
2. Em "Connection Strings", clique "URI" (não "Connection pooler")
3. Copie a string que começa com `postgresql://`
4. Certifique que termina com `?sslmode=require`

**Saída esperada**:
```
DATABASE_URL=postgresql://postgres:senha@db.projeto.supabase.co:5432/postgres?sslmode=require
```

---

### **FASE 2: Obter Credenciais Externas** (15-20 minutos)

#### 2.1 Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie novo projeto: "Doutor Agenda"
3. Procure por "Google+ API" e clique para ativar
4. Vá para "Credenciais" → "Criar Credencial" → "OAuth 2.0 Client ID"
5. Selecione "Aplicação Web"
6. Adicione URIs autorizados:
   - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
   - **Deixe uma linha vazia** para adicionar depois com a URL final do Vercel
7. Clique "Criar"
8. Copie `Client ID` e `Client Secret`

**Saída esperada**:
```
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

#### 2.2 Stripe - Chaves de API
1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá para "Developers" → "API keys"
3. Você verá **Publishable key** e **Secret key**
4. Copie ambas:

**Saída esperada**:
```
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

#### 2.3 Stripe - Webhook
1. No Stripe Dashboard, vá para "Webhooks"
2. Clique "Add endpoint"
3. Por enquanto, coloque URL temporária: `https://placeholder.example.com/api/stripe/webhook`
4. Selecione eventos: `invoice.paid` e `customer.subscription.deleted`
5. Clique "Add endpoint"
6. Clique no endpoint criado
7. Copie o "Signing secret"

**Saída esperada**:
```
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

#### 2.4 Stripe - Produto e Preço
1. Vá para "Products" no Stripe
2. Clique "Add product"
3. Configure:
   - **Name**: `Doutor Agenda Essential`
   - **Type**: Recurring (em "How often?")
   - **Billing interval**: Monthly
   - **Price**: R$ X/mês (ex: R$ 99)
4. Clique "Save product"
5. Você verá o **Price ID** (formato: `price_xxx`)

**Saída esperada**:
```
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_xxx
```

#### 2.5 Better Auth Secret
Execute no seu computador:
```bash
openssl rand -hex 32
```

Copie o resultado (será 64 caracteres).

**Saída esperada**:
```
BETTER_AUTH_SECRET=abc123def456... (64 caracteres)
```

---

### **FASE 3: Deploy na Vercel** (5-10 minutos)

#### 3.1 Conectar GitHub à Vercel

1. Vá para https://vercel.com/dashboard
2. Clique "Add New" → "Project"
3. Clique "Import Git Repository"
4. **Opção A**: Cole a URL
   ```
   https://github.com/solubiztecnologia/doutor-agenda-final.git
   ```
5. **Opção B**: Ou conecte GitHub e selecione o repositório
6. Clique "Import"

#### 3.2 Configurar Variáveis de Ambiente

Na página de configuração do novo projeto:

1. Vá para "Environment Variables"
2. Clique "Add New" e adicione cada variável:

```
DATABASE_URL
postgresql://postgres:senha@db.xxxxx.supabase.co:5432/postgres?sslmode=require

GOOGLE_CLIENT_ID
xxx.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET
xxx

STRIPE_PUBLIC_KEY
pk_test_xxx

STRIPE_SECRET_KEY
sk_test_xxx

STRIPE_WEBHOOK_SECRET
whsec_xxx

STRIPE_ESSENTIAL_PLAN_PRICE_ID
price_xxx

NEXT_PUBLIC_APP_URL
https://doutor-agenda.vercel.app

BETTER_AUTH_SECRET
abc123def456... (64 caracteres)
```

**Importante**: `NEXT_PUBLIC_APP_URL` você pode colocar um placeholder por enquanto. Será atualizado após saber a URL final.

#### 3.3 Fazer o Deploy

1. Clique "Deploy"
2. Aguarde o build completar (3-5 minutos)
3. Você verá:
   - ✅ Cloning
   - ✅ Installing
   - ✅ Building
   - ✅ Ready

A aplicação estará rodando em uma URL como:
```
https://doutor-agenda-xxx.vercel.app
```

---

### **FASE 4: Atualizar Credenciais com URL Final** (5 minutos)

Agora que você tem a URL final (ex: `https://doutor-agenda-abc.vercel.app`):

#### 4.1 Atualizar Google OAuth

1. Volte ao [Google Cloud Console](https://console.cloud.google.com)
2. Vá para "Credenciais" e clique no seu OAuth ID
3. Em "URIs autorizados de redirecionamento", adicione:
   ```
   https://doutor-agenda-abc.vercel.app/api/auth/callback/google
   ```
4. Clique "Salvar"

#### 4.2 Atualizar Stripe Webhook

1. Volte ao [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá para "Webhooks"
3. Clique no endpoint que criou
4. Clique "Edit"
5. Mude a URL para:
   ```
   https://doutor-agenda-abc.vercel.app/api/stripe/webhook
   ```
6. Clique "Save"

#### 4.3 Atualizar Vercel Env Var

1. Na dashboard da Vercel, vá para "Settings" → "Environment Variables"
2. Encontre `NEXT_PUBLIC_APP_URL`
3. Mude para:
   ```
   https://doutor-agenda-abc.vercel.app
   ```
4. Clique "Save"
5. Vercel vai automaticamente fazer redeploy

---

### **FASE 5: Testar e Validar** (10-15 minutos)

#### 5.1 Acessar a Aplicação
```
https://doutor-agenda-abc.vercel.app
```

Você deve ver a página inicial.

#### 5.2 Testar Google OAuth
1. Clique "Sign in with Google"
2. Faça login
3. Você deve ser redirecionado para o dashboard

#### 5.3 Testar Criar Clínica
1. Preencha informações da clínica
2. Clique "Criar"
3. Verifique que foi criado

#### 5.4 Testar Pagamento Stripe
1. Vá para "Subscription"
2. Clique "Upgrade to Essential"
3. Use cartão de teste: `4242 4242 4242 4242`
4. Qualquer data futura, qualquer CVC
5. Clique "Pay"
6. Você deve ser redirecionado com sucesso

---

## 📊 Timeline Estimado

| Fase | Tempo | Cumprimento |
|------|-------|------------|
| **FASE 1**: Supabase | 5-10 min | ⏳ Próxima |
| **FASE 2**: Credenciais | 15-20 min | ⏳ Após Fase 1 |
| **FASE 3**: Deploy Vercel | 5-10 min | ⏳ Após Fase 2 |
| **FASE 4**: Atualizar Credenciais | 5 min | ⏳ Após Fase 3 |
| **FASE 5**: Testes | 10-15 min | ⏳ Após Fase 4 |
| **Total Estimado** | **40-60 minutos** | - |

---

## 🎁 Benefícios da Vercel

- ✅ **Free tier generoso**: 100GB bandwidth, serverless functions ilimitadas
- ✅ **Deploy automático**: GitHub push = deploy automático
- ✅ **Preview URLs**: Cada PR gera URL de preview
- ✅ **Analytics**: Veja performance, erros, logs em tempo real
- ✅ **Edge functions**: Respostas ultra-rápidas
- ✅ **SSL/HTTPS**: Automático, renovação automática
- ✅ **Domínio personalizado**: Configure seu domínio em 5 minutos
- ✅ **Rollback instantâneo**: Volte à versão anterior em 1 clique

---

## 🔄 Workflow após Deploy

```
1. Você faz commit no GitHub
   ↓
2. GitHub notifica Vercel
   ↓
3. Vercel automaticamente:
   - Clona o código
   - Instala dependências
   - Faz build
   - Deploy
   ↓
4. Seu site está atualizado em ~2-3 minutos
```

---

## 📁 Arquivos Importantes

### No GitHub
```
doutor-agenda-final/
├── DEPLOYMENT_VERCEL.md         ← Guia completo
├── QUICK_START_VERCEL.md        ← Guia rápido
├── CREDENTIALS_CHECKLIST.md     ← Checklist
├── .env.example                 ← Template
├── package.json                 ← Dependências
├── next.config.ts              ← Next.js config
├── src/lib/auth.ts             ← Google OAuth
├── src/db/
│   ├── index.ts                ← Conexão DB
│   └── schema.ts               ← Schema Drizzle
└── src/app/api/stripe/webhook/ ← Webhook Stripe
```

---

## ⚙️ Próximos Passos Imediatos

### Hoje (Agora)
1. ✅ Revisar este documento
2. ⏳ Começar FASE 1 - Criar Supabase
3. ⏳ Obter DATABASE_URL

### Assim que Tiver DATABASE_URL
1. ⏳ Começar FASE 2 - Google OAuth
2. ⏳ Obter Stripe credentials

### Assim que Tiver Todas as Credenciais
1. ⏳ Começar FASE 3 - Deploy Vercel
2. ⏳ Esperar 3-5 minutos

### Após Deploy
1. ⏳ FASE 4 - Atualizar URLs
2. ⏳ FASE 5 - Testar

---

## 🆘 Precisa de Ajuda?

### Documentação
- **Guia Completo**: [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)
- **Rápido (5 min)**: [QUICK_START_VERCEL.md](./QUICK_START_VERCEL.md)
- **Credenciais**: [CREDENTIALS_CHECKLIST.md](./CREDENTIALS_CHECKLIST.md)

### Troubleshooting
Veja a seção em [DEPLOYMENT_VERCEL.md#troubleshooting](./DEPLOYMENT_VERCEL.md#troubleshooting)

### Contato com Suporte
- **Vercel**: vercel.com/support
- **Supabase**: supabase.com/support
- **Stripe**: stripe.com/support

---

**Status Atual**: Aguardando Criação do Supabase (Fase 1)
**Plataforma**: Vercel + Supabase
**Tempo até Deploy**: ~40-60 minutos
**Última Atualização**: 2026-03-27
