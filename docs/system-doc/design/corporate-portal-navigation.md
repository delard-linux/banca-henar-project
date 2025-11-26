# Functional Specification: Corporate Portal and Navigation

**Version:** 1.0  
**Date:** 2025-11-25  
**Author:** D. de la Rosa  
**Status:** Active

---

## Context

- **Application:** Corporate Web Portal (Online Business Banking)
- **Objective:** Define the Landing Page, Access System (Login), and initial navigation structure
- **Scope:** Public Landing Page + Private Area (Dashboard) with restricted access

---

## 1. Public Landing Page (Home)

**Objective:** Attract new corporate clients and allow access for existing ones.

### 1.1. Visual Structure (Layout)

#### Header (Sticky Navigation)
- **Logo:** Banca Henar (BHNR) positioned on the left
- **Public Menu:** Horizontal navigation with links:
  - "Solutions" (anchor to #solutions)
  - "Financing" (anchor to #financing)
  - "Help" (anchor to #help)
- **Primary Button:** "Client Access" → Opens Login page/modal
- **Secondary Button:** "Become a Client" → Direct access to Onboarding Wizard

**Technical Specs:**
- Fixed/sticky header on scroll
- Responsive collapse to hamburger menu on mobile
- Logo dimensions: 40px height
- Header background: White with subtle shadow
- Border: 1px solid slate-200

---

#### Hero Section (Main Banner)

**Layout:** Full-width section with background image and overlay

**Content:**
- **Background Image:** Professional corporate environment
  - File: `bhnr_landing_bg.png`
  - Gradient overlay: `from-white/50 via-white/40 to-white/30`
- **Title:** "Empower your business with Banca Henar"
  - Font: Bold, 36-48px (responsive)
  - Color: Slate-950
- **Subtitle:** "Agile financial solutions designed for companies that never stop. Manage your operations 100% online with expert advice for SMEs and corporates."
  - Font: Regular, 20-24px
  - Color: Slate-800
- **Call to Action (CTA):** Large button "Create Corporate Account"
  - Action: Redirects to `/create-account` (Onboarding Wizard)
  - Style: Primary button (bg-primary-600, hover:bg-primary-700)
  - Size: px-6 py-3 with font-semibold

**Additional Elements:**
- Smart panel with live data mockup:
  - Liquidity: €4.2M available
  - Financing: 12 active projects
  - Logo: BHNR logo in panel header

---

#### Value Proposition Section

**Layout:** 3-column grid (responsive to 1 column on mobile)

**Benefits Cards:**

1. **100% Online Management**
   - **Tag:** "MANAGEMENT"
   - **Icon/Image:** Digital illustration
   - **Description:** "Digital signature, multi-user authorizations and configurable approval workflows."

2. **Customized Financing**
   - **Tag:** "FINANCING"
   - **Icon/Image:** Financial illustration
   - **Description:** "Working capital lines, international guarantees and project finance with agile decision-making."

3. **SME and Midcorp Experts**
   - **Tag:** "EXPERTISE"
   - **Icon/Image:** Expert team illustration
   - **Description:** "Sector-specialized team that understands your business operations."

**Card Styling:**
- White background with border (border-slate-200)
- Rounded corners (rounded-3xl)
- Padding: p-6
- Shadow: subtle elevation

---

#### Expert Support Section

**Layout:** Full-width colored banner

**Content:**
- **Tag:** "EXPERT SUPPORT"
- **Title:** "Need dedicated advice?"
- **Description:** "Our corporate team responds in less than 4 business hours."
- **CTA Button:** "Contact BHNR team"
  - Action: `mailto:corporate@bhnr.com`
  - Style: Primary button

**Styling:**
- Background: Primary-50 (light teal)
- Border: Border-primary-100
- Padding: p-10
- Rounded: rounded-3xl

---

#### Footer

**Layout:** Multi-column responsive footer

**Content:**
- **Copyright:** "© 2025 Banca Henar. All rights reserved."
- **Legal Links:**
  - Privacy Policy
  - Cookies
  - Contact
- **Social Media Icons:** (Future implementation)
  - LinkedIn
  - Twitter/X
  - Email

**Styling:**
- Background: White
- Border-top: 1px solid slate-200
- Text: Small (text-sm), slate-600
- Padding: py-8

---

## 2. Authentication System (Login / Logout)

**Objective:** Control secure access to the private area.

### 2.1. Login Screen

**Access:** Via "Client Access" button in Header  
**Implementation:** Dedicated page at `/auth/login`

#### Form Fields

| Field | Component | Type | Validation | Notes |
|-------|-----------|------|------------|-------|
| **Identifier / Tax ID** | Input Text | Text | Required, Min 5 chars | Company Tax ID (CIF) or Assigned User ID |
| **Password** | Input Password | Password | Required, Min 6 chars | Character masking with show/hide toggle |
| **Remember me** | Checkbox | Boolean | Optional | Saves secure session token (LocalStorage) |

#### Actions

- **Sign In Button:**
  - Validates credentials against backend API
  - If valid → JWT token stored → Redirect to `/app/dashboard`
  - If invalid → Show error message inline
  - Disabled state while submitting

- **Forgot Password Link:**
  - Future implementation
  - Opens password recovery flow

#### UI Specifications

**Layout:**
- Centered card on page
- Max width: 540px (max-w-xl)
- White background with shadow-elevated
- Padding: p-10
- Border: border-slate-200

**Content:**
- **Tag:** "CLIENT ACCESS"
- **Title:** "BHNR Corporate Portal"
- **Subtitle:** "Sign in with your identifier or Tax ID and manage your business operations with enhanced security."

---

### 2.2. Logout Functionality

**Location:** Always available in Private Area Header

**Trigger:**
- "Sign out" button in top-right header
- Profile dropdown menu (future)

**Behavior:**
1. Confirm user intent (optional modal)
2. Call `/api/auth/logout` endpoint
3. Clear JWT token from LocalStorage
4. Clear user state from application
5. Redirect to `/home` (Public Landing Page)

**Security Notes:**
- Invalidate session on server side
- Clear all cached user data
- Log event for audit trail

---

## 3. Private Area (Dashboard) and Navigation Menu

**Objective:** Workspace for the corporate user once authenticated.

### 3.1. Private Header

**Layout:** Full-width sticky header

**Components:**

| Section | Content | Position | Behavior |
|---------|---------|----------|----------|
| **Logo** | BHNR logo + "Banca Henar Business" | Left | Link to `/app/dashboard` |
| **User Info** | "Hello, [User Name] — [Company]" | Center-left | Static display |
| **Email Badge** | `user@company.com` | Center-right | Read-only (hidden on mobile) |
| **Notifications** | Bell icon with badge | Right | Inactive (future feature) |
| **Logout Button** | "Sign out" | Far right | Triggers logout flow |

**Styling:**
- Background: White (bg-white/90 with backdrop-blur)
- Border-bottom: 1px solid slate-200
- Height: ~80px
- Text: User info as "Corporate Panel" label + personalized greeting

---

### 3.2. Sidebar Menu

**Layout:** Fixed left sidebar (272px width on desktop, collapsible on mobile)

**Behavior:**
- Collapsible categories with chevron indicators
- Active state highlighted with primary color
- Hover effects for better UX
- Scrollable if content overflows

---

#### Menu Structure

```
📊 Home / Summary [ACTIVE]
   └─ Main Dashboard (default view)

💳 Accounts & Cards [INACTIVE - Coming Soon]
   └─ Placeholder badge

⚙️ Operations [COLLAPSIBLE]
   └─ > Company Registration
      Action: Opens 3-step Onboarding Wizard
      Route: /app/onboarding/create-account OR /create-account
      Context: Allows onboarding new subsidiaries or completing profile

💰 Financing [INACTIVE - Coming Soon]
   └─ Placeholder badge

📄 Documentation [INACTIVE - Coming Soon]
   └─ Placeholder badge

⚙️ Settings [INACTIVE - Coming Soon]
   └─ Placeholder badge
```

---

#### Menu Item States

**Active State:**
- Background: primary-50
- Border-left: 4px solid primary-600
- Text: primary-800, font-semibold
- Icon: primary-600

**Hover State:**
- Background: slate-50
- Text: primary-700
- Smooth transition (transition-colors)

**Inactive/Disabled State:**
- Text: slate-400
- Background: white with border-slate-200
- Cursor: not-allowed
- Badge: "Coming soon" in slate-500

**Collapsible Categories:**
- Chevron icon rotates 180deg when expanded
- Nested items indented (pl-7)
- Smooth animation (transition-transform)

---

### 3.3. Main Content Area

**Layout:** Fills remaining space to the right of sidebar

**Specifications:**
- Background: white
- Padding: px-6 py-8
- Min-height: calc(100vh - header height)
- Responsive: Full width on mobile (sidebar collapses)

**Content:**
- Dynamic based on route
- Default: Dashboard summary view
- Router outlet renders active component

---

## 4. User Flow Diagram

```
┌─────────────────────────────────────────┐
│     User lands on Landing Page          │
│     (/)                                  │
└───────────┬─────────────────────────────┘
            │
            ├──────────────┬───────────────┐
            │              │               │
            ▼              ▼               ▼
    "Become a Client"  "Client Access"  Browse content
            │              │
            │              │
            ▼              ▼
    Onboarding Wizard  Login Page
    (/create-account)  (/auth/login)
            │              │
            │              ├─[Invalid]→ Error message
            │              │
            │              ▼[Valid credentials]
            │         JWT Token stored
            │              │
            └──────────────┼───────────────┐
                           │               │
                           ▼               │
                    Dashboard Home         │
                    (/app/dashboard)       │
                           │               │
                           │               │
            ┌──────────────┴───────────┐   │
            │                          │   │
            ▼                          ▼   │
    Navigate to "Operations"    Other sections
            │                    (Inactive)
            ▼
    "Company Registration"
            │
            ▼
    Onboarding Wizard
    (Step 1 → Step 2 → Step 3)
            │
            ▼
    Submit & Sign Contract
            │
            ▼
    Success Page / Dashboard
```

---

## 5. Routing Structure

### Public Routes (No Auth Required)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` or `/home` | LandingPageComponent | Home page with hero and CTAs |
| `/auth/login` | LoginComponent | Authentication form |
| `/create-account` | OnboardingComponent | 3-step wizard (public access) |

### Private Routes (Auth Required)

| Route | Component | Purpose | Guard |
|-------|-----------|---------|-------|
| `/app` | DashboardLayoutComponent | Layout wrapper | authGuard |
| `/app/dashboard` | DashboardComponent | Main dashboard view | authGuard |
| `/app/onboarding/*` | OnboardingComponent | Internal wizard access | authGuard |

---

## 6. Responsive Behavior

### Breakpoints

- **Mobile:** `< 768px`
- **Tablet:** `768px - 1023px`
- **Desktop:** `≥ 1024px`

### Mobile Adaptations

**Landing Page:**
- Hero: Single column, reduced font sizes
- Value cards: Stack vertically
- Header menu: Hamburger collapse

**Dashboard:**
- Sidebar: Hidden by default, toggle button in header
- Header: Simplified (hide email badge)
- Content: Full-width with reduced padding

**Forms (Wizard):**
- Two-column grids collapse to single column
- Larger touch targets (min 44px)
- Progress bar remains visible but compact

---

## 7. Color Palette & Branding

### Primary Colors
- **Primary-600:** `#0d9488` (Turquesa/Teal)
- **Primary-700:** `#0f766e` (Darker Turquesa)
- **Primary-50:** `#f0fdfa` (Very light background)

### Neutral Colors
- **White:** `#ffffff` (Backgrounds)
- **Slate-900:** `#0f172a` (Primary text)
- **Slate-600:** `#475569` (Secondary text)
- **Slate-200:** `#e2e8f0` (Borders)

### Semantic Colors
- **Success:** Green-600 (for confirmations)
- **Error:** Rose-600 (for validation errors)
- **Warning:** Amber-600 (for alerts)
- **Info:** Blue-600 (for informational messages)

---

## 8. Accessibility Requirements

### WCAG 2.1 AA Compliance

- **Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation:** All interactive elements accessible via Tab
- **Focus Indicators:** Visible focus outlines (ring-2 ring-primary-600)
- **ARIA Labels:** Proper labeling for screen readers
- **Semantic HTML:** Use appropriate tags (`<nav>`, `<main>`, `<header>`, etc.)

### Specific Implementations

- Skip to main content link
- Alt text for all images
- Proper heading hierarchy (H1 → H6)
- Form field labels associated with inputs
- Error messages announced to screen readers

---

## 9. Performance Targets

- **First Contentful Paint (FCP):** < 1.5s
- **Time to Interactive (TTI):** < 3.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1

### Optimization Strategies
- Lazy loading for images
- Code splitting by route
- Minification and compression (gzip/brotli)
- CDN for static assets
- Service Worker for offline capability (future)

---

## 10. Security Considerations

### Authentication
- JWT tokens with short expiry (15-30 min)
- Refresh token mechanism (7 days)
- Secure HttpOnly cookies option
- HTTPS only in production

### Authorization
- Role-based access control (RBAC)
- Permission checks on API endpoints
- Frontend route guards (authGuard)
- Audit logging for sensitive actions

### Data Protection
- No sensitive data in localStorage without encryption
- CSRF protection on forms
- Content Security Policy (CSP) headers
- Regular security audits and penetration testing

---

## Change Control

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2025-11-25 | D. de la Rosa | Initial draft document |

---

## Related Documents
- [Create Corporate Account Specification](./create-corporate-account.md)
- [Authentication API](../api/auth-api.md)
- [Design System](../design/design-system.md)
- [Security Policy](../security/security-policy.md)
