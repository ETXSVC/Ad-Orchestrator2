# Ad Orchestrator - Screen-by-Screen Documentation

## 📸 Visual Interface Guide

This document provides detailed descriptions of each screen in the Ad Orchestrator application, based on actual screenshots.

---

## Navigation Structure

**Main Navigation Bar** (Present on all screens)
- 🏠 **Dashboard** - Overview and statistics
- ➕ **Create** - Create new campaigns
- ✓ **Approvals** - Review and approve content
- 📁 **Assets** - Asset library management
- 👥 **Users** - User and role management
- ⚙️ **Settings** - System configuration

**User Profile** (Top Right)
- Shows: "MJ - Marketing Manager (Admin)"
- Notification bell with count badge (2 notifications shown)

---

## Screen 1: Dashboard (Main Campaign View)

**URL:** `/ad-orchestrator-ez8bq64.public.builtwithrocket.new`

### Key Metrics Cards (Top Section)
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 48              │ 45              │ 23              │ 3               │
│ Active Campaigns│ Pending         │ Approved Today  │ SLA Warnings    │
│ +12%           │ Approvals +8    │ +23%           │ -2              │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### Campaign Tabs
- **All Campaigns** (Active - Blue highlight)
- My Campaigns
- Urgent
- Archived

### Left Sidebar - Filters Panel

**Quick Filters:**
- 🔴 Urgent Approvals
- 👤 My Campaigns
- ⭐ High Priority
- 🕐 Recent Activity

**Status Filter** (8 total)
- ☐ Generating (23)
- ☐ Pending Approval (45)
- ☐ Approved (156)
- ☐ Rejected (12)

**Clients Filter**
- ☐ Acme Corporation (12)
- ☐ TechStart Inc (8)

### Main Campaign List

**View Options:**
- 🔲 Grid View (active)
- ☰ List View

**Actions:**
- ⚙️ More Filters
- 📥 Export All

**Table Columns:**
- ☐ Checkbox (0 selected)
- Campaign (with thumbnail)
- Client
- Status
- Pending
- Progress (with progress bar)
- SLA (with time remaining)
- Actions (⋮ menu)

### Sample Campaigns Visible:

1. **Summer Sale 2025**
   - Client: Acme Corporation (Retail)
   - Status: 🔵 Pending Approval
   - Approvers: 12
   - Progress: 75%
   - SLA: ⏱️ 5h 30m

2. **Holiday Promo 2025**
   - Client: TechStart Inc (Technology)
   - Status: 🟡 Generating
   - Ads: 18
   - Progress: 45%
   - SLA: 🕐 12h

3. **New Product Launch**
   - Client: Global Retail Group (E-commerce)
   - Status: ✅ Approved
   - Ads: 32
   - Progress: 100%
   - Completed: 2d

4. **Brand Awareness Q1**
   - Client: FinTech Solutions (Finance)
   - Status: 🔵 Pending Approval
   - Approvers: 15
   - Progress: 60%
   - SLA: ⏱️ 2h

5. **Spring Collection**
   - Client: Healthcare Plus (Healthcare)
   - Status: 🔴 Rejected
   - Progress: 35%
   - SLA: 3d

**Footer:** "Showing 8 of 236 campaigns"

**Pagination:** ← Previous | 1 | 2 | 3 | 4 | 5 | Next →

---

## Screen 2: Campaign Configuration (Create/Edit Campaign)

**URL:** `/ad-orchestrator-ez8bq64.public.builtwithrocket.new/Campaign Dashboard`

### Three-Column Layout

#### Left Panel: Campaign Configuration
⚙️ **Campaign Details**

**Required Fields:**
- **Campaign Name*** 
  - Placeholder: "e.g., Summer Sale 2025"
  
- **Client***
  - Dropdown: "Select client"
  
- **Target Audience***
  - Dropdown: "Select target audience"
  
- **Brand Voice***
  - Dropdown: "Select brand voice"

**Visual Specifications:**
- **Primary Color**
  - Color picker: #2563EB (Blue)
  
- **Secondary Color**
  - Color picker: #FFFFFF (White)
  
- **Aspect Ratio***
  - Dropdown selection

#### Center Panel: Prompt Engineering
📄 **Craft compelling ad copy with AI-powered suggestions**

**Ad Title** (0/60 characters)
- Text input: "Enter compelling ad title..."

**Description** (0/150 characters)
- Textarea: "Write a detailed description that captures attention..."

**SEO Keywords (comma-separated)** (0/280 characters)
- Tag input field

**Preview Section:**
- 🖼️ No Previews Yet
- Message: "Configure your campaign settings and click 'Generate Ad Variations' to create AI-powered ad content"

**Quality Indicators:**
- ⚡ AI-Powered
- 🕐 Real-time
- ✓ Quality Assured

#### Right Panel: Progress Tracking
📊 **Monitor generation status and resource usage**

**Generation Queue**
- Queue Position: 0 of 0
- Progress: 0%
- Status: 0/0 completed

**Estimated Time**
- 0m 0s
- Status: Started.

**Resource Usage**
- **API Quota:** 750/1000
  - Orange progress bar (75% used)
  - "250 requests remaining"

- **Cloud Storage:** 8 GB / 10 GB
  - Red progress bar (80% used)
  - "2 GB available"

**System Status**
- 🟢 AI Service (green indicator)

---

## Screen 3: Approval Queue Management

**URL:** `/ad-orchestrator-ez8bq64.public.builtwithrocket.new/Approval Queue Management`

**Page Title:** Approvals
**Subtitle:** "Review and approve AI-generated advertising content"

### Top Metrics Dashboard
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ 47          │ 12          │ 89          │ 8.5 min     │ 12          │ 35          │
│ Pending     │ Overdue     │ Approved    │ Avg. Review │ My Queue    │ Team Queue  │
│ Review      │ ⚠️ (Red box)│ Today       │ Time        │             │             │
│ +12%        │             │ +23%        │             │             │ +15         │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Filter Controls
**Top Bar:**
- 📋 SLA Deadline (Urgent First) ▼
- 🔍 6 assets
- 🔲 Grid View (active)
- ☰ List View
- 🔘 Hide Filters
- 👁️ Show Preview

### Left Sidebar Filters

**SAVED FILTERS:**
- Urgent & Pending →
- My Assignments →
- Overdue Items →

**STATUS:**
- ☑️ Pending Review (12/47) ← Selected
- ☐ Approved (234)
- ☐ Rejected (18)
- ☐ Escalated (5)

**CAMPAIGN:**
- ☐ Summer Sale 2025 (23)
- ☐ Holiday Promo SLA (15)
- ☐ Brand Awareness Q1 (9)

### Asset Grid Display

**Asset 1: Summer Sale 2025 - Beach Lifestyle Display Ad**
- Image: Beach scene with woman in white clothing
- Campaign: Summer Sale 2025
- Creator: 👤 Sarah Johnson
- Dimensions: 📐 1200×628
- Due: 📅 12/3/2025
- SLA: ⏱️ 1h remaining
- Tags: summer fashion, beachwear, lifestyle, +12
- Status: 🟡 pending
- Badges: 🔴 URGENT | 🔴 SLA
- Actions: ✅ Approve | ✖️ Reject | 💬

**Asset 2: Holiday Promo - Gift Guide Social Media Post**
- Image: Red gift box with holiday decorations
- Campaign: Holiday Promo
- Creator: 👤 Michael Chen
- Dimensions: 📐 1080×1080
- Due: 📅 12/3/2025
- SLA: ⏱️ 1h remaining
- Tags: holiday gifts, christmas shopping, gift guide, +12
- Status: 🟡 pending
- Badges: 🔵 HIGH | 🔴 SLA
- Actions: ✅ Approve | ✖️ Reject | 💬

**Asset 3: Brand Awareness Q1 - Tech Innovation Banner**
- Image: Modern tech workspace with multiple monitors
- Campaign: Brand Awareness Q1
- Creator: 👤 Emily Rodriguez
- Dimensions: 📐 728×90
- Due: 📅 12/3/2025
- SLA: 🕐 1d remaining
- Tags: technology, innovation, digital, +12
- Status: 🟡 pending
- Actions: ✅ Approve | ✖️ Reject | 💬

---

## Screen 4: Campaign Asset Library

**URL:** `/ad-orchestrator-ez8bq64.public.builtwithrocket.new/Campaign Asset Library`

**Page Title:** Campaign Asset Library
**Subtitle:** "Manage and distribute approved creative assets across campaigns"

### View Controls
**Top Bar:**
- 🔍 Filters | ✖️ Clear All
- View: 🔲 Grid (active) | 🔲 Medium Grid | ☐ List
- Sort by: Newest First ▼

### Left Sidebar Filters

**Campaign**
- All Campaigns ▼ (collapsed)

**Client**
- All Clients ▼ (collapsed)

**Asset Type**
- ☐ Images (1247)
- ☐ Videos (89)
- ☐ GIFs (156)
- ☐ Documents (34)

**Date Range**
- From: mm/dd/yyyy
- To: mm/dd/yyyy

### Asset Grid (2×3 layout)

**Row 1:**

1. **Summer Sale Hero Banner - Desktop**
   - Image: Colorful summer sale banner by pool
   - Date: 📅 Nov 28, 2025
   - Campaign: Summer Sale 2025
   - Tags: hero-banner, desktop, sale, +1
   - Usage: 🔓 Unlimited Commercial Use
   - Quality: 87% (green bar)
   - Checkbox: ☐

2. **Holiday Promo Social Media Post**
   - Image: Red gift with bow and ornaments
   - Date: 📅 Nov 25, 2025
   - Campaign: Holiday Promo
   - Tags: social-media, holiday, promo, +1
   - Usage: 📱 Social Media Only
   - Quality: 92% (green bar)
   - Checkbox: ☐

3. **Spring Collection Launch Video Thumbnail**
   - Image: Woman in green dress with cherry blossoms
   - Date: 📅 Nov 20, 2025
   - Campaign: Spring Collection
   - Tags: video-thumbnail, fashion, spring, +1
   - Usage: 📺 Multi-Channel Distribution
   - Quality: 78% (yellow bar)
   - Checkbox: ☐

**Row 2:**

4. **Back to School Email Header**
   - Image: Bright blue background with "BACK TO SCHOOL" text
   - Date: 📅 Nov 15, 2025
   - Campaign: Back to School
   - Tags: email-header, education, back-to-school, +1
   - Usage: 📧 Email Marketing Only
   - Quality: 85% (green bar)
   - Checkbox: ☑️ Selected (blue)

5. **Product Launch Teaser - Mobile**
   - Image: Dark business theme with "ELEVATE YOUR VISION" text
   - Date: 📅 Nov 10, 2025
   - Campaign: Spring Collection
   - Tags: mobile, teaser, product-launch, +1
   - Quality: 72% (yellow bar)
   - Checkbox: ☐

6. **Black Friday Countdown GIF**
   - Image: "RetailMax" logo with red arrow
   - Date: 📅 Oct 30, 2025
   - Campaign: Black Friday 2024
   - Tags: animated, black-friday, countdown, +1
   - Quality: 94% (green bar)
   - Checkbox: ☐

---

## Screen 5: User & Role Management

**URL:** `/ad-orchestrator-ez8bq64.public.builtwithrocket.new/Campaign Asset Library`
*Note: URL shows Asset Library but content is Users page*

**Page Title:** User & Role Management
**Subtitle:** "Manage user accounts, roles, permissions, and organizational hierarchy"

### Top Action Bar
- 📥 Export
- 📤 Import
- ➕ Add User (Blue button)

### Key Metrics
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 156         │ 142         │ 8           │ 89          │
│ Total Users │ Active Users│ Pending     │ Active      │
│ +12         │ +8          │ Approvals   │ Sessions    │
│             │             │ -3          │ +15         │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### View Controls
- Grid View ▼
- 🔍 Filters
- ☐ Select All (6)

**Status:** "Showing 6 of 156 users"

### User Cards (2×3 Grid Layout)

**Row 1:**

1. **Sarah Johnson** (active)
   - Email: sarah.johnson@adorch.com
   - Role: 🟢 Marketing Manager | Marketing
   - Joined: 2023-01-15
   - Last Login: 2025-12-03 05:45:00
   - Actions: 👁️ View Details | ✏️ Edit | 🗑️ Deactivate
   - Checkbox: ☐

2. **Michael Chen** (active)
   - Email: michael.chen@adorch.com
   - Role: 🟢 Creative Director | Creative
   - Joined: 2023-03-20
   - Last Login: 2025-12-03 06:10:00
   - Actions: 👁️ View Details | ✏️ Edit | 🗑️ Deactivate
   - Checkbox: ☐

3. **Emily Rodriguez** (active)
   - Email: emily.rodriguez@adorch.com
   - Role: 🟢 Marketing Specialist | Marketing
   - Joined: 2023-06-10
   - Last Login: 2025-12-03 05:20:00
   - Actions: 👁️ View Details | ✏️ Edit | 🗑️ Deactivate
   - Checkbox: ☐

**Row 2:**

4. **David Thompson** (active)
   - Email: david.thompson@adorch.com
   - Role: 🟢 Admin | IT
   - Joined: 2022-11-05
   - Last Login: 2025-12-03 06:15:00
   - Actions: 👁️ View Details | ✏️ Edit | 🗑️ Deactivate
   - Checkbox: ☐

5. **Jessica Martinez** (inactive)
   - Email: jessica.martinez@adorch.com
   - Role: 🟢 Brand Manager | Marketing
   - Joined: 2023-08-15
   - Last Login: 2025-11-28 14:30:00
   - Actions: 👁️ View Details | ✏️ Edit | ✅ Activate (Green button)
   - Checkbox: ☐

6. **Robert Kim** (active)
   - Email: robert.kim@adorch.com
   - Role: 🟢 Marketing Specialist | Marketing
   - Joined: 2024-01-10
   - Last Login: 2025-12-03 04:50:00
   - Actions: 👁️ View Details | ✏️ Edit | 🗑️ Deactivate
   - Checkbox: ☐

---

## Screen 6: System Configuration & Settings

**URL:** `/ad-orchestrator-ez8bq64.public.builtwithrocket.new/Campaign Asset Library`
*Note: URL shows Asset Library but content is Settings page*

**Page Title:** System Configuration & Settings
**Icon:** ⚙️
**Subtitle:** "Manage AI parameters, workflows, integrations, and system performance"

### Settings Tabs
- ⚙️ **AI Settings** (Active - Blue)
- 🔄 Workflow
- 🔌 Integrations
- 📊 Performance

### AI Model Configuration Section

**Section Header:** AI Model Configuration
**Description:** "Configure AI generation models and parameters for optimal performance"

**Action Button:** 🔌 Test Connection (Top right)

### Configuration Form (Two-Column Layout)

**Left Column:**

1. **AI Model*** (Required)
   - Dropdown: "GPT-4 Vision (Recommended)"
   - Help text: "Select the primary model for ad generation"

2. **Temperature*** (Required)
   - Input: 0.7
   - Help text: "Controls randomness (0.0 – 1.0)"

3. **Quality Threshold (%)*** (Required)
   - Input: 85
   - Help text: "Minimum quality score for auto-approval"

4. **Retry Attempts*** (Required)
   - Input: 3
   - Help text: "Number of retries on failure"

**Right Column:**

1. **Prompt Template*** (Required)
   - Dropdown: "Default Template"
   - Help text: "Choose the prompt structure for generation"

2. **Max Tokens*** (Required)
   - Input: 2000
   - Help text: "Maximum tokens per generation"

3. **API Timeout (seconds)*** (Required)
   - Input: 30
   - Help text: "Maximum wait time for API response"

4. **Batch Size*** (Required)
   - Input: 10
   - Help text: "Concurrent generation requests"

### Bottom Action Buttons
- Reset to Defaults (Gray button)
- 💾 Save AI Settings (Blue button)

---

## Common UI Elements Across All Screens

### Header (Present on all screens)
```
┌────────────────────────────────────────────────────────────────────────────┐
│ ⚡ Ad Orchestrator    📊 Dashboard  ➕ Create  ✓ Approvals  📁 Assets      │
│                       👥 Users  ⚙️ Settings                     🔔² MJ     │
│                                                              Marketing      │
│                                                              Manager        │
│                                                              Admin          │
└────────────────────────────────────────────────────────────────────────────┘
```

### Footer Element (Bottom Right)
```
┌──────────────┐
│   🚀         │
│ Rocket.new   │
└──────────────┘
```

---

## Color Scheme

### Primary Colors
- **Blue (Primary):** #2563EB - Buttons, active states, links
- **Green (Success):** #10B981 - Approved status, positive metrics
- **Yellow (Warning):** #F59E0B - Generating status, warnings
- **Red (Error/Urgent):** #EF4444 - Rejected status, SLA warnings, urgent badges
- **Gray (Neutral):** Various shades for text and backgrounds

### Status Color Coding
- 🔵 **Blue Dot:** Pending Approval
- 🟢 **Green Dot:** Approved / Active
- 🟡 **Yellow Dot:** Generating / In Progress
- 🔴 **Red Dot:** Rejected / Urgent / Overdue
- ⚪ **Gray Dot:** Inactive / Archived

### Badge Colors
- **URGENT** - Red background (#EF4444)
- **SLA** - Red background (#EF4444)
- **HIGH** - Blue background (#2563EB)
- **pending** - Yellow text
- **active** - Green text

---

## Typography

### Font Hierarchy
- **Page Titles:** Large, bold, dark gray/black
- **Section Headers:** Medium, semi-bold
- **Body Text:** Regular weight, medium gray
- **Labels:** Small, uppercase, light gray
- **Metrics:** Large numbers, bold

---

## Interactive Elements

### Buttons
1. **Primary (Blue):** Save AI Settings, Add User, Approve
2. **Secondary (Gray):** Edit, View Details, Reset to Defaults
3. **Destructive (Red):** Reject, Deactivate, Delete
4. **Success (Green):** Activate

### Progress Bars
- **High usage (>80%):** Red
- **Medium usage (50-80%):** Orange/Yellow
- **Low usage (<50%):** Green

### Checkboxes
- Unchecked: White box with gray border
- Checked: Blue box with white checkmark
- Select All: Available at list level

---

## Responsive Grid Layouts

### Campaign List
- Flexible table layout
- Collapsible sidebar for filters
- Pagination at bottom

### Asset Library
- 3-column grid on desktop
- Cards with equal height
- Hover effects on cards

### User Management
- 3-column grid on desktop
- Consistent card sizes
- Clear visual hierarchy

---

## Navigation Patterns

### Breadcrumb (Visible in some screens)
Work > Buddo > BCK Construction...

### URL Structure
```
/ad-orchestrator-ez8bq64.public.builtwithrocket.new
/ad-orchestrator-ez8bq64.public.builtwithrocket.new/Campaign Dashboard
/ad-orchestrator-ez8bq64.public.builtwithrocket.new/Approval Queue Management
/ad-orchestrator-ez8bq64.public.builtwithrocket.new/Campaign Asset Library
```

---

## Data Display Patterns

### Metrics Cards
```
┌─────────────┐
│    Icon     │
│     ##      │
│   Label     │
│   +/- %     │
└─────────────┘
```

### List Items
- Thumbnail/Avatar on left
- Primary info (title/name) bold
- Secondary info below
- Status indicator
- Action buttons on right
- Metadata at bottom

### Progress Indicators
- Horizontal bars with percentage
- Color-coded by status
- Text label showing progress

---

## Empty States

**Shown in Prompt Engineering section:**
- 🖼️ Icon
- "No Previews Yet" message
- Instructional text explaining next steps

---

*Screen-by-Screen Documentation Based on Actual Application Screenshots*
*Version 1.0 - Updated with Visual References*
