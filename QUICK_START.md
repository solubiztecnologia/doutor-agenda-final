# Quick Start - Deploy em Produção

Guia rápido para fazer o deploy do Doutor Agenda em produção.

## 📋 Pré-requisitos

✅ **Já Configurado**:
- Server Ubuntu/Debian em `10.3.3.100`
- Node.js 18+ instalado
- aapanel ativo
- PostgreSQL rodando na porta 5433
- Domínio `dragenda.solubiztecnologia.com.br` apontando para o servidor

## 🎯 Próximos Passos

### 1️⃣ Coletar Credenciais (15-30 minutos)

Siga o [CREDENTIALS_CHECKLIST.md](./CREDENTIALS_CHECKLIST.md) para obter:

- **Google OAuth**: Client ID e Secret
- **Stripe**: API Keys, Webhook Secret, e Price ID para o plano
- **Better Auth Secret**: Gerar com `openssl rand -hex 32`

> 💡 **Dica**: Guarde todos os valores em um arquivo `.txt` temporário (seguro!)

### 2️⃣ Deploy Rápido (10-15 minutos)

```bash
# 1. Conecte ao servidor
ssh root@10.3.3.100

# 2. Clone o repositório atualizado
cd /www/wwwroot
git clone https://github.com/solubiztecnologia/doutor-agenda-final.git dragenda.solubiztecnologia.com.br
cd dragenda.solubiztecnologia.com.br

# 3. Crie .env.local com as credenciais coletadas
nano .env.local

# Cole (preenchendo com seus valores):
# DATABASE_URL=postgresql://doutor_agenda:SENHA@localhost:5433/dragenda
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# STRIPE_SECRET_KEY=...
# STRIPE_PUBLIC_KEY=...
# STRIPE_WEBHOOK_SECRET=...
# STRIPE_ESSENTIAL_PLAN_PRICE_ID=...
# NEXT_PUBLIC_APP_URL=https://dragenda.solubiztecnologia.com.br
# BETTER_AUTH_SECRET=...

# Salve com Ctrl+O, Enter, Ctrl+X

# 4. Instale e build
npm install --legacy-peer-deps
npm run build

# 5. Inicie com PM2
pm2 start ecosystem.config.js
pm2 status

# 6. Verifique em seu navegador
# https://dragenda.solubiztecnologia.com.br
```

### 3️⃣ Testar Funcionalidades (5-10 minutos)

- [ ] Acessar site no navegador
- [ ] Login com Google
- [ ] Criar clínica
- [ ] Testar pagamento com Stripe

### 4️⃣ Verificar Logs

```bash
pm2 logs dragenda
```

## 📞 Precisa de Ajuda?

Veja a documentação completa:

- **Deploy Detalhado**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Checklist de Credenciais**: [CREDENTIALS_CHECKLIST.md](./CREDENTIALS_CHECKLIST.md)
- **Solução de Problemas**: [DEPLOYMENT.md#troubleshooting](./DEPLOYMENT.md#troubleshooting)

## ⚡ Comandos Úteis no Servidor

```bash
# Ver logs em tempo real
pm2 logs dragenda

# Reiniciar aplicação
pm2 restart dragenda

# Ver status
pm2 status

# Atualizar código (git pull)
git pull origin main && npm install && npm run build && pm2 restart dragenda

# Ver espaço em disco
df -h

# Ver uso de memória
free -h

# Fazer backup do banco
pg_dump -U doutor_agenda -d dragenda > /backup/dragenda_$(date +%Y%m%d).sql
```

## 🔒 Segurança

- ✅ SSL/HTTPS habilitado (Let's Encrypt)
- ✅ PostgreSQL com usuário dedicado
- ✅ `.env.local` nunca commitado ao git
- ✅ Variáveis de produção seguras

## 📊 Status do Projeto

| Componente | Status | Próximo |
|------------|--------|---------|
| Repositório | ✅ Clonado | Coletar credenciais |
| Banco Dados | ✅ Configurado | Deploy em produção |
| Servidor | ✅ Pronto | Deploy em produção |
| Credenciais | ⏳ Pendente | Obter via Google + Stripe |
| Deploy | ⏳ Pendente | Executar após credenciais |
| Testes | ⏳ Pendente | Após deploy |

---

**Você está aqui**: Etapa de Coleta de Credenciais

**Próximo**: Começar com a Fase 1 do [CREDENTIALS_CHECKLIST.md](./CREDENTIALS_CHECKLIST.md)
