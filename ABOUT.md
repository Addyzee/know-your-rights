# About Know Your Rights

## Overview

**Know Your Rights** is an AI-powered legal assistant designed to democratize access to labor rights information in Kenya. By combining Retrieval-Augmented Generation (RAG) technology with real-time web search capabilities, the platform provides workers with instant, accurate, and contextually relevant guidance on employment matters—without requiring legal expertise or expensive consultation fees.

---

## The Problem

### Labor Rights Knowledge Gap in Kenya

Despite Kenya's robust legal framework governing employment relations—including the **Employment Act (2007)** and constitutional guarantees under **Article 41 of the Constitution (2010)**—a significant disconnect exists between legal protections on paper and their practical application in the workplace.

#### Challenges We Address

| Challenge | Description |
|-----------|-------------|
| **Legal Complexity** | Labor provisions are scattered across multiple statutes and written in inaccessible legal jargon |
| **Fragmented Information** | Critical rights regarding probation, termination, leave, and unions are spread across disconnected sources |
| **Limited Access** | Government publications lack simplified formats; professional legal consultation is prohibitively expensive |
| **Information Asymmetry** | Workers rely on informal advice from peers or employers, which may be incomplete or biased |
| **Static Knowledge** | Existing resources don't reflect current events like ongoing strikes, court rulings, or policy changes |

#### The Human Impact

- Employees cannot independently verify contract fairness
- Workers are disadvantaged during workplace disputes
- Labor rights violations go unchallenged due to ignorance
- Power imbalances persist between employers and employees
- Exploitation occurs when workers don't know their legal protections

---

## Our Solution

### AI-Powered Legal Assistance

Know Your Rights bridges the knowledge gap through intelligent technology that makes legal information accessible, understandable, and actionable.

### Core Capabilities

#### 1. Intelligent Q&A with RAG
- **Knowledge Base**: Indexes authoritative Kenyan labor documents (Employment Act, Labor Relations Act, CBAs)
- **Semantic Search**: Finds contextually relevant legal passages using vector embeddings
- **Plain-Language Answers**: Translates complex statutes into understandable guidance
- **Full Citations**: Every answer includes source references for verification

#### 2. Agentic Web Search
- **Dynamic Decision-Making**: AI determines when real-time information is needed
- **Current Events Integration**: Automatically retrieves recent news on strikes, court rulings, and policy updates
- **Hybrid Context**: Combines static legal knowledge with live web results

#### 3. Contract Analysis
- **Instant Fairness Review**: Upload employment contracts for automated risk assessment
- **Structured Feedback**: Identifies compliant terms, red flags, and missing clauses
- **Follow-Up Support**: Analyzed documents remain in session for continued questions

#### 4. Labor News Integration
- **Automated Monitoring**: Periodically fetches and indexes labor-related news
- **Relevance Filtering**: Only high-quality, Kenya-focused articles enter the knowledge base
- **Contextual Answers**: Current events inform responses to user queries

---

## Key Features

### For Workers

| Feature | Description |
|---------|-------------|
| **24/7 Availability** | Get answers anytime without waiting for office hours |
| **No Registration Required** | Start chatting immediately with full privacy |
| **Multi-Turn Conversations** | Ask follow-up questions within the same session |
| **Contract Upload** | Drag-and-drop PDFs for instant analysis |
| **Source Transparency** | See exactly where information comes from |
| **Category-Specific Guidance** | Specialized support for unions, health & safety, contracts, and more |

### For Administrators

| Feature | Description |
|---------|-------------|
| **Document Management** | Upload and index legal PDFs with automatic chunking |
| **News Scraper Control** | Configure automated labor news collection |
| **Analytics Dashboard** | Track query trends and usage patterns |
| **Job Monitoring** | View document processing status |

---

## Technical Architecture

### Design Principles

1. **Simplicity Over Complexity**: Single PostgreSQL database with pgvector—no separate vector stores
2. **Privacy First**: Contract uploads are session-scoped, not globally stored
3. **Transparency**: Full source citations with every response
4. **Maintainability**: Monolithic FastAPI backend avoids microservices overhead

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14, React, TailwindCSS, Shadcn/UI |
| **Backend** | FastAPI, Python 3.11+, AsyncIO |
| **AI/ML** | OpenAI GPT-4o, text-embedding-3-small |
| **Database** | PostgreSQL 16 with pgvector extension |
| **Search** | Tavily/Serper APIs for web search |
| **Infrastructure** | Docker Compose orchestration |

### System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                           │
│                    (Next.js Chat Interface)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  RAG Service │  │Agent Service│  │  Contract Analyzer      │  │
│  │  (Embeddings │  │(Search      │  │  (Risk Assessment)      │  │
│  │   + Retrieval)│  │ Decision)   │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐  ┌───────────────┐  ┌─────────────────┐
│   PostgreSQL    │  │  OpenAI API   │  │   Web Search    │
│   + pgvector    │  │  (GPT-4o)     │  │   (Tavily)      │
└─────────────────┘  └───────────────┘  └─────────────────┘
```

---

## Project Objectives

### Primary Goals

1. **Democratize Legal Knowledge**
   - Provide free, 24/7 access to labor rights information
   - Eliminate barriers of cost, geography, and legal jargon
   - Empower workers to make informed decisions independently

2. **Bridge the Information Gap**
   - Consolidate fragmented legal sources into a unified knowledge base
   - Translate complex statutes into plain-language guidance
   - Ensure answers are contextually relevant to Kenyan employment law

3. **Enable Real-Time Awareness**
   - Integrate current events (strikes, policy changes) into legal guidance
   - Provide up-to-date information that static documents cannot offer
   - Keep workers informed about the evolving labor landscape

4. **Promote Workplace Fairness**
   - Help employees identify unfair contract terms before signing
   - Equip workers to challenge rights violations with legal backing
   - Reduce exploitation through increased legal literacy

### Secondary Goals

- **Privacy & Anonymity**: No registration required; session-scoped data
- **Scalability**: Docker-based deployment for easy scaling
- **Extensibility**: Modular architecture supports future features
- **Transparency**: Full audit trails via source citations

---

## Use Cases

### Scenario 1: Contract Review

> **Situation**: A nurse receives an offer letter with a 6-month probation period and vague termination clause.

**How Know Your Rights Helps**:
1. User uploads contract via chat interface
2. AI identifies: *"Probation exceeds standard 3-month period. Termination clause lacks specificity."*
3. Recommendations provided: *"Negotiate reduced probation. Request written disciplinary procedure."*

### Scenario 2: Strike Legality

> **Situation**: A union member asks: *"Is the ongoing doctors' strike legal?"*

**How Know Your Rights Helps**:
1. RAG retrieves Article 41 constitutional protections
2. Agent detects need for current information → triggers web search
3. Combines legal framework with recent news
4. Answer: *"Yes, protected under Article 41(2)(d). Latest: Court declined injunction on [date]."*

### Scenario 3: Termination Dispute

> **Situation**: Worker asks: *"Can I be fired without notice?"*

**How Know Your Rights Helps**:
1. RAG finds Employment Act Section 35 (notice periods)
2. Answer: *"No. Employer must provide notice (1 week for <1 year, 1 month for 1-5 years). Exception: Gross misconduct per Section 44."*
3. Follow-up questions continue within the same session

---

## Target Beneficiaries

| User Group | How They Benefit |
|------------|------------------|
| **Casual/Contract Workers** | Verify rights on termination, overtime, and safety without HR access |
| **Union Members** | Reference CBA clauses during negotiations; understand strike protections |
| **New Employees** | Evaluate offer letters; clarify probation and leave terms |
| **HR Professionals** | Benchmark policies; stay updated on regulatory changes |
| **Legal Aid Organizations** | Triage cases; reduce burden through self-service guidance |

---

## Roadmap

### Current Status (Beta) ✅
- Core RAG pipeline operational
- Agentic web search implemented
- Contract analysis functional
- Admin dashboard for document management
- News scraper for labor updates
- Multi-turn conversation support

### Planned Features 🔜
- **Voice Input**: Speech-to-text for accessibility
- **SMS/USSD Integration**: Access via feature phones
- **Multi-Language Support**: Swahili translations
- **Legal Precedent Database**: Index ELRC court rulings
- **Complaint Templates**: Auto-generate formal grievance letters
- **Union CBA Library**: Comparative analysis across sectors
- **Mobile Apps**: Native iOS/Android clients

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- OpenAI API key
- (Optional) Tavily or Serper API key for web search

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Addyzee/know-your-rights.git
cd know-your-rights

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Launch the platform
docker-compose up --build
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Admin Dashboard**: http://localhost:3000/admin/login

For detailed setup instructions, see [`README.md`](README.md) and [`Architecture.md`](Architecture.md).

---

## Legal Framework References

This platform is built on Kenya's comprehensive labor law framework:

- **The Constitution of Kenya (2010)** - Article 41 on fair labor practices
- **Employment Act, 2007** - Core employment rights and obligations
- **Labor Relations Act, 2007** - Collective bargaining and industrial disputes
- **Occupational Safety and Health Act, 2007** - Workplace safety standards
- **Work Injury Benefits Act, 2007** - Workers' compensation

---

## Contributing

Contributions are welcome in the following areas:

- **Legal Content**: Curate and upload additional statutes, CBAs, policy documents
- **Feature Development**: See GitHub Issues for roadmap tasks
- **Localization**: Translate prompts and UI to Swahili
- **Testing**: Expand E2E test coverage

---

## Disclaimer

> **Important**: This platform provides educational information about labor rights in Kenya and does not constitute legal advice. For binding legal counsel on specific matters, please consult a qualified attorney licensed to practice in Kenya.

---

## License

This project is open-source under the MIT License.

---

## Acknowledgments

- **Legal Framework**: Kenya's Employment Act (2007), Constitution (2010), Labor Relations Act (2007)
- **AI Technology**: OpenAI GPT-4o and text-embedding-3-small
- **Search Integration**: Tavily/Serper APIs
- **UI Components**: Shadcn/UI and TailwindCSS

---

*Know Your Rights — Empowering Kenyan workers with accessible legal knowledge.*
