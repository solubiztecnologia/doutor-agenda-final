# Quick Start - Deploy na Vercel

Guia rápido para fazer o deploy do Doutor Agenda na Vercel em ~30 minutos.

## 📋 Pré-requisitos Rápidos

- ✅ Repositório GitHub: `github.com/solubiztecnologia/doutor-agenda-final`
- ✅ Conta Vercel (gratuita em vercel.com)
- ⏳ Supabase para banco de dados
- ⏳ Google OAuth credentials
- ⏳ Stripe credentials

---

## 🎯 Passos Rápidos

### 1️⃣ Coletar Credenciais (10-15 minutos)

#### Supabase (PostgreSQL)
```
https://supabase.com → New Project
→ Guarde: DATABASE_URL (com ?sslmode=require)
```

#### Google OAuth
```
https://console.cloud.google.com → New Project
→ Enable Google+ API
→ Create OAuth 2.0 credentials
→ URI: http://localhost:3000/api/auth/callback/google (por enquanto)
→ Guarde: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
```

#### Stripe
```
https://dashboard.stripe.com → API keys
→ Guarde: STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY
→ Create webhook: https://seu-projeto.vercel.app/api/stripe/webhook
→ Guarde: STRIPE_WEBHOOK_SECRET
→ Create product (subscription) e guarde STRIPE_ESSENTIAL_PLAN_PRICE_ID
```

#### Better Auth Secret
```bash
openssl rand -hex 32
# Guarde o resultado
```

### 2️⃣ Deploy na Vercel (5-10 minutos)

```bash
# 1. Vá para https://vercel.com/dashboard
# 2. Clique "Add New" → "Project"
# 3. Selecione repositório: "doutor-agenda-final"
# 4. Clique "Import"

# 5. Na tela de configuração, clique "Environment Variables"
# 6. Adicione cada uma (copie as credenciais coletadas):

DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_xxx
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
BETTER_AUTH_SECRET=xxx

# 7. Clique "Deploy"
# 8. Aguarde 3-5 minutos
```

### 3️⃣ Atualizar Credenciais com URL Final (5 minutos)

Após deploy, você terá uma URL: `https://doutor-agenda-xxx.vercel.app`

**Atualize**:
- Google OAuth: adicione novo URI `https://sua-url.vercel.app/api/auth/callback/google`
- Stripe Webhook: altere URL para `https://sua-url.vercel.app/api/stripe/webhook`
- Vercel env var `NEXT_PUBLIC_APP_URL`: mude para `https://sua-url.vercel.app`

### 4️⃣ Testar (5 minutos)

```
✅ Abra https://sua-url.vercel.app
✅ Teste "Sign in with Google"
✅ Crie uma clínica
✅ Teste pagamento (cartão 4242 4242 4242 4242)
```

---

## 📊 Status

| Fase | Tempo | Status |
|------|-------|--------|
| Credenciais | 10-15 min | ⏳ Próxima |
| Deploy | 5-10 min | ⏳ Após credenciais |
| Testes | 5 min | ⏳ Após deploy |
| **Total** | **30-45 min** | - |

---

## 🔗 Links Úteis

- [Guia Completo](./DEPLOYMENT_VERCEL.md)
- [Checklist de Credenciais](./CREDENTIALS_CHECKLIST.md)
- [Dashboard Vercel](https://vercel.com/dashboard)
- [Supabase Console](https://app.supabase.com)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Google Cloud Console](https://console.cloud.google.com)

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| DATABASE_URL not found | Adicione a variável no Vercel Settings |
| Google callback fails | Atualize URI no Google Cloud com URL final |
| Stripe webhook fails | Atualize webhook URL no Stripe com URL final |

Veja [DEPLOYMENT_VERCEL.md#troubleshooting](./DEPLOYMENT_VERCEL.md#troubleshooting) para mais detalhes.

---

**Você está aqui**: Fase de Coleta de Credenciais

**Próximo**: Começar com Supabase, depois Google, depois Stripe
