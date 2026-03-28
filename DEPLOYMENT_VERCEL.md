# Guia de Deploy - Doutor Agenda na Vercel

Este documento fornece instruções completas para fazer o deploy da aplicação Doutor Agenda na Vercel.

## Pré-requisitos

- Repositório GitHub já criado (✅ já tem em `solubiztecnologia/doutor-agenda-final`)
- Conta Vercel criada (gratuita em https://vercel.com)
- Banco de dados PostgreSQL gerenciado (recomendado: Supabase)
- Credenciais externas (Google OAuth, Stripe)

## Fase 1: Preparar Dependências Externas

### 1.1 PostgreSQL Gerenciado (Supabase)

**Por que Supabase?** PostgreSQL gerenciado, integra perfeitamente com Vercel, tem camada gratuita, fácil de usar.

1. Acesse [Supabase](https://supabase.com)
2. Crie conta ou faça login
3. Clique "New Project"
4. Configure:
   - **Name**: `doutor-agenda`
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha região mais próxima do Brasil (ex: `sa-east-1` São Paulo)
5. Aguarde criar o projeto (2-3 minutos)
6. Vá para "Settings" → "Database" → "Connection Strings"
7. Copie a URI com `?sslmode=require` no final

**Guarde**: `DATABASE_URL=postgresql://...`

### 1.2 Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie novo projeto: "Doutor Agenda"
3. Procure por "Google+ API" e ative-a
4. Vá para "Credenciais" → "Criar Credencial" → "OAuth 2.0 Client ID"
5. Selecione "Aplicação Web"
6. Adicione URIs autorizados:
   - `http://localhost:3000/api/auth/callback/google` (desenvolvimento local)
   - `https://seu-projeto.vercel.app/api/auth/callback/google` (produção - usar depois)
7. Clique "Criar"
8. Copie `Client ID` e `Client Secret`

**Guarde**:
```
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### 1.3 Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá para "Developers" → "API keys"
3. Copie:
   - **Secret Key** (começa com `sk_test_` ou `sk_live_`)
   - **Publishable Key** (começa com `pk_test_` ou `pk_live_`)
4. Vá para "Webhooks" e crie novo endpoint:
   - **URL**: `https://seu-projeto.vercel.app/api/stripe/webhook` (usar depois)
   - **Eventos**: selecione `invoice.paid` e `customer.subscription.deleted`
   - Copie o `Signing secret`
5. Crie um Produto:
   - Vá para "Products" e clique "Add product"
   - **Name**: "Doutor Agenda Essential"
   - **Type**: Recurring (assinatura)
   - **Price**: Configure o preço mensal (ex: $29)
   - Copie o **Price ID** (formato: `price_xxx`)

**Guarde**:
```
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_xxx
```

### 1.4 Better Auth Secret

Execute localmente no seu computador:

```bash
openssl rand -hex 32
```

Isso gera uma string de 64 caracteres aleatória.

**Guarde**: `BETTER_AUTH_SECRET=xxx`

---

## Fase 2: Conectar GitHub à Vercel

### 2.1 Acessar Vercel

1. Vá para https://vercel.com/dashboard
2. Clique "Add New" → "Project"

### 2.2 Importar Repositório

1. Clique "Import Git Repository"
2. Cole a URL: `https://github.com/solubiztecnologia/doutor-agenda-final.git`
3. Ou conecte sua conta GitHub para selecionar do repositório
4. Selecione "doutor-agenda-final"
5. Clique "Import"

### 2.3 Configurar Projeto

Na tela de configuração:

1. **Project Name**: `doutor-agenda` (ou seu nome preferido)
2. **Framework**: Detectará automaticamente como "Next.js" ✅
3. **Root Directory**: `/` (deixar padrão)

### 2.4 Adicionar Variáveis de Ambiente

**IMPORTANTE**: Antes de fazer o deploy, adicione as variáveis de ambiente.

Clique em "Environment Variables" e adicione cada uma:

```
DATABASE_URL = postgresql://...
GOOGLE_CLIENT_ID = xxx
GOOGLE_CLIENT_SECRET = xxx
STRIPE_PUBLIC_KEY = pk_test_xxx
STRIPE_SECRET_KEY = sk_test_xxx
STRIPE_WEBHOOK_SECRET = whsec_xxx
STRIPE_ESSENTIAL_PLAN_PRICE_ID = price_xxx
NEXT_PUBLIC_APP_URL = https://seu-projeto.vercel.app
BETTER_AUTH_SECRET = xxx (64 caracteres)
```

**Nota sobre NEXT_PUBLIC_APP_URL**: Se não souber a URL final ainda, use `https://doutor-agenda.vercel.app` ou aguarde o deploy gerar a URL.

---

## Fase 3: Deploy

### 3.1 Fazer o Deploy

Clique "Deploy" para iniciar o build.

A Vercel fará:
- ✅ Clone do repositório
- ✅ Instalar dependências (`npm install`)
- ✅ Executar build (`npm run build`)
- ✅ Fazer migrations do banco (se `.env.local` tiver DATABASE_URL)
- ✅ Hospedar a aplicação

**Tempo estimado**: 3-5 minutos

### 3.2 Acompanhar o Deploy

A página mostrará o progresso em tempo real:
- Cloning
- Installing
- Building
- Ready ✅

Se houver erro, veja os logs para diagnosticar.

### 3.3 Obter URL Final

Após deploy bem-sucedido, você terá uma URL como:
```
https://doutor-agenda.vercel.app
```

---

## Fase 4: Atualizar Credenciais com URL Final

Agora que você tem a URL final, precisa atualizar algumas credenciais:

### 4.1 Atualizar Google OAuth

1. Volte ao Google Cloud Console
2. Edite as credenciais OAuth
3. Adicione o novo URI autorizado:
   ```
   https://sua-url-vercel.vercel.app/api/auth/callback/google
   ```
4. Salve as alterações

### 4.2 Atualizar Stripe Webhook

1. Volte ao Stripe Dashboard
2. Edite o webhook
3. Atualize a URL para:
   ```
   https://sua-url-vercel.vercel.app/api/stripe/webhook
   ```

### 4.3 Atualizar Variável NEXT_PUBLIC_APP_URL na Vercel

1. No dashboard Vercel, vá para "Settings" → "Environment Variables"
2. Edite `NEXT_PUBLIC_APP_URL`
3. Mude para:
   ```
   https://sua-url-vercel.vercel.app
   ```
4. Clique "Save"
5. Faça um novo deploy (vai automaticamente redeploy quando mudar variável)

---

## Fase 5: Testes

### 5.1 Acessar a Aplicação

Abra em seu navegador:
```
https://sua-url-vercel.vercel.app
```

Você deve ver a página inicial da aplicação.

### 5.2 Testar Google OAuth

1. Clique em "Sign in with Google"
2. Faça login com sua conta Google
3. Você deve ser redirecionado para o dashboard

### 5.3 Testar Criar Clínica

1. Preencha os dados da clínica
2. Clique "Criar"
3. Verifique se a clínica foi criada no Supabase

Para verificar no Supabase:
1. Vá para https://app.supabase.com
2. Selecione o projeto "doutor-agenda"
3. Vá para "Table Editor"
4. Procure pela tabela "clinics"
5. Você deve ver os dados que inseriu

### 5.4 Testar Pagamento Stripe

1. Vá para a página "Subscription"
2. Clique "Upgrade to Essential"
3. Na página de checkout do Stripe, use um cartão de teste:
   ```
   Número: 4242 4242 4242 4242
   Data: Qualquer data futura (ex: 12/25)
   CVC: Qualquer 3 dígitos (ex: 123)
   ```
4. Complete o pagamento
5. Você deve ser redirecionado para o dashboard com sucesso

### 5.5 Verificar Logs

No dashboard Vercel:
1. Vá para "Deployments"
2. Clique no deploy atual
3. Vá para "Logs"
4. Você verá os logs da aplicação em tempo real

Se houver erros, procure por "Error" ou "Exception" nos logs.

---

## Fase 6: Domínio Personalizado (Opcional)

Se você tiver um domínio (como `dragenda.solubiztecnologia.com.br`):

### 6.1 Adicionar Domínio na Vercel

1. No dashboard Vercel, vá para "Settings" → "Domains"
2. Clique "Add Domain"
3. Digite seu domínio: `dragenda.solubiztecnologia.com.br`
4. Vercel mostrará as instruções de DNS

### 6.2 Configurar DNS (Cloudflare)

1. Acesse seu Cloudflare Dashboard
2. Selecione o domínio
3. Vá para "DNS"
4. Siga as instruções da Vercel para apontar o domínio
5. Geralmente é um registro CNAME: `seu-dominio.vercel.app`

### 6.3 Atualizar Credenciais Novamente

Se usar domínio personalizado, atualize:
- Google OAuth URI: `https://dragenda.solubiztecnologia.com.br/api/auth/callback/google`
- Stripe Webhook: `https://dragenda.solubiztecnologia.com.br/api/stripe/webhook`
- Vercel `NEXT_PUBLIC_APP_URL`: `https://dragenda.solubiztecnologia.com.br`

---

## Troubleshooting

### Erro: "DATABASE_URL not found"

**Problema**: A variável DATABASE_URL não foi configurada na Vercel.

**Solução**:
1. Vá para "Settings" → "Environment Variables"
2. Adicione DATABASE_URL com a string de conexão do Supabase
3. Faça novo deploy

### Erro: "Google callback failed"

**Problema**: A URL de callback no Google Cloud não está atualizada.

**Solução**:
1. Vá para Google Cloud Console
2. Atualize o URI autorizado com a URL final do Vercel
3. Aguarde 5-10 minutos para a mudança propagar

### Erro: "Stripe webhook failed"

**Problema**: O webhook do Stripe não está configurado ou a URL está errada.

**Solução**:
1. Vá para Stripe Dashboard
2. Verifique que o webhook aponta para `https://seu-dominio/api/stripe/webhook`
3. Teste o webhook: abra a página de Stripe Webhook e clique "Send test event"
4. Verifique os logs na Vercel para ver se recebeu o evento

### Build falha com erro de peer dependencies

**Problema**: npm recusa instalar devido a conflitos de dependências.

**Solução**: Adicione uma variável de ambiente na Vercel:
```
NPM_FLAGS = --legacy-peer-deps
```

### Aplicação carrega mas com erro de banco de dados

**Problema**: A aplicação não consegue conectar ao Supabase.

**Solução**:
1. Verifique se a DATABASE_URL está correta
2. Teste a conexão localmente:
   ```bash
   psql "sua-database-url"
   ```
3. Verifique no Supabase se o banco está online
4. Verifique firewall/IP whitelist no Supabase

---

## Comandos Úteis

### Deploy Manual

Se precisar fazer deploy manualmente sem mudar código:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Ver Logs

```bash
vercel logs seu-projeto-name --tail
```

### Variáveis de Ambiente Local

Para testar localmente com as mesmas variáveis:

1. Crie `.env.local` na raiz do projeto
2. Cole as mesmas variáveis que colocou na Vercel
3. Execute `npm run dev`

---

## Checklist Final

- [ ] Supabase criado com banco de dados
- [ ] Google OAuth credenciais obtidas
- [ ] Stripe credenciais e webhook configurados
- [ ] Better Auth Secret gerado
- [ ] Repositório GitHub atualizado
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente adicionadas na Vercel
- [ ] Deploy realizado com sucesso
- [ ] URL final obtida
- [ ] Google OAuth URI atualizado com URL final
- [ ] Stripe webhook atualizado com URL final
- [ ] Vercel `NEXT_PUBLIC_APP_URL` atualizado
- [ ] Google OAuth testado
- [ ] Criar clínica testado
- [ ] Pagamento Stripe testado
- [ ] Domínio personalizado configurado (opcional)

---

## Próximos Passos

1. ✅ Você tem o repositório pronto
2. ⏳ Coletar credenciais (Google + Stripe + Supabase)
3. ⏳ Conectar Vercel ao GitHub
4. ⏳ Configurar variáveis de ambiente
5. ⏳ Fazer deploy
6. ⏳ Testar funcionalidades
7. ⏳ Configurar domínio personalizado

**Tempo estimado total**: 30-45 minutos

---

## Suporte

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Better Auth Documentation](https://docs.better-auth.com)
