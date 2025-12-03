# Ad Orchestrator - Visual System Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AD ORCHESTRATOR SYSTEM                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRESENTATION LAYER                                │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      React 18.3 Single Page App                       │  │
│  │                                                                        │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────────┐       │  │
│  │  │ Dashboard │  │ Campaigns │  │  Assets   │  │  Approvals │       │  │
│  │  └───────────┘  └───────────┘  └───────────┘  └────────────┘       │  │
│  │                                                                        │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────────┐       │  │
│  │  │AI Workspace│  │   Users   │  │Integration│  │ Analytics  │       │  │
│  │  └───────────┘  └───────────┘  └───────────┘  └────────────┘       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↕ HTTPS
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROCKET.NEW PLATFORM LAYER                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  rocket-web.js  │  rocket-shot.js  │  Platform API Services         │  │
│  │  Authentication │  Session Mgmt    │  Asset CDN                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↕ REST API
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION BACKEND                                │
│              adorchest6935back.builtwithrocket.new                           │
│                                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────┐          │
│  │ Campaign   │  │   Asset    │  │  Approval  │  │   User      │          │
│  │ Service    │  │  Service   │  │  Service   │  │  Service    │          │
│  └────┬───────┘  └────┬───────┘  └─────┬──────┘  └──────┬──────┘          │
│       │               │                 │                 │                  │
│  ┌────▼────────────────▼─────────────────▼─────────────────▼──────┐        │
│  │                    Business Logic Layer                         │        │
│  │  • Workflow Engine  • Validation  • Notifications               │        │
│  └──────────────────────────────────────────────────────────────────┘        │
│       │               │                 │                 │                  │
│  ┌────▼───────┐  ┌────▼───────┐  ┌─────▼──────┐  ┌──────▼──────┐          │
│  │    AI      │  │Integration │  │  Analytics │  │   Audit     │          │
│  │  Service   │  │  Service   │  │  Service   │  │   Service   │          │
│  └────────────┘  └────────────┘  └────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↕
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA & STORAGE LAYER                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Cloud Database  │  Asset Storage  │  Cache  │  Queue  │  Logs       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↕
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL INTEGRATIONS                               │
│                                                                               │
│  AI Services:                     Advertising Platforms:                     │
│  ┌──────────┐  ┌──────────┐     ┌──────────┐  ┌──────────┐                │
│  │  Claude  │  │  GPT-4   │     │ Google   │  │ Facebook │                │
│  │   API    │  │   API    │     │   Ads    │  │   Ads    │                │
│  └──────────┘  └──────────┘     └──────────┘  └──────────┘                │
│  ┌──────────┐  ┌──────────┐     ┌──────────┐  ┌──────────┐                │
│  │ Stable   │  │  DALL-E  │     │  TikTok  │  │ Snapchat │                │
│  │Diffusion │  │          │     │   Ads    │  │          │                │
│  └──────────┘  └──────────┘     └──────────┘  └──────────┘                │
│                                                                               │
│  Business Tools:                  Storage & Collaboration:                   │
│  ┌──────────┐  ┌──────────┐     ┌──────────┐  ┌──────────┐                │
│  │Salesforce│  │  HubSpot │     │  Google  │  │ Dropbox  │                │
│  │   CRM    │  │          │     │  Drive   │  │          │                │
│  └──────────┘  └──────────┘     └──────────┘  └──────────┘                │
│  ┌──────────┐  ┌──────────┐     ┌──────────┐  ┌──────────┐                │
│  │  Adobe   │  │  Canva   │     │   Slack  │  │  Teams   │                │
│  │  Cloud   │  │          │     │          │  │          │                │
│  └──────────┘  └──────────┘     └──────────┘  └──────────┘                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Campaign Lifecycle Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CAMPAIGN LIFECYCLE                                  │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌──────────┐
   │  START   │
   └────┬─────┘
        │
        ▼
   ┌─────────────────┐
   │ Create Campaign │
   │                 │
   │ • Define goals  │
   │ • Select client │
   │ • Set dates     │
   │ • Choose channels│
   └────┬────────────┘
        │
        ▼
   ┌─────────────────┐          ┌──────────────────┐
   │ Generate Content│◄────────►│ AI Generation    │
   │                 │          │                  │
   │ • AI copywriting│          │ • Claude         │
   │ • Image creation│          │ • GPT-4          │
   │ • Asset upload  │          │ • Stable Diffusion│
   └────┬────────────┘          └──────────────────┘
        │
        ▼
   ┌─────────────────┐
   │ Review & Refine │
   │                 │
   │ • Edit content  │
   │ • Adjust design │
   │ • Add metadata  │
   └────┬────────────┘
        │
        ▼
   ┌─────────────────┐
   │Submit for       │
   │   Approval      │
   └────┬────────────┘
        │
        ▼
   ┌─────────────────┐          ┌──────────────────┐
   │ Approval Queue  │          │ Approval Workflow│
   │                 │          │                  │
   │ • Pending       │◄────────►│ • Sequential     │
   │ • In Review     │          │ • Parallel       │
   │ • SLA Tracking  │          │ • Route-based    │
   └────┬────────────┘          └──────────────────┘
        │
        ├──────────┐
        │          │
        ▼          ▼
  ┌──────────┐  ┌──────────┐
  │ Approved │  │ Rejected │
  │          │  │          │
  └────┬─────┘  └────┬─────┘
       │             │
       │             ▼
       │        ┌─────────────┐
       │        │   Revise    │
       │        │  & Resubmit │
       │        └────┬────────┘
       │             │
       │             └──────────┐
       │                        │
       ▼                        ▼
  ┌─────────────────┐    ┌─────────────┐
  │ Deploy Campaign │    │  Archive    │
  │                 │    │             │
  │ • Schedule      │    └─────────────┘
  │ • Launch        │
  │ • Monitor       │
  └────┬────────────┘
       │
       ▼
  ┌─────────────────┐
  │ Track & Analyze │
  │                 │
  │ • Performance   │
  │ • Metrics       │
  │ • Optimization  │
  └────┬────────────┘
       │
       ▼
  ┌─────────────────┐
  │ Campaign End    │
  │                 │
  │ • Final report  │
  │ • Archive       │
  └────┬────────────┘
       │
       ▼
   ┌──────────┐
   │   END    │
   └──────────┘
```

---

## User Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐
     │  User    │
     └────┬─────┘
          │
          ▼
   ┌─────────────┐
   │Login Page   │
   │             │
   │ Enter:      │
   │ • Email     │
   │ • Password  │
   └────┬────────┘
        │
        ▼
   ┌─────────────────────┐
   │ Validate Credentials│
   └────┬────────────────┘
        │
        ├────────────────────┐
        │                    │
        ▼                    ▼
   ┌─────────┐         ┌─────────┐
   │ Valid   │         │ Invalid │
   └────┬────┘         └────┬────┘
        │                   │
        ▼                   ▼
   ┌─────────────┐     ┌──────────────┐
   │ 2FA Enabled?│     │ Show Error   │
   └────┬────────┘     │ Retry Login  │
        │              └──────────────┘
        ├────────────┐
        │            │
        ▼            ▼
     ┌───────┐   ┌───────┐
     │  Yes  │   │  No   │
     └───┬───┘   └───┬───┘
         │           │
         ▼           │
   ┌─────────────┐  │
   │ Send 2FA    │  │
   │ Code        │  │
   └────┬────────┘  │
        │           │
        ▼           │
   ┌─────────────┐  │
   │ Verify Code │  │
   └────┬────────┘  │
        │           │
        └─────┬─────┘
              │
              ▼
        ┌─────────────┐
        │Generate JWT │
        │Token        │
        └────┬────────┘
             │
             ▼
        ┌─────────────┐
        │Create Session│
        └────┬────────┘
             │
             ▼
        ┌─────────────┐
        │Load User    │
        │Profile      │
        └────┬────────┘
             │
             ▼
        ┌─────────────┐
        │Fetch User   │
        │Permissions  │
        └────┬────────┘
             │
             ▼
        ┌─────────────┐
        │Redirect to  │
        │Dashboard    │
        └─────────────┘
```

---

## AI Generation Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI GENERATION WORKFLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌──────────────┐
   │User Opens    │
   │AI Workspace  │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │Select Model  │
   │              │
   │ ○ Claude     │
   │ ○ GPT-4      │
   │ ○ DALL-E     │
   │ ○ Stable Diff│
   └──────┬───────┘
          │
          ▼
   ┌────────────────────┐
   │Configure Parameters│
   │                    │
   │ • Temperature      │
   │ • Brand Voice      │
   │ • Target Audience  │
   │ • Style Preset     │
   │ • SEO Keywords     │
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │Enter Prompt        │
   │                    │
   │ "Create a summer   │
   │  sale banner..."   │
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │Click Generate      │
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │Send Request to API │
   └────────┬───────────┘
            │
            ├──────────────────────┐
            │                      │
            ▼                      ▼
   ┌────────────────┐    ┌────────────────┐
   │Text Generation │    │Image Generation│
   │                │    │                │
   │ Claude/GPT-4   │    │ DALL-E/SD      │
   └────────┬───────┘    └────────┬───────┘
            │                     │
            └──────────┬──────────┘
                       │
                       ▼
            ┌──────────────────┐
            │Apply Moderation  │
            │& Brand Check     │
            └────────┬─────────┘
                     │
                     ├────────────────┐
                     │                │
                     ▼                ▼
              ┌───────────┐    ┌───────────┐
              │  Passed   │    │  Failed   │
              └─────┬─────┘    └─────┬─────┘
                    │                │
                    │                ▼
                    │          ┌──────────────┐
                    │          │Show Error    │
                    │          │Allow Retry   │
                    │          └──────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │Display Preview  │
          │                 │
          │ [Generated      │
          │  Content]       │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │User Actions     │
          │                 │
          │ ○ Regenerate    │
          │ ○ Edit          │
          │ ○ Save          │
          │ ○ Discard       │
          └────────┬────────┘
                   │
                   ├──────────────────┬──────────────┐
                   │                  │              │
                   ▼                  ▼              ▼
            ┌──────────┐      ┌─────────┐    ┌──────────┐
            │Regenerate│      │  Edit   │    │   Save   │
            │(Loop back)│      │ Content │    │ to Asset │
            └──────────┘      └─────────┘    │ Library  │
                                              └──────────┘
```

---

## Approval Routing Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APPROVAL ROUTING LOGIC                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │ Asset Submitted  │
                    │  for Approval    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Evaluate Route  │
                    │     Criteria     │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌────────────────┐   ┌────────────────┐
│  Sequential   │   │   Parallel     │   │  Route-based   │
│   Approval    │   │   Approval     │   │   Approval     │
└───────┬───────┘   └────────┬───────┘   └────────┬───────┘
        │                    │                     │
        ▼                    │                     │
┌───────────────┐            │                     │
│  Approver 1   │            │                     │
└───────┬───────┘            │                     │
        │                    │                     │
        ├─────────┐          │                     │
        │         │          │                     │
        ▼         ▼          ▼                     ▼
  ┌─────────┐ ┌────────┐   ┌──────────────────────────┐
  │Approve  │ │Reject  │   │  Route to Department:    │
  └────┬────┘ └───┬────┘   │                          │
       │          │        │  ┌────────┐  ┌────────┐  │
       ▼          │        │  │ Legal  │  │Creative│  │
┌───────────────┐ │        │  └───┬────┘  └───┬────┘  │
│  Approver 2   │ │        │      │           │       │
└───────┬───────┘ │        │      └─────┬─────┘       │
        │         │        │            │             │
        ├─────┐   │        │   All Approve Together   │
        │     │   │        └────────────┬─────────────┘
        ▼     ▼   │                     │
  ┌─────────┐ ┌──▼─────┐              │
  │Approve  │ │Reject  │              │
  └────┬────┘ └───┬────┘              │
       │          │                    │
       ▼          │                    │
┌───────────────┐ │                    │
│ All Approvers │ │                    │
│   Complete    │ │                    │
└───────┬───────┘ │                    │
        │         │                    │
        └────┬────┴────────────────────┘
             │
             ├────────────────┐
             │                │
             ▼                ▼
      ┌─────────────┐  ┌─────────────┐
      │All Approved │  │Any Rejected │
      └──────┬──────┘  └──────┬──────┘
             │                │
             ▼                ▼
      ┌─────────────┐  ┌─────────────┐
      │   Deploy    │  │  Return to  │
      │   Asset     │  │   Creator   │
      └─────────────┘  └─────────────┘
```

---

## Data Model Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA MODEL RELATIONSHIPS                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    User      │
│              │
│ • id         │
│ • email      │
│ • name       │
│ • role_id    │───────────┐
└──────┬───────┘           │
       │                   │
       │ creates           ▼
       │            ┌──────────────┐
       │            │     Role     │
       │            │              │
       │            │ • id         │
       │            │ • name       │
       │            │ • permissions│
       │            └──────────────┘
       │
       ▼
┌──────────────┐           ┌──────────────┐
│  Campaign    │───────────│    Client    │
│              │  belongs  │              │
│ • id         │    to     │ • id         │
│ • title      │           │ • name       │
│ • status     │           │ • industry   │
│ • client_id  │───────────┘              │
│ • created_by │           └──────────────┘
└──────┬───────┘
       │
       │ has many
       │
       ▼
┌──────────────┐           ┌──────────────┐
│    Asset     │───────────│   Approval   │
│              │  triggers │              │
│ • id         │           │ • id         │
│ • type       │           │ • asset_id   │
│ • filename   │───────────│ • status     │
│ • campaign_id│           │ • workflow_id│
│ • status     │           └──────┬───────┘
└──────┬───────┘                  │
       │                          │
       │ generated by             │ has many
       │                          │
       ▼                          ▼
┌──────────────┐           ┌──────────────┐
│AIGeneration  │           │ApprovalStep  │
│              │           │              │
│ • id         │           │ • id         │
│ • asset_id   │           │ • approval_id│
│ • model      │           │ • approver_id│
│ • prompt     │           │ • status     │
│ • parameters │           │ • comments   │
└──────────────┘           └──────────────┘

┌──────────────┐           ┌──────────────┐
│ Integration  │           │   Workflow   │
│              │           │              │
│ • id         │           │ • id         │
│ • type       │           │ • name       │
│ • status     │           │ • type       │
│ • config     │           │ • steps      │
│ • user_id    │           │ • campaign_id│
└──────────────┘           └──────────────┘
```

---

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT HIERARCHY                                   │
└─────────────────────────────────────────────────────────────────────────────┘

App
├── AuthProvider
│   └── Router
│       ├── Layout
│       │   ├── Header
│       │   │   ├── Logo
│       │   │   ├── Navigation
│       │   │   ├── SearchBar
│       │   │   ├── NotificationBell
│       │   │   └── UserMenu
│       │   │
│       │   ├── Sidebar
│       │   │   ├── MainNav
│       │   │   └── QuickActions
│       │   │
│       │   ├── Main Content
│       │   │   └── [Page Component]
│       │   │
│       │   └── Footer
│       │
│       └── Pages
│           ├── Dashboard
│           │   ├── StatsCards
│           │   ├── ActivityFeed
│           │   └── QuickActions
│           │
│           ├── Campaigns
│           │   ├── CampaignFilters
│           │   ├── BulkActionToolbar
│           │   ├── ViewControls
│           │   └── CampaignList
│           │       └── CampaignCard[]
│           │
│           ├── Assets
│           │   ├── AssetFilters
│           │   ├── AssetUpload
│           │   └── AssetGallery
│           │       └── AssetCard[]
│           │
│           ├── AIWorkspace
│           │   ├── ControlPanel
│           │   │   ├── ModelSelector
│           │   │   ├── PromptInput
│           │   │   └── ParameterControls
│           │   └── PreviewPanel
│           │       ├── GeneratedContent
│           │       └── ActionButtons
│           │
│           ├── Approvals
│           │   ├── ApprovalFilters
│           │   ├── BulkApproval
│           │   └── ApprovalQueue
│           │       └── ApprovalCard[]
│           │
│           ├── Users
│           │   ├── UserFilters
│           │   └── UserList
│           │       └── UserCard[]
│           │
│           ├── Integrations
│           │   └── IntegrationList
│           │       └── IntegrationCard[]
│           │
│           ├── Analytics
│           │   ├── DateRangePicker
│           │   ├── MetricsCards
│           │   └── Charts[]
│           │
│           └── Settings
│               ├── GeneralSettings
│               ├── AISettings
│               ├── WorkflowSettings
│               └── NotificationSettings
│
└── Global Components
    ├── Modal
    ├── Toast
    ├── ConfirmDialog
    └── LoadingSpinner
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        STATE MANAGEMENT FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│  Component  │
└──────┬──────┘
       │
       │ dispatches action
       │
       ▼
┌─────────────────┐
│   Custom Hook   │
│  (useAssets)    │
└──────┬──────────┘
       │
       │ calls
       │
       ▼
┌─────────────────┐
│  API Service    │
└──────┬──────────┘
       │
       │ makes HTTP request
       │
       ▼
┌─────────────────┐
│   Backend API   │
└──────┬──────────┘
       │
       │ returns data
       │
       ▼
┌─────────────────┐
│  Update State   │
│  (setState)     │
└──────┬──────────┘
       │
       │ triggers re-render
       │
       ▼
┌─────────────┐
│  Component  │
│  Re-renders │
└─────────────┘

Context Providers:
┌─────────────────────┐
│   AuthContext       │ ──► User, Token, Permissions
│   CampaignContext   │ ──► Campaigns, Filters, Actions
│   AssetContext      │ ──► Assets, Uploads, Selection
│   ApprovalContext   │ ──► Queue, Stats, Workflows
│   NotificationContext│──► Notifications, Alerts
└─────────────────────┘
```

---

*Visual System Diagrams for Ad Orchestrator Application*
