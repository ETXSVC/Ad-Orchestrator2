# Ad Orchestrator - Visual Cheat Sheet

## 🎨 Quick Visual Reference Guide

---

## Main Screens at a Glance

### 📊 Dashboard
**What you see:** Campaign overview with key metrics  
**Key metrics:**
- 48 Active Campaigns (+12%)
- 45 Pending Approvals (+8)
- 23 Approved Today (+23%)
- 3 SLA Warnings (-2)

**Main actions:**
- View all campaigns
- Filter by status
- Export data
- Quick actions on campaigns

---

### ➕ Create Campaign
**What you see:** Three-column workspace  
**Sections:**
1. **Left:** Campaign Details (name, client, audience, colors)
2. **Center:** Prompt Engineering (AI-powered content creation)
3. **Right:** Progress Tracking (generation status, resource usage)

**Main actions:**
- Configure campaign settings
- Write AI prompts
- Generate ad variations
- Monitor resource usage

---

### ✓ Approvals
**What you see:** Asset grid with approval queue  
**Key metrics:**
- 47 Pending Review (+12%)
- 12 Overdue (⚠️)
- 89 Approved Today (+23%)
- 8.5 min avg review time

**Main actions:**
- Review assets
- Approve/Reject
- Filter by urgency
- Bulk operations

---

### 📁 Assets
**What you see:** Visual asset library in grid layout  
**Asset counts:**
- Images: 1,247
- Videos: 89
- GIFs: 156
- Documents: 34

**Main actions:**
- Browse assets
- Filter by campaign/client/type
- View asset details
- Track usage rights

---

### 👥 Users
**What you see:** User cards in grid layout  
**Key metrics:**
- 156 Total Users (+12)
- 142 Active Users (+8)
- 8 Pending Approvals (-3)
- 89 Active Sessions (+15)

**Main actions:**
- View user details
- Edit user info
- Activate/Deactivate
- Manage roles

---

### ⚙️ Settings
**What you see:** Configuration forms with tabs  
**Tabs available:**
- AI Settings (model, temperature, tokens)
- Workflow (approval routing)
- Integrations (connected services)
- Performance (system metrics)

**Main actions:**
- Configure AI models
- Test connections
- Save settings
- Reset to defaults

---

## Status Color Guide

### Campaign Status
| Color | Status | Meaning |
|-------|--------|---------|
| 🔵 Blue | Pending Approval | Waiting for review |
| 🟡 Yellow | Generating | AI creating content |
| 🟢 Green | Approved | Ready to use |
| 🔴 Red | Rejected | Needs revision |

### User Status
| Indicator | Status |
|-----------|--------|
| 🟢 Green dot | Active |
| ⚪ Gray dot | Inactive |

### Priority Badges
| Badge | Color | Priority |
|-------|-------|----------|
| URGENT | Red | Critical |
| SLA | Red | Deadline approaching |
| HIGH | Blue | High priority |

---

## Quick Actions Menu (⋮)

Available on most list items:
- 👁️ View Details
- ✏️ Edit
- 💬 Comments
- 🗑️ Delete/Deactivate
- 📋 Duplicate
- 📤 Share

---

## Progress Bar Colors

| Color | Range | Meaning |
|-------|-------|---------|
| 🟢 Green | 0-50% | Good |
| 🟡 Yellow | 50-80% | Moderate |
| 🔴 Red | 80-100% | High/Critical |

---

## Main Navigation Icons

```
⚡ Ad Orchestrator (Home/Logo)
📊 Dashboard
➕ Create
✓ Approvals
📁 Assets
👥 Users
⚙️ Settings
🔔 Notifications (with count badge)
```

---

## Filtering System

### Left Sidebar Filters (Standard across screens)

**Quick Filters:**
- 🔴 Urgent items
- 👤 My items
- ⭐ High priority
- 🕐 Recent activity

**Status Filters:**
- Checkboxes with counts
- Color-coded indicators
- Real-time updates

**Category Filters:**
- Campaigns
- Clients
- Users
- Date ranges

**Actions:**
- ✖️ Clear All
- 💾 Save Filter

---

## Data Display Patterns

### Metrics Card
```
┌─────────────┐
│    Icon     │
│     48      │ ← Large number
│   Label     │
│   +12%      │ ← Trend indicator
└─────────────┘
```

### Campaign Row
```
[☐] [Image] Title          Client     [Status] [##] [Progress] [SLA] [⋮]
                          Subtitle                   ████░░    ⏱️
```

### Asset Card
```
┌─────────────────┐
│                 │
│     [Image]     │
│                 │
├─────────────────┤
│ Title           │
│ 📅 Date         │
│ 🏷️ Tags        │
│ 📊 Quality: 87% │
│ [☐]            │
└─────────────────┘
```

### User Card
```
┌────────────────────────────┐
│ [Avatar] Name       [Badge]│
│          email@domain.com  │
│          Role | Department │
│                            │
│ 📅 Joined: Date           │
│ 🕐 Last Login: DateTime   │
│                            │
│ [View] [Edit] [Action]    │
└────────────────────────────┘
```

---

## Form Field Indicators

| Symbol | Meaning |
|--------|---------|
| * | Required field |
| ▼ | Dropdown menu |
| 📅 | Date picker |
| 🎨 | Color picker |
| 0/60 | Character count |

---

## Button Styles

### Primary Actions (Blue)
- Save AI Settings
- Add User
- Approve
- Generate

### Secondary Actions (Gray)
- Edit
- View Details
- Export
- Import

### Destructive Actions (Red)
- Reject
- Deactivate
- Delete

### Success Actions (Green)
- Activate
- Confirm

---

## Common Shortcuts

| Action | Shortcut |
|--------|----------|
| Search | `/` or `Ctrl+K` |
| New Campaign | `Ctrl+N` |
| Save | `Ctrl+S` |
| Close Modal | `Esc` |
| Select Item | `Space` |
| Multi-select | `Ctrl+Click` |

---

## Pagination Pattern

```
Showing X of Y items

[← Previous] [1] [2] [3] [4] [5] [Next →]
```

---

## Empty State Pattern

```
        🖼️
   No Items Yet

Helpful message explaining
what to do next

   [Action Button]
```

---

## Resource Usage Display

```
API Quota: 750/1000
███████████░░ 75%
250 requests remaining

Cloud Storage: 8 GB / 10 GB
████████████░ 80%
2 GB available
```

---

## Time/Date Formats

| Format | Example |
|--------|---------|
| Relative | 1h remaining, 2d ago |
| Short Date | 12/3/2025 |
| Full DateTime | 2025-12-03 05:45:00 |
| Duration | 8.5 min |

---

## SLA Indicators

| Display | Status |
|---------|--------|
| ⏱️ 5h 30m | Time remaining (normal) |
| ⏱️ 1h | Warning (yellow) |
| ⏱️ 1h remaining | Urgent (red badge) |

---

## Tag Display

```
[tag1] [tag2] [tag3] [+12]
```
- First 3 tags shown
- `+N` indicates more tags

---

## Grid View Options

| Icon | View | Description |
|------|------|-------------|
| 🔲 | Grid | Large cards, 3 columns |
| 🔲 | Medium | Medium cards, 4 columns |
| ☰ | List | Compact rows |

---

## Filter Chip Pattern

```
[🔍 Search] [Status: Active ✖️] [Client: Acme ✖️] [✖️ Clear All]
```

---

## Notification Badge

```
🔔²  ← Number indicates unread count
```

---

## User Profile Display

```
MJ
Marketing Manager
Admin
```

---

## System Status Indicators

| Indicator | Status |
|-----------|--------|
| 🟢 AI Service | Operational |
| 🟡 Maintenance | Warning |
| 🔴 Down | Critical |

---

## Quality Score Bar

```
Quality: 87%
██████████████░░░░░░ 87%
```

| Range | Color |
|-------|-------|
| 85%+ | Green |
| 70-84% | Yellow |
| <70% | Red |

---

## File Type Icons

| Type | Icon/Indicator |
|------|---------------|
| Image | 🖼️ or thumbnail |
| Video | ▶️ or thumbnail |
| GIF | Animated preview |
| Document | 📄 |

---

## Dimension Display

```
📐 1200×628  ← Width × Height in pixels
```

---

## Usage Rights Icons

| Icon | Meaning |
|------|---------|
| 🔓 | Unlimited Commercial Use |
| 📱 | Social Media Only |
| 📧 | Email Marketing Only |
| 📺 | Multi-Channel Distribution |

---

## Campaign Metadata Display

```
👤 Creator Name
📐 Dimensions
📅 Due Date
🏷️ tag1, tag2, tag3
```

---

## Quick Filter Sidebar Icons

| Icon | Filter Type |
|------|-------------|
| 🔴 | Urgent Approvals |
| 👤 | My Campaigns |
| ⭐ | High Priority |
| 🕐 | Recent Activity |

---

## Approval Actions

```
[✅ Approve] [✖️ Reject] [💬 Comment]
```

---

## View/Sort Controls

```
View: [🔲] [🔲] [☐]  Sort by: [Newest First ▼]
```

---

## Selection Controls

```
☐ 0 selected     or     ☑️ 6 assets selected
```

---

## Loading States

| State | Display |
|-------|---------|
| Loading | Spinner animation |
| Processing | Progress bar |
| Generating | "Generating..." text |
| Empty | Placeholder message |

---

## Color Picker Display

```
Primary Color
[■] #2563EB

Secondary Color
[□] #FFFFFF
```

---

## Aspect Ratio Options

- Square (1:1)
- Landscape (16:9)
- Portrait (9:16)
- Story (4:5)

---

## AI Model Options

- GPT-4 Vision (Recommended)
- Claude (Anthropic)
- Stable Diffusion XL
- DALL-E

---

## Temperature Control

```
Temperature: 0.7
Controls randomness (0.0 – 1.0)
```

---

## Common Validation Messages

| Field | Message |
|-------|---------|
| Required | "This field is required" |
| Email | "Please enter valid email" |
| Min Length | "Minimum X characters" |
| Max Length | "Maximum X characters" |

---

## Breadcrumb Navigation

```
Work > Buddo > BCK Construction...
```

---

## Footer Branding

```
┌──────────────┐
│   🚀         │
│ Rocket.new   │
└──────────────┘
```

---

*Visual Cheat Sheet for Quick Reference*
*Use this guide to quickly understand the UI patterns and conventions*
