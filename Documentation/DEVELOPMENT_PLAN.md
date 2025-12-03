# Creative Ad Generation Orchestrator - Development Plan

**Project:** Creative Digital Advertisement Generation Orchestrator  
**Lead Architect:** Douglas Davis  
**Organization:** East Texas Business Services  
**Repository:** https://github.com/ETXSVC/Ad-Orchestrator  
**Created:** December 2024  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technical Architecture Summary](#2-technical-architecture-summary)
3. [Development Phases](#3-development-phases)
4. [Phase 1: Foundation & Infrastructure](#4-phase-1-foundation--infrastructure)
5. [Phase 2: Core Backend Development](#5-phase-2-core-backend-development)
6. [Phase 3: AI Integration & Orchestration](#6-phase-3-ai-integration--orchestration)
7. [Phase 4: Frontend Development](#7-phase-4-frontend-development)
8. [Phase 5: Testing & Quality Assurance](#8-phase-5-testing--quality-assurance)
9. [Phase 6: Deployment & DevOps](#9-phase-6-deployment--devops)
10. [Phase 7: Documentation & Launch](#10-phase-7-documentation--launch)
11. [Project Structure](#11-project-structure)
12. [Technology Stack](#12-technology-stack)
13. [Risk Assessment & Mitigation](#13-risk-assessment--mitigation)
14. [Timeline & Milestones](#14-timeline--milestones)
15. [Success Criteria](#15-success-criteria)

---

## 1. Project Overview

### 1.1 Vision

Transform a monolithic digital advertisement creation script into a scalable, secure, cloud-native microservice architecture that leverages AI to generate high-quality, brand-compliant advertising content with mandatory human oversight.

### 1.2 Core Functionality

The system performs a **dual-modality generative process**:

1. **Text-to-Image Generation** - Transforms descriptive prompts into unique visual advertisement images
2. **Structured Text Generation** - Creates compelling copy (Title, Description, 15 SEO Keywords) aligned with the generated image
3. **Human-in-the-Loop Approval** - Mandatory review before deployment
4. **Asset Management** - Secure storage with complete auditability

### 1.3 Key Workflow

```
Generate → Approve → Commit

POST /generate     →  Creates ad_id, generates image & text, stores in temp cache
Human Review       →  User reviews generated content
POST /commit/{id}  →  Permanent storage, status update to APPROVED
```

---

## 2. Technical Architecture Summary

### 2.1 Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Interface                       │
│          (React/Next.js - Data Capture & Approval UI)        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│        (Orchestration, Validation, State Management)         │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
    │  Cloud SQL   │ │     GCS     │ │  Gemini API  │
    │ (PostgreSQL) │ │  (Storage)  │ │    (AI)      │
    └──────────────┘ └─────────────┘ └──────────────┘
```

### 2.2 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Reliability** | Pydantic models + JSON Schema for 17-field validation |
| **Security** | API Key auth (public) + ADC (internal services) |
| **Immutability** | UUID-based naming, fixed storage paths |

---

## 3. Development Phases

| Phase | Focus | Duration | Priority |
|-------|-------|----------|----------|
| 1 | Foundation & Infrastructure | 1 week | Critical |
| 2 | Core Backend Development | 2 weeks | Critical |
| 3 | AI Integration & Orchestration | 1.5 weeks | Critical |
| 4 | Frontend Development | 2 weeks | High |
| 5 | Testing & Quality Assurance | 1.5 weeks | High |
| 6 | Deployment & DevOps | 1 week | High |
| 7 | Documentation & Launch | 0.5 weeks | Medium |

**Total Estimated Duration: 9-10 weeks**

---

## 4. Phase 1: Foundation & Infrastructure

### 4.1 Objectives

- Set up development environment
- Configure Google Cloud project and services
- Establish project structure and CI/CD foundation

### 4.2 Tasks

#### 4.2.1 Development Environment Setup

- [ ] Initialize Git repository with branching strategy (main, develop, feature/*)
- [ ] Create Python virtual environment (Python 3.11+)
- [ ] Set up pre-commit hooks (black, flake8, mypy)
- [ ] Configure VS Code / IDE settings
- [ ] Create `.env.example` template

#### 4.2.2 Google Cloud Project Configuration

- [ ] Create/configure GCP project
- [ ] Enable required APIs:
  - Cloud SQL Admin API
  - Cloud Storage API
  - Generative Language API (Gemini)
  - Cloud Run API
  - Cloud Build API
- [ ] Create service accounts with appropriate IAM roles
- [ ] Set up Application Default Credentials (ADC)

#### 4.2.3 Cloud SQL Setup

- [ ] Create Cloud SQL PostgreSQL instance (PostgreSQL 15+)
- [ ] Configure networking (VPC, private IP)
- [ ] Create database user and roles
- [ ] Set up Cloud SQL Proxy for local development

#### 4.2.4 Google Cloud Storage Setup

- [ ] Create `ad-creatives-temp` bucket (7-day TTL lifecycle policy)
- [ ] Create `ad-creatives-approved` bucket (production)
- [ ] Configure bucket permissions and IAM
- [ ] Set up CORS configuration

#### 4.2.5 Project Structure Creation

```
Ad-Orchestrator/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── api/
│   │   ├── services/
│   │   ├── db/
│   │   └── utils/
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── infrastructure/
│   ├── terraform/
│   └── kubernetes/
├── docs/
├── scripts/
├── .github/workflows/
├── docker-compose.yml
├── README.md
└── DEVELOPMENT_PLAN.md
```

### 4.3 Deliverables

- [ ] Fully configured GCP project with all services enabled
- [ ] Local development environment with Cloud SQL Proxy
- [ ] Project scaffold with directory structure
- [ ] CI/CD pipeline skeleton (GitHub Actions)

### 4.4 Acceptance Criteria

- Can connect to Cloud SQL from local environment
- Can upload/download from GCS buckets
- Pre-commit hooks passing
- Basic CI pipeline runs on push

---

## 5. Phase 2: Core Backend Development

### 5.1 Objectives

- Implement FastAPI application structure
- Create database schema and models
- Build authentication and security layer
- Implement core API endpoints

### 5.2 Tasks

#### 5.2.1 Database Schema Implementation

- [ ] Create SQLAlchemy models for `ad_creative_metadata` table
- [ ] Implement all 17 required fields:
  - `ad_id` (UUID, Primary Key)
  - `campaign_name`, `client_name`, `target_audience`, `brand_voice`
  - `visual_description`
  - `title`, `description`
  - `keyword_1` through `keyword_15`
  - `image_storage_path`, `temp_image_path`
  - `status` (PENDING, APPROVED, REJECTED)
  - `generation_timestamp`, `approval_timestamp`, `approved_by`
  - `design_hex_codes`, `aspect_ratio`
- [ ] Create Alembic migration scripts
- [ ] Add database indexes for performance

```sql
-- Key indexes
CREATE INDEX idx_status ON ad_creative_metadata(status);
CREATE INDEX idx_campaign ON ad_creative_metadata(campaign_name);
CREATE INDEX idx_generation_time ON ad_creative_metadata(generation_timestamp DESC);
```

#### 5.2.2 Pydantic Schema Definitions

- [ ] Create `AdGenerationRequest` input model
- [ ] Create `SocialMediaContent` output model (with 15 keyword fields)
- [ ] Create `AdResponse` and `CommitResponse` models
- [ ] Implement validation constraints:
  - Title: max 150 characters
  - Description: required text
  - Keywords: exactly 15, max 50 characters each

```python
# Example schema structure
class SocialMediaContent(BaseModel):
    title: str = Field(..., max_length=150)
    description: str
    keyword_1: str = Field(..., max_length=50)
    # ... through keyword_15
```

#### 5.2.3 Authentication Implementation

- [ ] Implement API Key authentication middleware
- [ ] Create secure API key validation
- [ ] Set up rate limiting (optional)
- [ ] Configure CORS properly

```python
# Security implementation
api_key_header = APIKeyHeader(name="X-API-Key")

async def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key != settings.API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key
```

#### 5.2.4 Core API Endpoints

- [ ] `POST /api/v1/generate` - Initiate ad generation
- [ ] `POST /api/v1/commit/{ad_id}` - Commit approved ad
- [ ] `GET /api/v1/ads/{ad_id}` - Get ad details
- [ ] `GET /api/v1/ads` - List ads (with filtering)
- [ ] `POST /api/v1/reject/{ad_id}` - Reject ad
- [ ] `GET /health` - Health check endpoint

#### 5.2.5 Database Connection & Repository Pattern

- [ ] Implement database connection pool
- [ ] Create repository classes for data access
- [ ] Implement async database operations
- [ ] Add connection retry logic

### 5.3 Deliverables

- [ ] Complete database schema with migrations
- [ ] All Pydantic models and validation
- [ ] API endpoints (without AI integration)
- [ ] Authentication system
- [ ] Unit tests for models and endpoints

### 5.4 Acceptance Criteria

- All endpoints return proper responses (mocked AI)
- Database CRUD operations working
- API key authentication enforced
- Pydantic validation working for all 17 fields
- 80%+ test coverage for backend core

---

## 6. Phase 3: AI Integration & Orchestration

### 6.1 Objectives

- Integrate Gemini API for image and text generation
- Implement sequential dual-modality pipeline
- Handle structured output validation
- Implement retry logic and error handling

### 6.2 Tasks

#### 6.2.1 Gemini Client Setup

- [ ] Initialize Google Gen AI client with ADC
- [ ] Configure model selection (`gemini-2.5-flash`)
- [ ] Set up error handling and timeouts
- [ ] Implement connection pooling/reuse

```python
from google import genai

client = genai.Client()
model = "gemini-2.5-flash"
```

#### 6.2.2 Image Generation (Step 1)

- [ ] Create image generation prompt builder
- [ ] Implement text-to-image generation call
- [ ] Handle image byte response
- [ ] Store generated image in temp storage
- [ ] Implement retry logic for failures

```python
async def generate_image(prompt: str, design_specs: dict) -> bytes:
    response = await client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=enhanced_prompt,
        config={"response_modalities": ["IMAGE"]}
    )
    return response.generated_image.image.image_bytes
```

#### 6.2.3 Structured Text Generation (Step 2)

- [ ] Create text generation prompt with image context
- [ ] Implement JSON Schema enforcement
- [ ] Parse and validate Gemini response
- [ ] Map to Pydantic model

```python
async def generate_structured_content(
    image_bytes: bytes, 
    context: dict
) -> SocialMediaContent:
    response = await client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=[image_part, text_prompt],
        config={
            "response_mime_type": "application/json",
            "response_schema": SocialMediaContent.model_json_schema()
        }
    )
    return SocialMediaContent.model_validate_json(response.text)
```

#### 6.2.4 Orchestration Service

- [ ] Create `AdGenerationService` class
- [ ] Implement full generation pipeline
- [ ] Handle state transitions (PENDING → APPROVED/REJECTED)
- [ ] Implement atomic commit logic
- [ ] Add comprehensive logging

#### 6.2.5 Error Handling & Retry Logic

- [ ] Implement exponential backoff for API calls
- [ ] Handle validation failures (keyword count mismatch)
- [ ] Create custom exceptions
- [ ] Add circuit breaker pattern (optional)

```python
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(GeminiAPIError)
)
async def generate_with_retry(prompt: str) -> Content:
    # Implementation
```

### 6.3 Deliverables

- [ ] Working image generation pipeline
- [ ] Working structured text generation
- [ ] Validation of 17-field output
- [ ] Complete orchestration service
- [ ] Integration tests

### 6.4 Acceptance Criteria

- Can generate image from text prompt
- Generated text contains exactly 15 keywords
- All fields pass Pydantic validation
- Retry logic handles transient failures
- End-to-end generation completes in <60 seconds

---

## 7. Phase 4: Frontend Development

### 7.1 Objectives

- Build user interface for ad creation workflow
- Implement human review and approval flow
- Create responsive, accessible design
- Handle async polling for generation status

### 7.2 Tasks

#### 7.2.1 Project Setup

- [ ] Initialize Next.js/React project
- [ ] Configure TypeScript
- [ ] Set up Tailwind CSS
- [ ] Configure API client (axios/fetch)
- [ ] Set up state management (React Query/Zustand)

#### 7.2.2 Core Pages/Views

- [ ] **Dashboard** - Overview of all ads
- [ ] **Create Ad** - Form for new ad generation
- [ ] **Review Ad** - Display generated content for approval
- [ ] **Ad Details** - View approved ad details
- [ ] **Settings** - Configuration options

#### 7.2.3 Ad Creation Form

- [ ] Campaign overview fields
- [ ] Visual description input (rich text)
- [ ] Design specifications:
  - Color picker (hex codes)
  - Aspect ratio selector
- [ ] Target audience input
- [ ] Brand voice selector
- [ ] Form validation (client-side)

#### 7.2.4 Generation Status & Polling

- [ ] Implement polling mechanism for generation status
- [ ] Show loading states with progress indicators
- [ ] Handle timeout scenarios
- [ ] Display error messages gracefully

```typescript
const useAdGeneration = (adId: string) => {
  return useQuery({
    queryKey: ['ad', adId],
    queryFn: () => fetchAd(adId),
    refetchInterval: (data) => 
      data?.status === 'PENDING' ? 2000 : false,
  });
};
```

#### 7.2.5 Review & Approval Interface

- [ ] Display generated image (full size preview)
- [ ] Show structured content (title, description)
- [ ] Display all 15 keywords
- [ ] Approve/Reject buttons
- [ ] Confirmation modals

#### 7.2.6 UI/UX Polish

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Dark mode support (optional)

### 7.3 Deliverables

- [ ] Complete frontend application
- [ ] All pages functional and styled
- [ ] API integration working
- [ ] Responsive across devices
- [ ] Component tests

### 7.4 Acceptance Criteria

- User can complete full create → review → approve flow
- Generated content displays correctly
- Approval updates status to APPROVED
- UI is responsive and accessible
- No console errors in production build

---

## 8. Phase 5: Testing & Quality Assurance

### 8.1 Objectives

- Achieve comprehensive test coverage
- Perform integration and E2E testing
- Conduct security review
- Performance testing

### 8.2 Tasks

#### 8.2.1 Backend Testing

- [ ] Unit tests for all services
- [ ] Unit tests for API endpoints
- [ ] Database integration tests
- [ ] Gemini API mock tests
- [ ] GCS integration tests

```bash
# Target coverage
pytest --cov=app --cov-report=html
# Aim for 85%+ coverage
```

#### 8.2.2 Frontend Testing

- [ ] Component unit tests (Jest/Vitest)
- [ ] Integration tests (React Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Accessibility tests (axe-core)

#### 8.2.3 Integration Testing

- [ ] Full pipeline tests (generate → approve → commit)
- [ ] API contract tests
- [ ] Database transaction tests
- [ ] Error scenario tests

#### 8.2.4 Security Testing

- [ ] API key validation tests
- [ ] Input sanitization tests
- [ ] SQL injection prevention
- [ ] XSS prevention (frontend)
- [ ] Rate limiting tests

#### 8.2.5 Performance Testing

- [ ] Load testing with Locust/k6
- [ ] Database query performance
- [ ] Image generation latency benchmarks
- [ ] Memory leak detection

### 8.3 Deliverables

- [ ] Test suites for backend and frontend
- [ ] Coverage reports
- [ ] Performance benchmarks
- [ ] Security audit report

### 8.4 Acceptance Criteria

- Backend: 85%+ code coverage
- Frontend: 80%+ code coverage
- All E2E tests passing
- No critical security vulnerabilities
- API response time <500ms (excluding AI calls)

---

## 9. Phase 6: Deployment & DevOps

### 9.1 Objectives

- Set up production infrastructure
- Configure CI/CD pipelines
- Implement monitoring and alerting
- Document deployment procedures

### 9.2 Tasks

#### 9.2.1 Docker Configuration

- [ ] Create optimized Dockerfile for backend
- [ ] Create Dockerfile for frontend
- [ ] Create docker-compose for local development
- [ ] Multi-stage builds for smaller images

```dockerfile
# Example multi-stage build
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.11-slim
COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/*
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 9.2.2 CI/CD Pipeline (GitHub Actions)

- [ ] Lint and format check
- [ ] Run tests on PR
- [ ] Build Docker images
- [ ] Push to Google Container Registry
- [ ] Deploy to Cloud Run (staging)
- [ ] Deploy to Cloud Run (production)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main, develop]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: pytest
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v2
```

#### 9.2.3 Cloud Run Deployment

- [ ] Configure Cloud Run services (backend, frontend)
- [ ] Set up Cloud SQL connection
- [ ] Configure environment variables/secrets
- [ ] Set up custom domain
- [ ] Configure autoscaling

#### 9.2.4 Monitoring & Observability

- [ ] Set up Cloud Monitoring dashboards
- [ ] Configure alerting policies
- [ ] Implement structured logging (Cloud Logging)
- [ ] Set up error tracking (optional: Sentry)
- [ ] Create runbooks for common issues

#### 9.2.5 Infrastructure as Code (Optional)

- [ ] Terraform modules for GCP resources
- [ ] Version control infrastructure
- [ ] Environment separation (dev, staging, prod)

### 9.3 Deliverables

- [ ] Production deployment on Cloud Run
- [ ] CI/CD pipeline fully operational
- [ ] Monitoring dashboards
- [ ] Deployment documentation

### 9.4 Acceptance Criteria

- Automated deployment on merge to main
- Zero-downtime deployments
- Monitoring alerts configured
- Rollback procedure documented and tested
- SSL/TLS configured

---

## 10. Phase 7: Documentation & Launch

### 10.1 Objectives

- Complete all documentation
- Prepare for production launch
- Create user guides
- Establish support procedures

### 10.2 Tasks

#### 10.2.1 Technical Documentation

- [ ] API documentation (OpenAPI/Swagger)
- [ ] Architecture decision records (ADRs)
- [ ] Database schema documentation
- [ ] Deployment guide
- [ ] Troubleshooting guide

#### 10.2.2 User Documentation

- [ ] User guide for ad creation workflow
- [ ] Quick start guide
- [ ] FAQ document
- [ ] Video tutorials (optional)

#### 10.2.3 Launch Preparation

- [ ] Production environment verification
- [ ] Load testing at expected scale
- [ ] Backup and recovery test
- [ ] Security final review
- [ ] Stakeholder sign-off

#### 10.2.4 Post-Launch

- [ ] Monitor production metrics
- [ ] Gather user feedback
- [ ] Create improvement backlog
- [ ] Plan v1.1 enhancements

### 10.3 Deliverables

- [ ] Complete documentation suite
- [ ] Production system live
- [ ] Support procedures established
- [ ] Launch announcement

### 10.4 Acceptance Criteria

- All documentation reviewed and published
- Production system stable for 48 hours
- No critical issues post-launch
- User feedback collection active

---

## 11. Project Structure

```
Ad-Orchestrator/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application entry
│   │   ├── config.py               # Configuration management
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── ad_creative.py      # SQLAlchemy models
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── request.py          # Input Pydantic models
│   │   │   └── response.py         # Output Pydantic models
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py             # Dependencies (auth, db)
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── router.py       # API router
│   │   │       └── endpoints/
│   │   │           ├── ads.py      # Ad endpoints
│   │   │           └── health.py   # Health check
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── ad_generation.py    # Generation orchestration
│   │   │   ├── gemini_client.py    # Gemini API wrapper
│   │   │   └── storage.py          # GCS operations
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── session.py          # Database session
│   │   │   └── repository.py       # Data access layer
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── logging.py          # Logging configuration
│   ├── alembic/
│   │   ├── versions/
│   │   └── env.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_api/
│   │   ├── test_services/
│   │   └── test_models/
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── Dockerfile
│   ├── alembic.ini
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js app router
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   ├── public/
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── infrastructure/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── modules/
│   └── kubernetes/                 # Optional K8s configs
├── docs/
│   ├── api/
│   ├── architecture/
│   └── user-guide/
├── scripts/
│   ├── setup-dev.sh
│   ├── run-migrations.sh
│   └── deploy.sh
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docker-compose.yml
├── docker-compose.dev.yml
├── .gitignore
├── .pre-commit-config.yaml
├── README.md
├── DEVELOPMENT_PLAN.md
└── CHANGELOG.md
```

---

## 12. Technology Stack

### 12.1 Backend

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | FastAPI | 0.109+ |
| Language | Python | 3.11+ |
| ORM | SQLAlchemy | 2.0+ |
| Validation | Pydantic | 2.5+ |
| Migrations | Alembic | 1.13+ |
| ASGI Server | Uvicorn | 0.27+ |
| AI Client | google-genai | 0.3+ |
| GCS Client | google-cloud-storage | 2.14+ |

### 12.2 Frontend

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 14+ |
| Language | TypeScript | 5.0+ |
| Styling | Tailwind CSS | 3.4+ |
| State | React Query | 5.0+ |
| Components | shadcn/ui | latest |

### 12.3 Infrastructure

| Component | Technology |
|-----------|------------|
| Database | Cloud SQL (PostgreSQL 15) |
| Storage | Google Cloud Storage |
| AI | Gemini API (gemini-2.5-flash) |
| Compute | Cloud Run |
| CI/CD | GitHub Actions |
| Containers | Docker |

---

## 13. Risk Assessment & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Gemini API rate limits | High | Medium | Implement queuing, retry logic, caching |
| Keyword count mismatch from AI | Medium | High | Strict validation, retry with adjusted prompts |
| Database connection issues | High | Low | Connection pooling, Cloud SQL Proxy, health checks |
| GCS upload failures | High | Low | Retry logic, temporary local cache, atomic transactions |
| Security breach | Critical | Low | API key rotation, ADC, regular audits, input validation |
| Cost overruns | Medium | Medium | Monitoring, quotas, budget alerts |
| Scope creep | Medium | High | Strict phase gates, clear requirements |

---

## 14. Timeline & Milestones

```
Week 1         Week 2         Week 3         Week 4         Week 5
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│   Phase 1    │         Phase 2              │    Phase 3   │
│ Foundation   │     Backend Development      │    AI Int.   │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

Week 6         Week 7         Week 8         Week 9         Week 10
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│         Phase 4              │    Phase 5   │   Phase 6    │  Phase 7    │
│    Frontend Development      │    Testing   │   DevOps     │  Launch     │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### Key Milestones

| Milestone | Target Date | Deliverable |
|-----------|-------------|-------------|
| M1: Infrastructure Ready | Week 1 | GCP configured, project scaffold |
| M2: Backend MVP | Week 3 | API endpoints working (mocked AI) |
| M3: AI Pipeline Complete | Week 4.5 | Full generation working |
| M4: Frontend MVP | Week 7 | Complete UI workflow |
| M5: QA Complete | Week 8.5 | All tests passing, security reviewed |
| M6: Production Launch | Week 10 | Live system |

---

## 15. Success Criteria

### 15.1 Functional Requirements

- [ ] Generate unique advertisement images from text prompts
- [ ] Produce structured content with exactly 17 validated fields
- [ ] Human approval workflow fully functional
- [ ] Atomic commit with permanent storage
- [ ] Complete audit trail for all operations

### 15.2 Non-Functional Requirements

- [ ] API response time <500ms (excluding AI generation)
- [ ] AI generation completes in <60 seconds
- [ ] 99.5% uptime for production system
- [ ] Support 100 concurrent users
- [ ] 85%+ test coverage

### 15.3 Quality Metrics

- [ ] Zero critical security vulnerabilities
- [ ] All Pydantic validations enforced
- [ ] Database referential integrity maintained
- [ ] UUID-based naming implemented for all assets

---

## Appendix A: Environment Variables

```env
# API Configuration
API_KEY=your-secure-api-key
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=false

# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GCS_BUCKET_TEMP=ad-creatives-temp
GCS_BUCKET_APPROVED=ad-creatives-approved

# Database
DATABASE_URL=postgresql://user:pass@host:5432/ad_generation
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20

# Gemini API
GEMINI_MODEL=gemini-2.5-flash

# Security
JWT_SECRET_KEY=your-jwt-secret
CORS_ORIGINS=["http://localhost:3000"]
```

---

## Appendix B: Quick Reference Commands

```bash
# Backend Development
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload

# Run Tests
pytest --cov=app --cov-report=html

# Database Migrations
alembic upgrade head
alembic revision --autogenerate -m "Description"

# Docker
docker-compose up -d
docker-compose logs -f backend

# Frontend Development
cd frontend
npm install
npm run dev

# Deploy
gcloud run deploy ad-orchestrator-api --source .
```

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Next Review:** After Phase 1 completion
