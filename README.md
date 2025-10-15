# 🎮 CyberDuel API

**Arena Competitiva de EDRs com Sistema de Mapeamento Inteligente**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

CyberDuel é uma plataforma SaaS inovadora que permite benchmarking automatizado de soluções EDR (Endpoint Detection and Response) através de competições gamificadas em ambiente controlado. A aplicação utiliza IA para mapear logs de diferentes EDRs e calcular pontuações objetivas baseadas em detecção, bloqueio e tempo de resposta.

---

## 📋 **Índice**

- [Características](#características)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Modelos de Dados](#modelos-de-dados)
- [Fluxo de Integração de EDR](#fluxo-de-integração-de-edr)
- [Desenvolvimento](#desenvolvimento)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)

---

## ✨ **Características**

### **Core Features**
- 🎯 **Benchmarking Automatizado** - Competições objetivas entre EDRs com métricas padronizadas
- 🤖 **Mapeamento Inteligente com IA** - Geração automática de parsers de logs usando Gemini
- 🔄 **Infraestrutura como Código** - Provisionamento automatizado via Terraform
- 📊 **Sistema de Pontuação Universal** - Score engine que normaliza logs de qualquer EDR
- 🎮 **Gamificação** - Sistema de "barra de vida" e rankings públicos
- 🔐 **Multi-tenancy** - Suporte para múltiplos usuários e organizações
- 📈 **Real-time Scoring** - Pontuação ao vivo durante competições

### **Diferenciais Técnicos**
- **Zero-touch EDR Onboarding** - Cadastro de novos EDRs em 15 minutos via UI
- **Custo de IA Zero após Setup** - Mapeamento gerado uma vez, reutilizado infinitamente
- **Escalabilidade Horizontal** - Arquitetura distribuída com filas (Bull/Redis)
- **MITRE ATT&CK Native** - Biblioteca completa de TTPs padronizadas

---

## 🏗️ **Arquitetura**

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                    │
│  Web Dashboard (Frontend - React/Vue) + API REST             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   CAMADA DE ORQUESTRAÇÃO                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Express.js API Server (Node.js)                      │   │
│  │ - Autenticação JWT + RBAC                            │   │
│  │ - Rate Limiting & Security (Helmet)                  │   │
│  │ - Request Validation (Joi)                           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Services Layer                                        │   │
│  │ - AI Service (Gemini Integration)                    │   │
│  │ - Score Engine (JSONPath + Normalization)            │   │
│  │ - Orchestration Service (Terraform Integration)      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Data Layer (Mongoose ODM)                            │   │
│  │ - 8 Core Models (EDR, Session, Logs, Scores, etc)   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  CAMADA DE PERSISTÊNCIA                      │
│  MongoDB Atlas (Cloud Database)                              │
│  Redis (Job Queue - Bull)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 **Pré-requisitos**

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB Atlas** (ou MongoDB local >= 6.0)
- **Redis** (para job queues) - Opcional para MVP
- **Terraform** (para provisionamento de VMs) - Opcional para MVP
- **Gemini API Key** (para geração de mapas com IA) - Opcional

---

## 🚀 **Instalação**

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/cyberduel-api.git
cd cyberduel-api
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure o ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/cyberduel?retryWrites=true&w=majority

# JWT
JWT_SECRET=seu-secret-super-seguro-aqui
JWT_EXPIRES_IN=7d

# AI Service (Opcional)
GEMINI_API_KEY=sua-chave-gemini-aqui
AI_MODEL=gemini-1.5-pro

# Redis (Opcional para MVP)
REDIS_HOST=localhost
REDIS_PORT=6379

# Terraform (Opcional para MVP)
TERRAFORM_PATH=terraform
TERRAFORM_WORKDIR=./infra_cyberduel
```

### **4. Inicie o servidor**
```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm start
```

**Saída esperada:**
```
✅ MongoDB Connected Successfully
📍 Database: cyberduel
🌐 Host: cluster0.mongodb.net
🚀 CyberDuel API Server running on port 3000
🌍 Environment: development
📡 API Base: http://localhost:3000/api/v1
```

---

## ⚙️ **Configuração**

### **MongoDB Atlas Setup**

1. Acesse https://cloud.mongodb.com/
2. Crie um cluster gratuito (M0)
3. Configure **Network Access**:
   - Adicione seu IP ou `0.0.0.0/0` (desenvolvimento)
4. Crie um **Database User**:
   - Username: `diegaosalles2012`
   - Password: (sua senha segura)
5. Copie a **Connection String** e atualize no `.env`

### **Gemini API Key (Opcional)**

1. Acesse https://makersuite.google.com/app/apikey
2. Crie uma API Key
3. Adicione no `.env`: `GEMINI_API_KEY=sua-chave`

**Nota:** Sem a API key, o sistema usa mapeamento genérico (funcional, mas menos preciso).

---

## 💻 **Uso**

### **1. Health Check**
```bash
curl http://localhost:3000/health
```

**Resposta:**
```json
{
  "success": true,
  "message": "CyberDuel API is running",
  "timestamp": "2025-10-15T10:30:00.000Z",
  "env": "development",
  "version": "1.0.0"
}
```

### **2. Registrar Usuário**
```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cyberduel.com",
    "password": "Admin123!",
    "name": "Admin CyberDuel",
    "role": "admin"
  }'
```

### **3. Login e Obter Token**
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cyberduel.com",
    "password": "Admin123!"
  }'
```

**Salve o `token` retornado!**

### **4. Cadastrar EDR**
```bash
curl -X POST http://localhost:3000/api/v1/edrs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "CrowdStrike Falcon",
    "vendor": "CrowdStrike",
    "platform": "Windows",
    "description": "Endpoint detection and response solution"
  }'
```

### **5. Gerar Mapa de Logs com IA**
```bash
curl -X POST http://localhost:3000/api/v1/payload-maps/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "edrId": "ID_DO_EDR_CRIADO",
    "logSamples": {
      "detectionLog": {
        "timestamp": 1734208000,
        "event_type": "detection",
        "device_id": "host-001",
        "technique_id": "T1059.003",
        "summary": "Powershell abuse detected"
      },
      "responseLog": {
        "timestamp": 1734208002,
        "action_taken": "ProcessTerminated",
        "status": "Success"
      }
    }
  }'
```

---

## 🔌 **Endpoints da API**

### **Autenticação**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/users/register` | Registrar novo usuário | ❌ |
| POST | `/api/v1/users/login` | Login (retorna JWT) | ❌ |
| GET | `/api/v1/users/me` | Perfil do usuário | ✅ |
| PUT | `/api/v1/users/me` | Atualizar perfil | ✅ |

### **EDRs**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/v1/edrs` | Listar EDRs | ❌ |
| POST | `/api/v1/edrs` | Criar EDR | ✅ (admin/vendor) |
| GET | `/api/v1/edrs/:id` | Detalhes do EDR | ❌ |
| PUT | `/api/v1/edrs/:id` | Atualizar EDR | ✅ (admin/vendor) |
| PATCH | `/api/v1/edrs/:id/status` | Mudar status | ✅ (admin/vendor) |

### **Deployment Maps**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/deployment-maps` | Criar mapa de deploy | ✅ (admin/vendor) |
| GET | `/api/v1/deployment-maps/edr/:edrId` | Buscar por EDR | ❌ |
| POST | `/api/v1/deployment-maps/:id/validate` | Validar mapa | ✅ (admin/vendor) |

### **Payload Maps (IA)**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/payload-maps/generate` | **Gerar com IA** | ✅ (admin/vendor) |
| POST | `/api/v1/payload-maps` | Criar mapa manualmente | ✅ (admin/vendor) |
| GET | `/api/v1/payload-maps/edr/:edrId` | Buscar por EDR | ❌ |
| POST | `/api/v1/payload-maps/:id/validate` | Validar mapa | ✅ (admin/vendor) |

### **Test Sessions**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/sessions` | Criar sessão de teste | ✅ |
| GET | `/api/v1/sessions` | Listar sessões | ❌ |
| GET | `/api/v1/sessions/:id` | Detalhes da sessão | ❌ |
| POST | `/api/v1/sessions/:id/provision` | Provisionar infra | ✅ |
| POST | `/api/v1/sessions/:id/start` | Iniciar ataques | ✅ |
| GET | `/api/v1/sessions/:id/status` | Status em tempo real | ❌ |
| GET | `/api/v1/sessions/:id/live-scores` | Pontuação ao vivo | ❌ |

### **Logs & Scores**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/logs` | Ingerir log | ✅ |
| POST | `/api/v1/logs/batch` | Ingerir lote de logs | ✅ |
| GET | `/api/v1/scores/session/:sessionId` | Scores da sessão | ✅ |
| GET | `/api/v1/scores/session/:sessionId/summary` | Resumo agregado | ✅ |

### **MITRE Protocols**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/v1/mitre-protocols` | Listar TTPs | ❌ |
| POST | `/api/v1/mitre-protocols` | Criar TTP | ✅ (admin) |
| GET | `/api/v1/mitre-protocols/technique/:id` | Buscar por técnica | ❌ |

---

## 📊 **Modelos de Dados**

### **EDR**
```javascript
{
  name: String,           // "CrowdStrike Falcon"
  vendor: String,         // "CrowdStrike"
  platform: Enum,         // Windows/Linux/MacOS
  status: Enum,           // draft/active/deprecated
  description: String,
  logoUrl: String,
  createdBy: ObjectId
}
```

### **PayloadMap**
```javascript
{
  edrId: ObjectId,
  logFormat: Enum,        // JSON/Syslog/CEF/LEEF
  fieldMapping: {
    timestamp_utc: { jsonpath, type, fallback },
    host_id: { jsonpath, type },
    mitre_technique: { jsonpath, fallback },
    detection_flag: { jsonpath, condition },
    block_flag: { jsonpath, condition },
    severity_level: { jsonpath, mapping }
  },
  logSamples: {
    detectionLog: Object,
    responseLog: Object
  },
  confidenceScore: Number,  // 0.0 - 1.0
  validatedByUser: Boolean,
  generatedByAI: Boolean
}
```

### **TestSession**
```javascript
{
  name: String,
  edrA: {
    edrId: ObjectId,
    vmIp: String,
    currentHP: Number,      // 0-100
    defensePoints: Number
  },
  edrB: { /* same as edrA */ },
  arenaConfig: {
    weightClass: Enum,      // lightweight/standard/heavyweight
    attackProtocols: [String]
  },
  status: Enum,             // pending/running/completed
  result: {
    winner: Enum,           // edrA/edrB/draw
    finalScores: Object
  }
}
```

### **ScoreResult**
```javascript
{
  sessionId: ObjectId,
  edrId: ObjectId,
  attackInfo: {
    mitreProtocol: String,
    expectedDamage: Number
  },
  scoring: {
    detectionPoints: Number,     // 10 pts
    blockPoints: Number,          // 20 pts
    responseTimePoints: Number,   // 0-5 pts
    totalPoints: Number
  },
  damage: {
    dealt: Number,
    received: Number,
    blocked: Boolean
  }
}
```

---

## 🔄 **Fluxo de Integração de EDR**

### **FASE 1: Cadastro de Infraestrutura**
```
POST /api/v1/edrs
  ↓
POST /api/v1/deployment-maps
  - Comandos de instalação
  - Scripts Terraform
  - Variáveis requeridas (CID, TOKEN)
```

### **FASE 2: Mapeamento de Logs com IA**
```
POST /api/v1/payload-maps/generate
  {
    edrId: "...",
    logSamples: {
      detectionLog: { /* exemplo real */ },
      responseLog: { /* exemplo real */ }
    }
  }
  ↓
[IA processa e retorna mapeamento]
  ↓
Usuário revisa na UI
  ↓
POST /api/v1/payload-maps/:id/validate
```

### **FASE 3: Ativação**
```
PATCH /api/v1/edrs/:id/status
  { status: "active" }
  ↓
EDR disponível para competições
```

### **FASE 4: Execução de Teste**
```
POST /api/v1/sessions
  { edrA: {...}, edrB: {...} }
  ↓
POST /api/v1/sessions/:id/provision
  [Terraform cria VMs]
  ↓
POST /api/v1/sessions/:id/start
  [Orquestrador Python executa ataques]
  ↓
POST /api/v1/logs (múltiplas chamadas)
  [Score Engine processa em tempo real]
  ↓
GET /api/v1/sessions/:id/live-scores
  [Dashboard atualiza pontuação]
```

---

## 🛠️ **Desenvolvimento**

### **Estrutura de Pastas**
```
CyberDuel V2/
├── app.js                      # Entry point
├── .env                        # Variáveis de ambiente
├── package.json
├── config/
│   ├── dbConnect.js           # Conexão MongoDB
│   └── index.js               # Config centralizada
└── src/
    ├── controllers/           # Lógica de negócio
    │   ├── edr.controller.js
    │   ├── payloadMap.controller.js
    │   ├── testSession.controller.js
    │   └── ...
    ├── models/                # Schemas Mongoose
    │   ├── EDR.js
    │   ├── PayloadMap.js
    │   ├── TestSession.js
    │   └── index.js
    ├── routes/                # Definição de rotas
    │   ├── edr.routes.js
    │   ├── payloadMap.routes.js
    │   └── index.js
    ├── middlewares/           # Auth, validation, etc
    │   └── auth.middleware.js
    └── services/              # Lógica de serviços
        ├── ai.service.js      # Integração Gemini
        ├── scoreEngine.service.js
        └── orchestration.service.js
```

### **Scripts Disponíveis**
```bash
# Desenvolvimento (hot-reload com nodemon)
npm run dev

# Produção
npm start

# Testes (placeholder)
npm test

# Linting
npm run lint

# Format code
npm run format
```

### **Adicionar Novo Endpoint**

1. **Criar Controller:** `src/controllers/meuController.js`
```javascript
exports.minhaFuncao = async (req, res) => {
  try {
    // Lógica aqui
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

2. **Criar Route:** `src/routes/minhaRoute.js`
```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/meuController');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', authenticate, controller.minhaFuncao);

module.exports = router;
```

3. **Registrar em:** `src/routes/index.js`
```javascript
router.use('/minha-rota', require('./minhaRoute'));
```

---

## 🐛 **Troubleshooting**

### **Erro: MongoDB Connection Failed**
```
❌ Could not connect to any servers in your MongoDB Atlas cluster
```

**Solução:**
1. Verifique se seu IP está no whitelist do MongoDB Atlas
2. Adicione `0.0.0.0/0` para desenvolvimento
3. Aguarde 2 minutos para propagar
4. Verifique se a senha no `.env` está correta

### **Erro: Module Not Found**
```
Error: Cannot find module './routes'
```

**Solução:**
- Verifique se todos os arquivos estão na estrutura correta
- Rode `npm install` novamente
- Verifique imports relativos (`../` corretos)

### **Erro: Invalid Token**
```
401 Unauthorized - Invalid token
```

**Solução:**
- Faça login novamente para obter novo token
- Verifique se o `JWT_SECRET` no `.env` está configurado
- Token expira em 7 dias (padrão)

### **Warnings de Índices Duplicados**
```
Warning: Duplicate schema index on {"email":1}
```

**Solução:**
- Remova `unique: true` dos campos que já têm `schema.index()`
- Ou remova a linha `schema.index()` e mantenha `unique: true`

---

## 🗺️ **Roadmap**

### **v1.0 (MVP) - ✅ Concluído**
- [x] API REST completa
- [x] Sistema de autenticação JWT
- [x] CRUD de EDRs
- [x] Geração de mapas com IA
- [x] Score Engine básico
- [x] Integração MongoDB Atlas

### **v1.1 - Em Desenvolvimento**
- [ ] WebSocket para live scores
- [ ] Dashboard frontend (React)
- [ ] Integração completa com Terraform
- [ ] Testes unitários (Jest)
- [ ] Documentação Swagger/OpenAPI

### **v1.2 - Planejado**
- [ ] Sistema de filas com Bull/Redis
- [ ] Multi-tenancy completo
- [ ] Ranking público de EDRs
- [ ] Relatórios PDF automatizados
- [ ] Integração com CrowdStrike API (real)

### **v2.0 - Futuro**
- [ ] Suporte a XDR (Extended Detection)
- [ ] Machine Learning para detecção de anomalias
- [ ] Marketplace de TTPs customizadas
- [ ] Certificação "CyberDuel Approved"
- [ ] Mobile App (React Native)

---


## 👥 **Contribuindo**

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📞 **Suporte**

- **Documentação:** [docs.cyberduel.com](https://docs.cyberduel.com) (em breve)
- **Issues:** [GitHub Issues](https://github.com/seu-usuario/cyberduel-api/issues)
- **Email:** support@cyberduel.com
- **Discord:** [CyberDuel Community](https://discord.gg/cyberduel)

---

## 🙏 **Agradecimentos**

- [MITRE ATT&CK](https://attack.mitre.org/) - Framework de TTPs
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database
- [Google Gemini](https://ai.google.dev/) - IA para mapeamento
- [Express.js](https://expressjs.com/) - Framework web
- [Mongoose](https://mongoosejs.com/) - ODM

