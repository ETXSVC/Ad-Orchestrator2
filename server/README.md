# Ad-Orchestrator Backend API

Complete backend API for the Ad-Orchestrator platform with authentication, campaigns, assets, users, approvals, and AI integration.

## Features

- ✅ **JWT Authentication** - Secure login/logout with role-based access control
- ✅ **Campaign Management** - Full CRUD for advertising campaigns  
- ✅ **Asset Management** - File upload, storage, and metadata management
- ✅ **User Management** - Team member CRUD with roles and permissions
- ✅ **Approval Workflows** - Sequential/parallel approval system with SLA tracking
- ✅ **AI Integration** - Text and image generation using OpenAI API
- ✅ **Dashboard Analytics** - Real-time statistics and activity feed
- ✅ **File Uploads** - Secure file upload with validation (images, videos, documents)

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** SQLite (better-sqlite3)
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer
- **AI:** OpenAI API (GPT-4, DALL-E 3)

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-your-openai-key-here
```

### 3. Initialize Database

```bash
npm run init-db
```

This creates:

- Database file: `db/ad-orchestrator.db`
- Tables: users, campaigns, assets, approvals, etc.
- Default admin user: `admin@adorch.local` / `admin123`

### 4. Start Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

## API Endpoints

### Authentication

```
POST   /api/auth/login          # Login user
POST   /api/auth/register       # Register new user
GET    /api/auth/me             # Get current user
POST   /api/auth/logout         # Logout
```

### Campaigns

```
GET    /api/campaigns           # List campaigns
POST   /api/campaigns           # Create campaign
GET    /api/campaigns/:id       # Get campaign
PUT    /api/campaigns/:id       # Update campaign
DELETE /api/campaigns/:id       # Delete campaign
PATCH  /api/campaigns/:id/archive  # Archive campaign
```

### Assets

```
GET    /api/assets              # List assets
POST   /api/assets/upload       # Upload asset
GET    /api/assets/:id          # Get asset
PUT    /api/assets/:id          # Update metadata
DELETE /api/assets/:id          # Delete asset
GET    /api/assets/:id/download # Download file
```

### Users

```
GET    /api/users               # List users
POST   /api/users               # Create user
GET    /api/users/:id           # Get user
PUT    /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user
PATCH  /api/users/:id/status    # Change status
```

### Approvals

```
GET    /api/approvals/queue     # Get approval queue
POST   /api/approvals           # Create approval workflow
POST   /api/approvals/:id/approve  # Approve item
POST   /api/approvals/:id/reject   # Reject item
POST   /api/approvals/bulk-approve # Bulk approve
GET    /api/approvals/:id/history  # Approval history
```

### AI Generation

```
POST   /api/ai/generate/text    # Generate ad copy
POST   /api/ai/generate/image   # Generate ad image
GET    /api/ai/generations/:id  # Get generation
POST   /api/ai/save/:id         # Save to assets
```

### Dashboard

```
GET    /api/dashboard/stats     # Get statistics
GET    /api/dashboard/activity  # Recent activity
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example: Login and use token

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@adorch.local", "password": "admin123"}'

# Response: {"user": {...}, "token": "eyJhbGc..."}

# 2. Use token for protected requests
curl http://localhost:3000/api/campaigns \
  -H "Authorization: Bearer eyJhbGc..."
```

## Database Schema

### Users

- Authentication and user management
- Roles: admin, manager, creator, approver, user
- Status: active, inactive, suspended

### Campaigns

- Ad campaign management
- Status: draft, active, paused, completed, archived
- Links to users and assets

### Assets

- File storage and metadata
- Types: image, video, document, graphic
- Status: uploaded, processing, approved, rejected

### Approvals

- Workflow management
- Types: sequential, parallel, route-based
- SLA tracking with deadlines

### AI Generations

- AI generation history
- Types: text, image
- Model tracking and results

## File Uploads

### Supported file types

- **Images:** JPEG, PNG, GIF, WebP, SVG
- **Videos:** MP4, WebM, QuickTime
- **Documents:** PDF, Word (DOC/DOCX)

### Upload limits

- Max file size: 10MB (configurable)
- Max files per upload: 10

### Example upload

```bash
curl -X POST http://localhost:3000/api/assets/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.png" \
  -F "title=Summer Campaign" \
  -F "campaign_id=1"
```

## AI Integration

### Text Generation (OpenAI GPT-4)

```json
POST /api/ai/generate/text
{
  "prompt": "Create a summer sale ad for beach products",
  "model": "gpt-4",
  "temperature": 0.7,
  "brand_voice": "friendly and energetic",
  "target_audience": "millennials"
}
```

### Image Generation (DALL-E 3)

```json
POST /api/ai/generate/image
{
  "prompt": "A vibrant summer beach scene with surfboards",
  "size": "1024x1024",
  "quality": "standard"
}
```

## Error Handling

API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

Error response format:

```json
{
  "error": "Error message description"
}
```

## Development

### Project Structure

```
server/
├── db/
│   ├── schema.sql       # Database schema
│   ├── database.js      # DB connection & helpers
│   └── init.js          # Initialization script
├── middleware/
│   ├── auth.js          # JWT authentication
│   └── upload.js        # File upload config
├── routes/
│   ├── auth.js          # Auth endpoints
│   ├── campaigns.js     # Campaign endpoints
│   ├── assets.js        # Asset endpoints
│   ├── users.js         # User endpoints
│   ├── approvals.js     # Approval endpoints
│   ├── ai.js            # AI endpoints
│   └── dashboard.js     # Dashboard endpoints
├── services/
│   ├── aiService.js     # AI generation logic
│   └── dashboardService.js  # Stats & analytics
├── uploads/             # Uploaded files (created automatically)
├── index.js             # Main server file
├── package.json         # Dependencies
└── .env                 # Configuration (not in git)
```

## Security

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ File type validation
- ✅ File size limits
- ✅ CORS protection
- ✅ SQL injection prevention (parameterized queries)

## License

MIT
