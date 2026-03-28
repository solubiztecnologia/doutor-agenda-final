# Resumo de Deploy - Doutor Agenda para Produção

**Data**: 27 de Março de 2026
**Versão**: 0.1.0
**Servidor Target**: 10.3.3.100 (Ubuntu/Debian com aapanel)
**Domínio**: dragenda.solubiztecnologia.com.br

---

## ✅ O que já foi Preparado

### 1. Código e Repositório
- ✅ Projeto clonado do repositório original
- ✅ GitHub fork criado em `https://github.com/solubiztecnologia/doutor-agenda-final.git`
- ✅ Código limpo e atualizado com todas as dependências
- ✅ `.env.example` adicionado ao repositório
- ✅ `.gitignore` atualizado para permitir `.env.example`
- ✅ Todos os commits sincronizados com GitHub

### 2. Documentação de Deploy
- ✅ **DEPLOYMENT.md** - Guia completo passo a passo
- ✅ **CREDENTIALS_CHECKLIST.md** - Checklist de credenciais
- ✅ **QUICK_START.md** - Guia rápido de deployment
- ✅ **ecosystem.config.js** - Configuração PM2 para produção

### 3. Infraestrutura do Servidor
- ✅ Server Ubuntu/Debian em `10.3.3.100`
- ✅ Node.js 20+ instalado
- ✅ PostgreSQL 17 instalado e rodando na porta 5433
- ✅ Usuario PostgreSQL `doutor_agenda` criado
- ✅ Banco de dados `dragenda` criado e vazio (esperando migrations)
- ✅ aapanel ativo e funcionando
- ✅ Cloudflare DNS apontando corretamente para o servidor

### 4. Configuração do Servidor
- ✅ Permissões do projeto em `/www/wwwroot/`
- ✅ SSL/HTTPS pronto para ser habilitado via Let's Encrypt
- ✅ nginx configurado como reverse proxy
- ✅ Diretório de logs pronto

---

## ⏳ O que falta fazer (Ordem de Prioridade)

### **FASE 1: Obter Credenciais Externas** (20-30 minutos)

#### 1.1 Google OAuth
**O que fazer**:
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie novo projeto para "Doutor Agenda"
3. Ative "Google+ API"
4. Crie credencial OAuth 2.0:
   - Tipo: Aplicação Web
   - URIs autorizados:
     - `http://localhost:3000/api/auth/callback/google` (dev)
     - `https://dragenda.solubiztecnologia.com.br/api/auth/callback/google` (prod)
5. Copie **Client ID** e **Client Secret**

**Saída esperada**:
```
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

#### 1.2 Stripe
**O que fazer**:
1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá para "Developers" → "API keys"
3. Copie:
   - **Secret Key** (começa com `sk_live_`)
   - **Publishable Key** (começa com `pk_live_`)
4. Configure Webhook:
   - URL: `https://dragenda.solubiztecnologia.com.br/api/stripe/webhook`
   - Eventos: `invoice.paid`, `customer.subscription.deleted`
   - Copie o **Signing secret** (começa com `whsec_`)
5. Crie Produto e Preço:
   - Product: "Doutor Agenda Essential"
   - Type: Subscription (Recurring)
   - Price: $X/mês
   - Copie o **Price ID** (formato: `price_xxx`)

**Saída esperada**:
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_xxx
```

#### 1.3 Better Auth Secret
**O que fazer**:
1. No servidor, execute:
   ```bash
   openssl rand -hex 32
   ```
2. Copie o valor gerado (64 caracteres)

**Saída esperada**:
```
BETTER_AUTH_SECRET=xxx (64 caracteres)
```

---

### **FASE 2: Deploy no Servidor** (15-20 minutos)

**Pré-requisito**: Ter completado FASE 1

**O que fazer**:

```bash
# 1. Conecte ao servidor
ssh root@10.3.3.100

# 2. Clone o repositório
cd /www/wwwroot
rm -rf dragenda.solubiztecnologia.com.br  # Remova clone anterior se existir
git clone https://github.com/solubiztecnologia/doutor-agenda-final.git dragenda.solubiztecnologia.com.br
cd dragenda.solubiztecnologia.com.br

# 3. Crie .env.local com as credenciais
cat > .env.local << 'EOF'
DATABASE_URL=postgresql://doutor_agenda:SENHA_DO_POSTGRES@localhost:5433/dragenda
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_xxx
NEXT_PUBLIC_APP_URL=https://dragenda.solubiztecnologia.com.br
BETTER_AUTH_SECRET=xxx
EOF

# 4. Instale dependências
npm install --legacy-peer-deps

# 5. Faça build
npm run build

# Se houver erro de migrations, execute:
# DATABASE_URL="postgresql://doutor_agenda:SENHA@localhost:5433/dragenda" npx drizzle-kit push

# 6. Inicie com PM2
pm2 start ecosystem.config.js
pm2 status

# 7. Verifique logs
pm2 logs dragenda
```

**Saída esperada**:
- Build completa sem erros
- PM2 status mostra `dragenda` rodando
- Logs mostram servidor escutando na porta 3002

---

### **FASE 3: Testar e Validar** (10-15 minutos)

1. **Acesso à URL**
   ```
   https://dragenda.solubiztecnologia.com.br
   ```
   - Deve carregar a página principal

2. **Google OAuth**
   - Clique em "Sign in with Google"
   - Faça login
   - Deve ser redirecionado para dashboard

3. **Criar Clínica**
   - Preencha dados da clínica
   - Salve
   - Deve aparecer no banco de dados

4. **Fluxo de Pagamento**
   - Vá para "Subscription"
   - Clique em "Upgrade to Essential"
   - Use cartão de teste: `4242 4242 4242 4242`
   - Qualquer data/CVV futuros funcionam
   - Deve redirecionar para dashboard após sucesso

5. **Verificar Logs**
   ```bash
   pm2 logs dragenda
   ```
   - Não deve haver erros
   - Deve ver requisições HTTP

---

## 📊 Timeline Estimado

| Fase | Tempo | Status |
|------|-------|--------|
| **FASE 1**: Obter Credenciais | 20-30 min | ⏳ Próxima |
| **FASE 2**: Deploy | 15-20 min | ⏳ Após Fase 1 |
| **FASE 3**: Testes | 10-15 min | ⏳ Após Fase 2 |
| **Total Estimado** | **45-65 minutos** | - |

---

## 📁 Arquivos Importantes

### No Repositório (GitHub)
```
doutor-agenda/
├── .env.example                 # Template de variáveis
├── ecosystem.config.js          # Configuração PM2
├── DEPLOYMENT.md                # Guia completo
├── CREDENTIALS_CHECKLIST.md     # Checklist de credenciais
├── QUICK_START.md              # Guia rápido
├── DEPLOYMENT_SUMMARY.md       # Este arquivo
├── package.json                # Dependências
├── drizzle.config.ts           # Configuração BD
├── next.config.ts              # Configuração Next.js
└── src/
    ├── lib/auth.ts             # Configuração Google OAuth
    ├── db/
    │   ├── index.ts            # Conexão PostgreSQL
    │   └── schema.ts            # Schema do banco
    └── app/api/stripe/webhook/ # Webhook Stripe
```

### No Servidor (Produção)
```
/www/wwwroot/dragenda.solubiztecnologia.com.br/
├── .env.local                  # 🔒 Credenciais (NÃO COMMITAR)
├── .next/                      # Build Next.js
├── logs/                       # Logs PM2
│   ├── err.log
│   └── out.log
├── node_modules/               # Dependências
└── [outros arquivos do projeto]
```

---

## 🔒 Segurança - Checklist

- [ ] `.env.local` criado apenas no servidor
- [ ] Nenhuma credencial em commits do git
- [ ] PostgreSQL com senha forte
- [ ] SSL/HTTPS habilitado
- [ ] Firewall protegendo porta 3002 (localhost apenas)
- [ ] Backups do banco configurados
- [ ] 2FA habilitado no Google Cloud
- [ ] 2FA habilitado no Stripe
- [ ] Logs monitorados para atividades suspeitas

---

## 📞 Próximos Passos Imediatos

### Hoje (Agora)
1. ✅ Revisar este documento
2. ⏳ Começar FASE 1 - Obter credenciais do Google
3. ⏳ Obter credenciais do Stripe
4. ⏳ Gerar Better Auth Secret

### Assim que Credenciais Estiverem Prontas
1. ⏳ Fazer FASE 2 - Deploy no servidor
2. ⏳ Fazer FASE 3 - Testes e validação
3. ⏳ Configurar backups automáticos

### Após Validação
1. ⏳ Monitoramento contínuo de logs
2. ⏳ Configurar alertas para erros críticos
3. ⏳ Documentar qualquer customização feita

---

## 🆘 Precisa de Ajuda?

### Documentação
- **Detalhes Completos**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Credenciais**: [CREDENTIALS_CHECKLIST.md](./CREDENTIALS_CHECKLIST.md)
- **Rápido**: [QUICK_START.md](./QUICK_START.md)

### Erros Comuns
Veja a seção "Troubleshooting" em [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

### Conectar ao Servidor
```bash
ssh root@10.3.3.100
```

### Ver Status da Aplicação
```bash
# Logs em tempo real
pm2 logs dragenda

# Status
pm2 status

# Uso de recursos
pm2 monit
```

---

## ✨ Próxima Atualização

Este documento deve ser atualizado após:
- Completar deployment em produção
- Qualquer mudança significativa na arquitetura
- Adição de novas credenciais ou serviços externos

---

**Status Atual**: Aguardando Credenciais Externas (Fase 1)
**Responsável**: Equipe de Deploy
**Última Revisão**: 2026-03-27
