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

Para fazer o deploy do Doutor Agenda em um servidor de produção, consulte a documentação:

- **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** - Overview do deployment e status atual
- **[QUICK_START.md](./QUICK_START.md)** - Guia rápido para iniciar o deploy
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guia completo passo a passo
- **[CREDENTIALS_CHECKLIST.md](./CREDENTIALS_CHECKLIST.md)** - Checklist de credenciais necessárias
- **[.env.example](./.env.example)** - Template de variáveis de ambiente

### Pré-requisitos
- Server Ubuntu/Debian com Node.js 18+
- PostgreSQL 15+
- aapanel (ou outro painel de controle)
- Domínio apontando para o servidor

### Quick Start
```bash
# 1. Clonar repositório
git clone https://github.com/solubiztecnologia/doutor-agenda-final.git
cd doutor-agenda-final

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencha com suas credenciais

# 3. Instalar e build
npm install
npm run build

# 4. Executar em produção
npm start
```

---
