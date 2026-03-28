# Guia de Deploy - Doutor Agenda

Este documento fornece instruções completas para fazer o deploy da aplicação Doutor Agenda em um servidor Ubuntu/Debian com aapanel.

## Pré-requisitos

- Servidor Ubuntu/Debian com Node.js 18+ instalado
- aapanel configurado e funcionando
- PostgreSQL 15+ instalado
- Domínio apontando para o servidor (via Cloudflare ou outro DNS)
- Acesso SSH ao servidor
- PM2 para gerenciamento de processos

## Fase 1: Preparar Credenciais Externas

### 1.1 Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto (ou use um existente)
3. Ative a "Google+ API"
4. Vá para "Credenciais" → "Criar Credencial" → "OAuth 2.0 Client ID"
5. Selecione "Aplicação Web"
6. Adicione os URIs autorizados:
   - **Desenvolvimento**: `http://localhost:3000/api/auth/callback/google`
   - **Produção**: `https://seu-dominio.com/api/auth/callback/google`
7. Copie o `Client ID` e `Client Secret`
8. Guarde em local seguro para usar depois

### 1.2 Stripe

1. Crie conta em [Stripe](https://stripe.com)
2. Acesse o Dashboard
3. Vá para "Developers" → "API keys"
4. Copie a `Secret Key` (começa com `sk_`)
5. Copie a `Publishable Key` (começa com `pk_`)
6. Vá para "Webhooks" e configure um webhook para:
   - URL: `https://seu-dominio.com/api/stripe/webhook`
   - Eventos: `invoice.paid`, `customer.subscription.deleted`
7. Copie o `Signing secret` (começa com `whsec_`)
8. Crie um Produto e Preço no Stripe:
   - Type: Subscription (Monthly)
   - Copie o Price ID (formato: `price_xxxxx`)

## Fase 2: Clonar e Configurar Projeto no Servidor

### 2.1 Conectar ao Servidor

```bash
ssh root@10.3.3.100  # ou seu-usuario@seu-servidor
```

### 2.2 Clonar Repositório

```bash
cd /www/wwwroot
git clone https://github.com/solubiztecnologia/doutor-agenda-final.git dragenda.solubiztecnologia.com.br
cd dragenda.solubiztecnologia.com.br
```

### 2.3 Criar Arquivo `.env.local`

```bash
nano .env.local
```

Copie e preencha com seus valores reais:

```env
# Database - use a string de conexão do servidor PostgreSQL
DATABASE_URL=postgresql://doutor_agenda:sua_senha@localhost:5433/dragenda

# Google OAuth - valores obtidos em 1.1
GOOGLE_CLIENT_ID=seu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# Stripe - valores obtidos em 1.2
STRIPE_SECRET_KEY=sk_live_seu_stripe_secret_key
STRIPE_PUBLIC_KEY=pk_live_seu_stripe_public_key
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_seu_price_id

# Application URL
NEXT_PUBLIC_APP_URL=https://dragenda.solubiztecnologia.com.br

# Better Auth Secret (gerar com: openssl rand -hex 32)
BETTER_AUTH_SECRET=seu_secret_gerado_com_openssl
```

**Importante**: Nunca compartilhe este arquivo! O `.env.local` está no `.gitignore` e não deve ser commitado.

## Fase 3: Instalar Dependências e Fazer Build

```bash
# Instalar dependências (use legacy-peer-deps se houver conflitos)
npm install --legacy-peer-deps

# Fazer build da aplicação
npm run build

# Se houver erro de migrations, execute:
DATABASE_URL="postgresql://doutor_agenda:senha@localhost:5433/dragenda" npx drizzle-kit push
```

## Fase 4: Configurar PM2

### 4.1 Criar `ecosystem.config.js`

```bash
nano ecosystem.config.js
```

Conteúdo:

```javascript
module.exports = {
  apps: [
    {
      name: "dragenda",
      script: "npm",
      args: "start",
      cwd: "/www/wwwroot/dragenda.solubiztecnologia.com.br",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      instances: 1,
      exec_mode: "cluster",
      max_memory_restart: "1G",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
    },
  ],
};
```

### 4.2 Criar Diretório de Logs

```bash
mkdir -p ./logs
```

### 4.3 Instalar PM2 Globalmente

```bash
npm install -g pm2
pm2 startup
pm2 save
```

### 4.4 Iniciar Aplicação

```bash
pm2 start ecosystem.config.js
pm2 status
pm2 logs dragenda
```

## Fase 5: Configurar Site no aapanel

### 5.1 Adicionar Site

1. Acesse aapanel: `http://seu-servidor-ip:7800`
2. Vá para "Website" → "Add Site"
3. Configure:
   - **Domain**: `dragenda.solubiztecnologia.com.br`
   - **Path**: `/www/wwwroot/dragenda.solubiztecnologia.com.br`
   - **Select PHP/Node**: Node.js
   - **Port**: 3002 (porta usada pelo PM2)

### 5.2 Configurar nginx

O aapanel criará automaticamente um vhost nginx. Se precisar editar:

1. Vá para "Website" → site → "Conf"
2. Certifique-se que está configurado como proxy reverso:

```nginx
upstream nodebb {
    server 127.0.0.1:3002;
}

server {
    listen 80;
    listen [::]:80;
    server_name dragenda.solubiztecnologia.com.br www.dragenda.solubiztecnologia.com.br;

    location / {
        proxy_pass http://nodebb;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Recarregue nginx: `sudo systemctl reload nginx`

### 5.3 Configurar SSL/HTTPS

1. Vá para "Website" → site → "SSL"
2. Clique "Auto HTTPS" (Let's Encrypt)
3. Aguarde a geração do certificado

## Fase 6: Testar Aplicação

### 6.1 Verificar Acesso

1. Abra no navegador: `https://dragenda.solubiztecnologia.com.br`
2. A página deve carregar normalmente

### 6.2 Testar Login

1. Clique em "Sign in with Google"
2. Faça login com sua conta Google
3. Verifique se a sessão foi criada

### 6.3 Testar Fluxo de Clínica

1. Preencha dados da clínica
2. Crie a clínica
3. Verifique se foi salva no banco

### 6.4 Testar Pagamento

1. Vá para "Subscription"
2. Clique em "Upgrade"
3. Teste o fluxo de pagamento (use cartão de teste do Stripe: `4242 4242 4242 4242`)

### 6.5 Verificar Logs

```bash
pm2 logs dragenda              # Logs da aplicação
sudo tail -f /var/log/nginx/access.log  # Logs de acesso nginx
```

## Fase 7: Monitoramento e Manutenção

### 7.1 Comandos Úteis do PM2

```bash
pm2 status              # Ver status das aplicações
pm2 logs dragenda       # Ver logs em tempo real
pm2 monit              # Ver uso de recursos
pm2 restart dragenda   # Reiniciar aplicação
pm2 stop dragenda      # Parar aplicação
pm2 delete dragenda    # Remover aplicação
```

### 7.2 Backup do Banco de Dados

```bash
# Fazer backup manual
pg_dump -U doutor_agenda -d dragenda > /backup/dragenda_$(date +%Y%m%d).sql

# Restaurar backup
psql -U doutor_agenda -d dragenda < /backup/dragenda_backup.sql
```

### 7.3 Atualizar Aplicação

```bash
cd /www/wwwroot/dragenda.solubiztecnologia.com.br

# Fazer pull do repositório
git pull origin main

# Instalar novas dependências (se houver)
npm install --legacy-peer-deps

# Fazer build
npm run build

# Reiniciar aplicação
pm2 restart dragenda
```

## Troubleshooting

| Erro | Solução |
|------|---------|
| **EADDRINUSE - Porta em uso** | Encontre o processo: `lsof -i :3002` e mate-o: `kill -9 <PID>` |
| **DATABASE_URL error** | Verifique a string de conexão em `.env.local` e se PostgreSQL está rodando |
| **502 Bad Gateway** | Verifique se Node.js está rodando: `pm2 status` |
| **Google OAuth fails** | Atualize os URIs autorizados no Google Cloud Console |
| **HTTPS error** | Verifique certificado SSL no aapanel e em "Settings" > "SSL" |
| **Webhook não funciona** | Teste webhook com: `curl -X POST https://seu-dominio.com/api/stripe/webhook` |

## Checklist Final

- [ ] PostgreSQL rodando e banco criado
- [ ] `.env.local` preenchido com todas as chaves
- [ ] `npm install` e `npm run build` funcionando
- [ ] PM2 iniciado com sucesso
- [ ] nginx configurado como proxy reverso
- [ ] SSL/HTTPS habilitado
- [ ] Google OAuth testado
- [ ] Fluxo de pagamento Stripe testado
- [ ] Logs monitorados regularmente

## Suporte

Para mais informações:
- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://docs.better-auth.com)
- [Stripe Documentation](https://stripe.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)
