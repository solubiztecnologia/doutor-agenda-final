## Roteiro Aula 01: Setup do Projeto

- [x] Inicialização do projeto Next.js
- [x] Configuração de ferramentas (ESlint, Prettier, Tailwind)
- [x] Configuração do Drizzle e banco de dados
- [x] Configuração do shadcn/ui

## Roteiro Aula 02: Autenticação e Configurações do Estabelecimento

- [x] Tela de login e criação de conta
- [x] Login com e-mail e senha
- [x] Login com o Google
- [x] Fundamentos do Next.js (Rotas, Páginas, Layouts)
- [x] Criação de clínica

## Roteiro Aula 03: Gerenciamento de Profissionais e Disponibilidade

- [x] Sidebar e Route Groups
- [x] Página de médicos
- [x] Criação de médicos & NextSafeAction
- [x] Listagem de médicos
- [x] Atualização de médicos
- [x] Deleção de médicos

## Roteiro Aula 04: Gerenciamento de Pacientes e Agendamentos

- [] Criação de pacientes
- [] Edição de pacientes
- [] Listagem de pacientes
- [] Deleção de pacientes
- [] Criação de agendamentos
- [] Listagem de agendamentos
- [] Deleção de agendamentos

---

## �배️ Deployment para Produção

Para fazer o deploy do Doutor Agenda na Vercel, consulte a documentação:

### 📖 Documentação Principal
- **[DEPLOYMENT_SUMMARY_VERCEL.md](./DEPLOYMENT_SUMMARY_VERCEL.md)** - Overview completo (~40-60 min)
- **[QUICK_START_VERCEL.md](./QUICK_START_VERCEL.md)** - Guia rápido (5 minutos)
- **[DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)** - Guia detalhado com troubleshooting
- **[CREDENTIALS_CHECKLIST.md](./CREDENTIALS_CHECKLIST.md)** - Checklist de credenciais
- **[.env.example](./.env.example)** - Template de variáveis de ambiente

### Pré-requisitos
- Conta GitHub (para repositório)
- Conta Vercel (gratuita em vercel.com)
- Supabase para banco PostgreSQL
- Google OAuth credentials
- Stripe account e credentials

### Quick Start (30 minutos)

1. **Criar Supabase** (5 min)
   ```
   supabase.com → New Project → Copiar DATABASE_URL
   ```

2. **Obter Credentials** (15 min)
   - Google OAuth: console.cloud.google.com
   - Stripe: dashboard.stripe.com
   - Better Auth Secret: `openssl rand -hex 32`

3. **Deploy na Vercel** (10 min)
   ```
   vercel.com → Import Repository → Adicionar Environment Variables → Deploy
   ```

4. **Atualizar URLs** (5 min)
   - Google OAuth callback
   - Stripe webhook
   - NEXT_PUBLIC_APP_URL

Veja **[QUICK_START_VERCEL.md](./QUICK_START_VERCEL.md)** para instruções passo a passo.

---
