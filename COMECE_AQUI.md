# 🚀 Comece Aqui - Deploy na Vercel

Bem-vindo! Este arquivo ajudará você a fazer o deploy do Doutor Agenda na Vercel em ~40 minutos.

---

## ✨ O que você vai fazer

1. Criar banco de dados no **Supabase** (5 min)
2. Coletar credenciais do **Google OAuth** (5 min)
3. Coletar credenciais do **Stripe** (10 min)
4. Fazer deploy na **Vercel** (10 min)
5. Testar a aplicação (10 min)

**Total**: ~40 minutos

---

## 📋 Passo a Passo

### Passo 1: Supabase (5 minutos)

1. Vá para https://supabase.com
2. Clique "Start your project"
3. Crie conta ou faça login
4. Clique "New Project"
5. Preencha:
   - **Name**: `doutor-agenda`
   - **Database Password**: Qualquer senha forte
   - **Region**: `South America (sa-east-1)` ← Importante para performance
6. Clique "Create new project"
7. Aguarde 2-3 minutos enquanto cria o banco

**Quando estiver pronto**:
1. Vá para "Settings" → "Database"
2. Procure por "Connection Strings"
3. Copie a string URI (aquela que começa com `postgresql://`)
4. **GUARDE ISTO**: Você vai usar como `DATABASE_URL`

---

### Passo 2: Google OAuth (5 minutos)

1. Vá para https://console.cloud.google.com
2. Clique na logo do Google no canto superior esquerdo
3. Clique "Create a new project"
4. **Name**: `doutor-agenda`
5. Clique "Create"
6. Na barra de pesquisa do topo, procure por **"Google+ API"**
7. Clique no resultado
8. Clique "Enable"
9. Volte à página inicial do console
10. Vá para "Credentials" (no menu esquerdo)
11. Clique "Create Credentials" → "OAuth client ID"
12. Se pedir para "Configure OAuth consent screen", faça:
    - User Type: "External"
    - Preencha nome, email, etc (não importa muito)
    - Clique "Save and Continue"
13. Volta a "Create OAuth client ID"
14. **Application type**: Web application
15. **Authorized JavaScript origins**: Deixe vazio por enquanto
16. **Authorized redirect URIs**: Cole isto:
    ```
    http://localhost:3000/api/auth/callback/google
    ```
17. Clique "Create"
18. Copie o `Client ID` e `Client Secret`
19. **GUARDE ISTO**: Você vai usar como `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`

---

### Passo 3: Stripe (10 minutos)

#### 3.1 - Obter as Chaves

1. Vá para https://dashboard.stripe.com
2. Faça login ou crie conta
3. No menu esquerdo, vá para "Developers" → "API keys"
4. Copie:
   - **Publishable key** (começa com `pk_`)
   - **Secret key** (começa com `sk_`)
5. **GUARDE ISTO**: Você vai usar como `STRIPE_PUBLIC_KEY` e `STRIPE_SECRET_KEY`

#### 3.2 - Webhook (para notificações de pagamento)

1. No Stripe, vá para "Webhooks"
2. Clique "Add endpoint"
3. **Endpoint URL**: Por enquanto, coloque `https://example.com/webhook` (vamos atualizar depois)
4. **Events**: Procure e selecione:
   - `invoice.paid`
   - `customer.subscription.deleted`
5. Clique "Add endpoint"
6. Clique no endpoint que criou
7. Copie o **Signing secret**
8. **GUARDE ISTO**: Você vai usar como `STRIPE_WEBHOOK_SECRET`

#### 3.3 - Criar um Produto

1. No Stripe, vá para "Products"
2. Clique "Add product"
3. Preencha:
   - **Name**: `Doutor Agenda Essential`
   - **Type**: Selecione "Recurring"
   - **Billing interval**: Monthly
   - **Price**: Coloque o preço desejado (ex: R$ 99)
4. Clique "Save product"
5. Você verá um **Price ID** (formato: `price_xxxxx`)
6. **GUARDE ISTO**: Você vai usar como `STRIPE_ESSENTIAL_PLAN_PRICE_ID`

---

### Passo 4: Gerar Better Auth Secret

Execute este comando no seu computador:

```bash
openssl rand -hex 32
```

Isto vai gerar uma string com 64 caracteres.

**GUARDE ISTO**: Você vai usar como `BETTER_AUTH_SECRET`

---

### Passo 5: Deploy na Vercel (10 minutos)

#### 5.1 - Conectar ao GitHub

1. Vá para https://vercel.com
2. Crie conta ou faça login
3. Clique "Add New" → "Project"
4. Clique "Import Git Repository"
5. Cole a URL do repositório:
   ```
   https://github.com/solubiztecnologia/doutor-agenda-final.git
   ```
6. Clique "Import"

#### 5.2 - Adicionar Variáveis de Ambiente

Na página que abre:

1. Procure por "Environment Variables"
2. Clique "Add New" para cada variável:

```
DATABASE_URL
(Cole a string do Supabase)

GOOGLE_CLIENT_ID
(Cole do Google)

GOOGLE_CLIENT_SECRET
(Cole do Google)

STRIPE_PUBLIC_KEY
(Cole do Stripe)

STRIPE_SECRET_KEY
(Cole do Stripe)

STRIPE_WEBHOOK_SECRET
(Cole do Stripe)

STRIPE_ESSENTIAL_PLAN_PRICE_ID
(Cole do Stripe)

NEXT_PUBLIC_APP_URL
https://doutor-agenda.vercel.app

BETTER_AUTH_SECRET
(Cole o resultado do openssl)
```

#### 5.3 - Deploy!

1. Clique "Deploy"
2. Aguarde 3-5 minutos

Quando terminar, você verá uma URL como:
```
https://doutor-agenda-xxxxx.vercel.app
```

Copie esta URL - você vai usar dela agora.

---

### Passo 6: Atualizar Credenciais (5 minutos)

Agora que você tem a URL final da Vercel, precisa atualizar algumas configurações.

#### 6.1 - Google OAuth

1. Volte ao https://console.cloud.google.com
2. Vá para "Credentials"
3. Clique no seu OAuth Client ID
4. Em "Authorized redirect URIs", adicione:
   ```
   https://sua-url-aqui.vercel.app/api/auth/callback/google
   ```
   (Use a URL que Vercel deu)
5. Clique "Save"

#### 6.2 - Stripe Webhook

1. Volte ao https://dashboard.stripe.com
2. Vá para "Webhooks"
3. Clique no endpoint que criou
4. Clique "Edit"
5. Mude a URL para:
   ```
   https://sua-url-aqui.vercel.app/api/stripe/webhook
   ```
6. Clique "Save"

#### 6.3 - Vercel (NEXT_PUBLIC_APP_URL)

1. Vá para o dashboard da Vercel
2. Selecione seu projeto
3. Vá para "Settings" → "Environment Variables"
4. Encontre `NEXT_PUBLIC_APP_URL`
5. Mude para:
   ```
   https://sua-url-aqui.vercel.app
   ```
6. Clique "Save"

Vercel vai fazer redeploy automaticamente.

---

### Passo 7: Testar (10 minutos)

Agora que tudo está deployado:

#### 7.1 - Acessar a Aplicação

Abra no navegador:
```
https://sua-url-aqui.vercel.app
```

Você deve ver a página inicial.

#### 7.2 - Testar Login Google

1. Clique em "Sign in with Google"
2. Faça login com sua conta Google
3. Você deve ser redirecionado para o dashboard

#### 7.3 - Testar Criar Clínica

1. No dashboard, clique "Criar Clínica"
2. Preencha os dados
3. Clique "Criar"
4. Verifique se foi criada

#### 7.4 - Testar Pagamento

1. Vá para "Subscription" ou "Planos"
2. Clique para fazer upgrade
3. Use este cartão de teste do Stripe:
   ```
   Número: 4242 4242 4242 4242
   Validade: Qualquer data futura (ex: 12/25)
   CVC: Qualquer 3 números (ex: 123)
   ```
4. Complete o pagamento
5. Você deve voltar para o dashboard com sucesso

---

## ✅ Pronto!

Se tudo funcionou, parabéns! Seu aplicativo está no ar! 🎉

---

## 📖 Documentação Completa

Se tiver dúvidas ou precisar de mais detalhes:

- **Guia Completo**: [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)
- **Checklist de Credenciais**: [CREDENTIALS_CHECKLIST.md](./CREDENTIALS_CHECKLIST.md)
- **Quick Start**: [QUICK_START_VERCEL.md](./QUICK_START_VERCEL.md)

---

## 🆘 Problemas?

### Database not found
→ Verifique se `DATABASE_URL` foi copiada corretamente do Supabase

### Google login não funciona
→ Verifique se o URI foi adicionado no Google Cloud Console com a URL final do Vercel

### Stripe webhook not working
→ Verifique se a URL do webhook foi atualizada com a URL final do Vercel

Veja [DEPLOYMENT_VERCEL.md#troubleshooting](./DEPLOYMENT_VERCEL.md#troubleshooting) para mais problemas.

---

**Tempo total**: ~40 minutos

**Próxima revisão**: Após verificar se tudo funciona
