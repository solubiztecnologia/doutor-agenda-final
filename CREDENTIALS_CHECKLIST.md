# Checklist de Credenciais de Produção

Use este documento para rastrear a coleta de todas as credenciais necessárias para o deploy em produção.

## 🗄️ Banco de Dados - PostgreSQL

**Status**: ✅ Concluído no servidor

- [x] PostgreSQL instalado no servidor (versão 15+)
- [x] Usuário `doutor_agenda` criado
- [x] Banco de dados `dragenda` criado
- [x] Conexão testada com sucesso
- [x] STRING: `postgresql://doutor_agenda:SENHA@localhost:5433/dragenda`

**Próximo passo**: Atualizar a senha em `.env.local` no servidor

---

## 🔐 Google OAuth

**Status**: ⏳ Aguardando configuração

### Checklist

- [ ] Acessei [Google Cloud Console](https://console.cloud.google.com)
- [ ] Criei novo projeto (ou selecionei existente)
- [ ] Ativei "Google+ API"
- [ ] Criei credencial OAuth 2.0 Client ID
- [ ] Adicionei URI autorizado de desenvolvimento: `http://localhost:3000/api/auth/callback/google`
- [ ] Adicionei URI autorizado de produção: `https://dragenda.solubiztecnologia.com.br/api/auth/callback/google`
- [ ] Copiei o `Client ID` e `Client Secret`

### Credenciais

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Guardar em**: Local seguro (não compartilhar!)

---

## 💳 Stripe

**Status**: ⏳ Aguardando configuração

### Checklist - Chaves de API

- [ ] Acessei [Stripe Dashboard](https://dashboard.stripe.com)
- [ ] Fui para "Developers" → "API keys"
- [ ] Copiei a `Secret Key` (começa com `sk_live_`)
- [ ] Copiei a `Publishable Key` (começa com `pk_live_`)

### Checklist - Webhook

- [ ] Fui para "Webhooks" em Developers
- [ ] Criei novo endpoint com URL: `https://dragenda.solubiztecnologia.com.br/api/stripe/webhook`
- [ ] Selecionei eventos:
  - [ ] `invoice.paid`
  - [ ] `customer.subscription.deleted`
- [ ] Copiei o `Signing secret` (começa com `whsec_`)

### Checklist - Produto/Preço

- [ ] Acessei "Products" no Stripe Dashboard
- [ ] Criei Produto "Doutor Agenda Essential" (ou semelhante)
- [ ] Configurei como Subscription (Monthly)
- [ ] Defini o preço mensal (ex: $29/mês)
- [ ] Copiei o `Price ID` (formato: `price_xxxxx`)

### Credenciais

```
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_ESSENTIAL_PLAN_PRICE_ID=
```

**Guardar em**: Local seguro (não compartilhar!)

---

## 🔑 Better Auth Secret

**Status**: ⏳ Aguardando geração

### Geração da Chave

Execute no servidor:

```bash
openssl rand -hex 32
```

Isso gerará uma chave aleatória de 64 caracteres.

### Credencial

```
BETTER_AUTH_SECRET=
```

**Guardar em**: `.env.local` no servidor

---

## 🌐 Application URL

**Status**: ✅ Definido

```
NEXT_PUBLIC_APP_URL=https://dragenda.solubiztecnologia.com.br
```

---

## ✅ Resumo de Deployment

Antes de fazer o deploy, certifique-se de ter completado:

### Fase 1: Coleta de Credenciais
- [x] PostgreSQL configurado no servidor
- [ ] Google OAuth Client ID e Secret
- [ ] Stripe Secret Key, Public Key, Webhook Secret
- [ ] Stripe Price ID para o plano
- [ ] Better Auth Secret gerado

### Fase 2: Preparação do Servidor
- [ ] Código clonado em `/www/wwwroot/dragenda.solubiztecnologia.com.br`
- [ ] `.env.local` criado com todas as credenciais
- [ ] `npm install` executado com sucesso
- [ ] `npm run build` funcionando

### Fase 3: Configuração do Ambiente
- [ ] PM2 instalado globalmente
- [ ] `ecosystem.config.js` criado
- [ ] Site adicionado no aapanel
- [ ] nginx configurado como proxy reverso
- [ ] SSL/HTTPS ativado

### Fase 4: Testes
- [ ] Aplicação respondendo em `https://dragenda.solubiztecnologia.com.br`
- [ ] Google OAuth testado
- [ ] Fluxo de pagamento Stripe testado
- [ ] Logs sendo capturados corretamente

---

## 📋 Arquivo `.env.local` Completo

Uma vez que todas as credenciais foram coletadas, crie o arquivo `.env.local` no servidor com:

```env
DATABASE_URL=postgresql://doutor_agenda:SENHA@localhost:5433/dragenda
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_xxxxx
NEXT_PUBLIC_APP_URL=https://dragenda.solubiztecnologia.com.br
BETTER_AUTH_SECRET=seu_secret_de_64_caracteres
```

---

## 🚨 Segurança

**IMPORTANTE**:
- Nunca compartilhe o conteúdo de `.env.local`
- Guarde as credenciais em local seguro
- Use senhas fortes para o PostgreSQL
- Ative 2FA no Google Cloud e Stripe
- Monitore logs para atividades suspeitas
- Faça backup das credenciais em local seguro

---

## 📞 Próximos Passos

1. Complete este checklist coletando todas as credenciais
2. Siga o [DEPLOYMENT.md](./DEPLOYMENT.md) para fazer o deploy
3. Teste cada funcionalidade conforme descrito em DEPLOYMENT.md
4. Configure monitoramento e backups
5. Documente qualquer customização feita no servidor

---

**Última atualização**: 2026-03-27
**Versão do Projeto**: v0.1.0
**Próxima Revisão**: Após cada deploy importante
