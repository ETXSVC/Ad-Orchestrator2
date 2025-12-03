# Ad Orchestrator - Technical Specification

## Application Architecture

### Technology Stack

#### Frontend
```
Framework: React 18.3.1
Build Tool: Vite
Language: JavaScript (ES6+)
Package Manager: npm/yarn
Deployment: Rocket.new Platform
```

#### Core Dependencies
- **React** 18.3.1 - UI framework
- **React Router** - Client-side routing
- **Lucide React** 0.263.1 - Icon library
- **Recharts** - Data visualization
- **Three.js** (r128) - 3D graphics (limited usage)
- **D3.js** - Data manipulation
- **Plotly** - Advanced charting
- **Math.js** - Mathematical operations
- **Lodash** - Utility functions
- **Chart.js** - Charting library
- **Tone.js** - Audio synthesis
- **PapaParse** - CSV parsing
- **SheetJS** - Excel file processing
- **Mammoth** - DOCX file processing
- **TensorFlow.js** - Machine learning capabilities

---

## Application Entry Point

### HTML Structure
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>ad-orchestrator</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#000000" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Rocket.new Platform Scripts -->
  <script type="module" async 
    src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fadorchest6935back.builtwithrocket.new&_be=https%3A%2F%2Fapplication.rocket.new&_v=0.1.10">
  </script>
  <script type="module" defer 
    src="https://static.rocket.new/rocket-shot.js?v=0.0.1">
  </script>
  
  <!-- Application Bundle -->
  <script type="module" crossorigin 
    src="/assets/index-CxQDLzVs.js">
  </script>
  <link rel="stylesheet" crossorigin 
    href="/assets/index-Brqi2ZYS.css">
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div class="dhiwise-code" id="root"></div>
</body>
</html>
```

---

## Backend Infrastructure

### API Configuration
```
Backend URL: https://adorchest6935back.builtwithrocket.new
Platform API: https://application.rocket.new
```

### API Endpoints (Inferred)

#### Authentication
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/session
```

#### Campaigns
```
GET    /api/campaigns
POST   /api/campaigns
GET    /api/campaigns/:id
PUT    /api/campaigns/:id
DELETE /api/campaigns/:id
PATCH  /api/campaigns/:id/archive
GET    /api/campaigns/templates
```

#### Assets
```
GET    /api/assets
POST   /api/assets/upload
GET    /api/assets/:id
PUT    /api/assets/:id
DELETE /api/assets/:id
POST   /api/assets/:id/approve
POST   /api/assets/:id/reject
POST   /api/assets/:id/share
GET    /api/assets/:id/download
POST   /api/assets/bulk-action
```

#### AI Generation
```
POST   /api/ai/generate
POST   /api/ai/generate/image
POST   /api/ai/generate/text
GET    /api/ai/models
POST   /api/ai/configure
GET    /api/ai/performance
```

#### Approvals
```
GET    /api/approvals/queue
POST   /api/approvals/:id/approve
POST   /api/approvals/:id/reject
GET    /api/approvals/:id
PUT    /api/approvals/workflow
POST   /api/approvals/bulk-approve
GET    /api/approvals/history
```

#### Users
```
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
PATCH  /api/users/:id/activate
PATCH  /api/users/:id/deactivate
GET    /api/users/:id/activity
```

#### Integrations
```
GET    /api/integrations
POST   /api/integrations/:type/connect
DELETE /api/integrations/:type/disconnect
POST   /api/integrations/:type/sync
GET    /api/integrations/:type/status
```

#### Analytics
```
GET    /api/analytics/campaigns
GET    /api/analytics/performance
GET    /api/analytics/users
GET    /api/analytics/ai-usage
GET    /api/analytics/system-health
```

#### System Configuration
```
GET    /api/config
PUT    /api/config
GET    /api/config/ai-settings
PUT    /api/config/ai-settings
GET    /api/audit-log
```

---

## Component Architecture

### Core Application Components

```
App (Root)
├── Router
│   ├── Dashboard
│   ├── Campaigns
│   │   ├── CampaignList
│   │   ├── CampaignDetails
│   │   ├── CreateCampaign
│   │   └── CampaignFilters
│   ├── Assets
│   │   ├── AssetLibrary
│   │   ├── AssetUpload
│   │   └── AssetDetails
│   ├── AI Workspace
│   │   ├── AIAdGenerationWorkspace
│   │   ├── ModelSelector
│   │   └── GenerationControls
│   ├── Approvals
│   │   ├── ApprovalQueueManagement
│   │   ├── ApprovalCard
│   │   └── WorkflowConfiguration
│   ├── Users
│   │   ├── UserList
│   │   ├── UserDetails
│   │   └── RoleManagement
│   ├── Integrations
│   │   ├── IntegrationList
│   │   └── IntegrationConfig
│   ├── Analytics
│   │   ├── Dashboard
│   │   └── Reports
│   └── Settings
│       ├── SystemConfigurationSettings
│       ├── AISettings
│       └── NotificationSettings
└── Shared Components
    ├── Navigation
    ├── Breadcrumb
    ├── BulkActionToolbar
    ├── Modals
    ├── Forms
    └── UI Elements
```

---

## Data Models

### Campaign Model
```typescript
interface Campaign {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'paused' | 'completed' | 'archived';
  client: Client;
  department: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  template?: Template;
  targetAudience: string[];
  brandVoice: string;
  channels: string[];
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  assets: Asset[];
  performance: CampaignMetrics;
}
```

### Asset Model
```typescript
interface Asset {
  id: string;
  type: 'image' | 'video' | 'graphic' | 'template';
  filename: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  metadata: {
    title?: string;
    description?: string;
    keywords?: string[];
    seoTags?: string[];
  };
  uploadedBy: User;
  uploadedAt: Date;
  status: 'uploaded' | 'processing' | 'approved' | 'rejected';
  campaign?: Campaign;
  approvalStatus?: ApprovalStatus;
  versions: AssetVersion[];
}
```

### Approval Model
```typescript
interface Approval {
  id: string;
  asset: Asset;
  campaign: Campaign;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  workflow: WorkflowConfig;
  currentStep: number;
  approvers: Approver[];
  submittedBy: User;
  submittedAt: Date;
  slaDeadline?: Date;
  completedAt?: Date;
  history: ApprovalHistory[];
}

interface Approver {
  user: User;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: Date;
  comments?: string;
  rejectionReason?: string;
}
```

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department: string;
  permissions: Permission[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  avatar?: string;
  sessions: Session[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  scope: 'global' | 'department' | 'client';
}
```

### AI Generation Model
```typescript
interface AIGenerationRequest {
  model: 'claude' | 'gpt4' | 'stable-diffusion' | 'dalle';
  type: 'text' | 'image';
  prompt: string;
  parameters: {
    temperature?: number;
    maxTokens?: number;
    creativity?: number;
    style?: string;
    aspectRatio?: string;
  };
  brandVoice?: string;
  targetAudience?: string;
  seoKeywords?: string[];
  moderationEnabled: boolean;
}

interface AIGenerationResponse {
  id: string;
  result: string | ImageData;
  metadata: {
    model: string;
    tokensUsed?: number;
    generationTime: number;
    cost?: number;
  };
  quality: number;
  approved: boolean;
}
```

### Integration Model
```typescript
interface Integration {
  id: string;
  type: 'google_ads' | 'facebook' | 'salesforce' | 'slack' | string;
  name: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  config: {
    apiKey?: string;
    apiEndpoint?: string;
    syncFrequency?: string;
    credentials?: any;
  };
  lastSync?: Date;
  health: {
    uptime: number;
    errorRate: number;
    lastError?: string;
  };
}
```

---

## State Management

### Context Providers
```javascript
// Global State Contexts
- AuthContext
- CampaignContext
- AssetContext
- ApprovalContext
- IntegrationContext
- NotificationContext
- ThemeContext
- UserContext
```

### State Structure (Example)
```javascript
const AppState = {
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    permissions: Permission[]
  },
  campaigns: {
    list: Campaign[],
    current: Campaign | null,
    filters: FilterState,
    loading: boolean,
    error: Error | null
  },
  assets: {
    library: Asset[],
    selected: Asset[],
    uploadProgress: UploadProgress[],
    filters: FilterState
  },
  approvals: {
    queue: Approval[],
    stats: ApprovalStats,
    workflow: WorkflowConfig
  },
  ui: {
    sidebarOpen: boolean,
    theme: 'light' | 'dark',
    notifications: Notification[],
    modal: ModalState | null
  }
}
```

---

## Routing Structure

### Route Configuration
```javascript
const routes = [
  { path: '/', component: Dashboard },
  { path: '/campaigns', component: CampaignList },
  { path: '/campaigns/:id', component: CampaignDetails },
  { path: '/campaigns/new', component: CreateCampaign },
  { path: '/assets', component: AssetLibrary },
  { path: '/assets/:id', component: AssetDetails },
  { path: '/ai-workspace', component: AIAdGenerationWorkspace },
  { path: '/approvals', component: ApprovalQueue },
  { path: '/approvals/:id', component: ApprovalDetails },
  { path: '/users', component: UserManagement },
  { path: '/users/:id', component: UserDetails },
  { path: '/integrations', component: Integrations },
  { path: '/analytics', component: Analytics },
  { path: '/settings', component: Settings },
  { path: '/settings/ai', component: AISettings },
  { path: '/settings/workflow', component: WorkflowSettings }
]
```

---

## Image Assets

### Sample Image URLs Found in Codebase
```
https://images.unsplash.com/photo-1513452365596-d2ecf639fc00
https://images.unsplash.com/photo-1593501543078-eca8c9e55c16
https://images.unsplash.com/photo-1712455766146-2a0bd7a12fa3
https://images.unsplash.com/photo-1729984350841-74cbea1e094a
https://images.unsplash.com/photo-1718957647056-ed8c94eca015
https://images.unsplash.com/photo-1668026559613-9c42b38f11a9
https://images.unsplash.com/photo-1669130183473-3a4c8524082f
https://images.unsplash.com/photo-1659631224008-d297b6cdda38

https://img.rocket.new/generatedImages/rocket_gen_img_*.png
```

---

## Security Implementation

### Authentication
- JWT-based authentication
- Secure session management
- Password hashing (bcrypt inferred)
- Two-factor authentication support
- Session timeout configuration

### Authorization
- Role-based access control (RBAC)
- Permission-level granularity
- Resource-level permissions
- Department-scoped access
- Client-scoped access

### API Security
- API key authentication
- Rate limiting
- Request throttling
- CORS configuration
- Input validation
- Output sanitization

### Data Protection
- Encryption at rest
- Encryption in transit (HTTPS)
- Secure credential storage
- Audit logging
- Data retention policies

---

## Performance Optimization

### Frontend Optimization
- Code splitting (Vite)
- Lazy loading components
- Image optimization and compression
- Caching strategies
- Aggressive caching option
- Asset CDN delivery
- Minification and bundling

### Backend Optimization
- API response caching
- Database query optimization
- Connection pooling
- Background job processing
- Rate limiting
- Load balancing

---

## Notification System

### Notification Types
```typescript
type NotificationType = 
  | 'sla_warning'
  | 'approval_pending'
  | 'approval_approved'
  | 'approval_rejected'
  | 'campaign_status'
  | 'asset_uploaded'
  | 'integration_error'
  | 'system_alert'
  | 'performance_alert';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  user: User;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}
```

### Delivery Channels
- In-app notifications (real-time)
- Email notifications
- Slack integration
- Push notifications (mobile)
- SMS (optional)

---

## Error Handling

### Error Types
```typescript
class APIError extends Error {
  statusCode: number;
  code: string;
  details?: any;
}

class ValidationError extends Error {
  field: string;
  validationRules: string[];
}

class AuthenticationError extends Error {
  requiresReauth: boolean;
}

class PermissionError extends Error {
  requiredPermission: Permission;
}
```

### Error Boundaries
- Global error boundary
- Route-level error boundaries
- Component-level error handling
- API error interceptors

---

## Testing Strategy

### Test Types
1. **Unit Tests** - Individual components and functions
2. **Integration Tests** - API endpoints and workflows
3. **E2E Tests** - Complete user journeys
4. **Performance Tests** - Load and stress testing
5. **Security Tests** - Vulnerability scanning

### Test Coverage
- Component testing (React Testing Library)
- API testing (Jest/Supertest)
- UI testing (Cypress/Playwright)
- Accessibility testing (axe)

---

## Deployment Configuration

### Build Process
```bash
# Install dependencies
npm install

# Build production bundle
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```env
VITE_API_URL=https://adorchest6935back.builtwithrocket.new
VITE_PLATFORM_URL=https://application.rocket.new
VITE_ENV=production
VITE_AI_CLAUDE_KEY=<api-key>
VITE_AI_OPENAI_KEY=<api-key>
VITE_AI_STABILITY_KEY=<api-key>
```

### Platform Configuration (Rocket.new)
```javascript
{
  "_cfg": "https://adorchest6935back.builtwithrocket.new",
  "_be": "https://application.rocket.new",
  "_v": "0.1.10"
}
```

---

## Monitoring & Logging

### Metrics Tracked
- API response times
- Success/failure rates
- AI generation performance
- User activity
- System resource usage
- Error rates
- Integration health

### Logging
- Application logs
- Audit trail
- API request logs
- Error logs
- Security events
- Performance metrics

---

## Browser Compatibility

### Supported Browsers
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile Safari (iOS 14+) ✅

### Required Features
- ES6+ JavaScript support
- CSS Grid and Flexbox
- Web Storage API
- Fetch API
- WebSockets (for real-time features)

---

## Future Enhancements

### Planned Features
- Mobile app (React Native)
- Advanced A/B testing
- AI model fine-tuning
- Custom workflow builder (visual)
- Advanced analytics dashboard
- Multi-language support
- White-label options
- API marketplace
- Webhook builder

---

## Development Setup

### Prerequisites
```
Node.js 18+
npm 9+ or yarn 1.22+
Git
Modern code editor (VS Code recommended)
```

### Local Development
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
cd ad-orchestrator
npm install

# Start development server
npm run dev

# Access application
# http://localhost:5173
```

---

*Technical Specification v1.0 - Generated from Ad Orchestrator codebase analysis*
