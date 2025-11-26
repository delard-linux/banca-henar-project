# Functional Specification: Authentication System

**Version:** 1.0  
**Date:** 2025-11-26  
**Author:** D. de la Rosa  
**Status:** Active

---

## Context

- **Application:** Banca Henar (BHNR) Corporate Web Portal
- **Objective:** Secure authentication and session management for corporate users
- **Scope:** Login, Logout, Session Management, and Access Control

---

## 1. Authentication Overview

### 1.1. Purpose

The authentication system controls secure access to the private corporate area, ensuring that only authorized users can:
- Access dashboard and corporate features
- Manage company operations
- View sensitive financial information
- Execute transactions and approvals

### 1.2. Authentication Flow

```
Public Landing Page
       ↓
Click "Client Access"
       ↓
Login Screen (/auth/login)
       ↓
[Enter Credentials]
       ↓
Backend Validation
       ↓
   ┌─────────┴─────────┐
   │                   │
   ▼ Valid             ▼ Invalid
JWT Token          Error Message
LocalStorage       "Invalid credentials"
   ↓
Redirect to Dashboard
(/app/dashboard)
   ↓
Access Granted
```

---

## 2. Login Screen

### 2.1. Access Points

**Primary Entry:**
- Click "Client Access" button in public header
- Route: `/auth/login`
- Component: `LoginComponent`

**Alternative Entry:**
- Direct URL access: `https://portal.bhnr.com/auth/login`
- Redirect after logout
- Redirect when attempting to access protected routes without authentication

---

### 2.2. UI Layout and Design

#### Page Structure

**Container:**
- Centered card on page
- Max width: 540px (`max-w-xl`)
- White background with elevated shadow
- Rounded corners: `rounded-3xl`
- Padding: `p-10`
- Border: `border border-slate-200`

**Background:**
- Full viewport height container
- Light background color: `bg-slate-50` or white
- Centered flex layout

---

### 2.3. Form Fields

#### Field Specifications

| Field | Component | Type | Placeholder | Validation | Required |
|-------|-----------|------|-------------|------------|----------|
| **Identifier / Tax ID** | Input Text | text | "ES12345678" | • Min 5 chars<br>• Alphanumeric<br>• Trim whitespace | ✓ |
| **Password** | Input Password | password | "••••••••" | • Min 6 chars<br>• Secure masking | ✓ |
| **Remember me** | Checkbox | boolean | - | - | ✗ |

---

#### Field Details

**1. Identifier / Tax ID**
```typescript
{
  name: 'identifier',
  type: 'text',
  label: 'Identifier / Tax ID',
  placeholder: 'ES12345678',
  validators: [
    Validators.required,
    Validators.minLength(5)
  ],
  errorMessages: {
    required: 'This field is required (minimum 5 characters)',
    minLength: 'Minimum 5 characters required'
  }
}
```

**Purpose:** Company Tax ID (CIF/NIF) or Assigned User Identifier  
**Format:** Accepts both:
- Spanish Tax ID: `B12345678` (CIF format)
- User ID: Custom alphanumeric identifier
- International formats for non-Spanish entities

**Behavior:**
- Trim whitespace on blur
- Convert to uppercase (optional for CIF format)
- Show inline error on blur if invalid
- Clear error on focus

---

**2. Password**
```typescript
{
  name: 'password',
  type: 'password',
  label: 'Password',
  placeholder: '••••••••',
  validators: [
    Validators.required,
    Validators.minLength(6)
  ],
  features: {
    showHideToggle: true,  // Eye icon to reveal password
    autocomplete: 'current-password'
  },
  errorMessages: {
    required: 'Enter your corporate password',
    minLength: 'Password must be at least 6 characters'
  }
}
```

**Purpose:** Secure password authentication  
**Features:**
- Character masking by default (`type="password"`)
- Show/Hide toggle button (eye icon)
  - Click to reveal: Changes to `type="text"`
  - Click to hide: Returns to `type="password"`
- Autocomplete enabled for password managers
- No password strength requirements on login (only on registration/reset)

**Behavior:**
- Never trim password (preserve exact input)
- Show inline error on blur if invalid
- Clear error on focus
- Disable paste (optional security measure)

---

**3. Remember Me**
```typescript
{
  name: 'remember',
  type: 'checkbox',
  label: 'Remember secure session',
  defaultValue: true
}
```

**Purpose:** Extended session persistence  
**Behavior:**
- **Checked (default):** Stores JWT token in LocalStorage
  - Session persists across browser restarts
  - Token valid for 7 days (configurable)
  - User remains logged in until manual logout or token expiry
  
- **Unchecked:** Stores JWT token in SessionStorage
  - Session cleared when browser/tab closes
  - Token valid for current session only
  - Higher security for shared devices

**Security Note:**
- Still requires periodic token refresh
- Sensitive operations may require re-authentication
- Session activity monitored for anomalies

---

### 2.4. Form Actions

#### Submit Button

**Label:** "Sign In" (default) / "Validating..." (submitting)

**States:**

1. **Default State**
   - Enabled when form is valid
   - Background: `bg-primary-600`
   - Text: `text-white`
   - Hover: `hover:bg-primary-700`
   - Full width: `w-full`
   - Padding: `px-6 py-3`
   - Font: `font-semibold text-lg`

2. **Disabled State**
   - When form is invalid or submitting
   - Background: `bg-slate-300`
   - Text: `text-slate-500`
   - Cursor: `cursor-not-allowed`
   - No hover effect

3. **Loading State**
   - During API call
   - Label changes to "Validating..."
   - Optional spinner icon
   - Disabled interaction

**Click Behavior:**
```typescript
async handleSubmit() {
  if (form.invalid) {
    form.markAllAsTouched();
    return;
  }

  isSubmitting.set(true);

  try {
    const response = await authService.login({
      identifier: form.value.identifier,
      password: form.value.password,
      remember: form.value.remember
    });

    // Store token based on remember preference
    if (form.value.remember) {
      localStorage.setItem('auth_token', response.token);
    } else {
      sessionStorage.setItem('auth_token', response.token);
    }

    // Redirect to dashboard
    router.navigate(['/app/dashboard']);

  } catch (error) {
    if (error.status === 401) {
      showError('Invalid credentials. Please try again.');
    } else if (error.status === 429) {
      showError('Too many attempts. Please wait 5 minutes.');
    } else {
      showError('Connection error. Please try again.');
    }
  } finally {
    isSubmitting.set(false);
  }
}
```

---

#### Forgot Password Link

**Label:** "Forgot your password?"  
**Position:** Below submit button, right-aligned  
**Style:**
- Text: `text-sm`
- Color: `text-primary-700 hover:text-primary-900`
- Underline on hover

**Action:**
- Navigate to `/auth/forgot-password` (future implementation)
- Opens password recovery flow:
  1. Enter email/identifier
  2. Receive recovery code via email
  3. Verify code
  4. Set new password
  5. Redirect to login

**Current State:** Link present but not functional (Future Scope)

---

### 2.5. Content and Messaging

#### Header Section

**Tag:**
- Text: "CLIENT ACCESS"
- Style: `text-sm uppercase tracking-[0.4em] text-primary-600`
- Position: Above title

**Title:**
- Text: "BHNR Corporate Portal"
- Style: `text-3xl font-semibold text-slate-900`
- Margin: `mt-3`

**Subtitle:**
- Text: "Sign in with your identifier or Tax ID and manage your business operations with enhanced security."
- Style: `text-slate-600`
- Margin: `mt-2`

---

### 2.6. Validation and Error Handling

#### Client-Side Validation

**Real-Time Validation:**
- Validate on blur (when user leaves field)
- Clear errors on focus (when user enters field)
- Show errors below field in red text (`text-rose-600`)

**Error Display:**
```html
<p class="mt-2 text-sm text-rose-600" *ngIf="shouldShowError('identifier')">
  This field is required (minimum 5 characters).
</p>
```

**Validation Logic:**
```typescript
shouldShowError(controlName: string): boolean {
  const control = form.controls[controlName];
  return control.invalid && (control.touched || control.dirty);
}
```

---

#### Server-Side Validation

**Error Responses:**

| Status Code | Error Type | User Message | Action |
|-------------|------------|--------------|--------|
| **400** | Bad Request | "Invalid credentials format" | Show inline error |
| **401** | Unauthorized | "Invalid identifier or password. Please try again." | Clear password field |
| **403** | Forbidden | "Account locked. Contact support." | Show support contact |
| **429** | Too Many Requests | "Too many login attempts. Please wait 5 minutes." | Disable form temporarily |
| **500** | Server Error | "Service temporarily unavailable. Please try again." | Show retry button |

**Error Display:**
- Show below form, above submit button
- Red background: `bg-rose-50`
- Red border: `border-rose-200`
- Red text: `text-rose-700`
- Icon: ⚠️ Alert triangle
- Dismissible with X button

**Example:**
```html
<div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 mt-4" *ngIf="loginError()">
  <div class="flex items-start gap-3">
    <span class="text-rose-500">⚠️</span>
    <div class="flex-1">
      <p class="text-sm text-rose-700 font-semibold">{{ loginError() }}</p>
    </div>
    <button (click)="clearError()" class="text-rose-500 hover:text-rose-700">×</button>
  </div>
</div>
```

---

### 2.7. Security Features

#### Rate Limiting
- **Client Side:** Disable submit after 3 failed attempts for 30 seconds
- **Server Side:** Block IP after 5 failed attempts for 5 minutes
- **Account Level:** Lock account after 10 failed attempts in 24 hours

#### Password Security
- Never log passwords in plain text
- Use HTTPS only (enforce in production)
- Passwords hashed with bcrypt (min 10 rounds)
- No password hints or retrieval

#### Session Security
- JWT tokens with short expiry (15-30 minutes)
- Refresh token mechanism (7 days for "remember me")
- Token rotation on refresh
- Logout invalidates all tokens

#### CSRF Protection
- CSRF token in all state-changing requests
- SameSite cookie attribute
- Origin/Referer header validation

---

## 3. Logout Functionality

### 3.1. Access Points

**Primary:**
- "Sign out" button in private header (top-right)
- Always visible in authenticated area

**Automatic:**
- Token expiry (if no refresh)
- Session timeout (30 minutes inactivity)
- Security events (suspicious activity detected)

---

### 3.2. Logout Flow

```
User clicks "Sign out"
       ↓
[Optional] Confirmation dialog
       ↓
Call /api/auth/logout
       ↓
Server invalidates token
       ↓
Clear LocalStorage/SessionStorage
       ↓
Reset application state
       ↓
Redirect to Landing Page (/)
       ↓
Show success message (toast)
"Successfully signed out"
```

---

### 3.3. Implementation Details

#### Button Specification

**Location:** Private area header, far right

**Style:**
- Background: `bg-primary-600`
- Text: `text-white font-semibold`
- Size: `px-4 py-2`
- Rounded: `rounded-full`
- Hover: `hover:bg-primary-700`

**Label:** "Sign out" (English) / "Cerrar sesión" (Spanish)

---

#### Logout Logic

```typescript
async handleLogout(): Promise<void> {
  try {
    // Optional: Show confirmation dialog
    const confirmed = await confirmDialog({
      title: 'Sign out',
      message: 'Are you sure you want to sign out?',
      confirmLabel: 'Sign out',
      cancelLabel: 'Cancel'
    });

    if (!confirmed) return;

    // Call logout API
    await authService.logout();

    // Clear tokens
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');

    // Clear user state
    authService.clearUserState();

    // Redirect to home
    router.navigate(['/home']);

    // Show success message
    toastService.success('Successfully signed out');

  } catch (error) {
    // Even if API fails, still logout client-side
    console.error('Logout error:', error);
    
    // Force client-side cleanup
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect anyway
    router.navigate(['/home']);
  }
}
```

---

#### Server-Side Actions

**Endpoint:** `POST /api/auth/logout`

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session terminated successfully"
}
```

**Server Actions:**
1. Validate token from request
2. Add token to blacklist/revocation list
3. Invalidate refresh tokens
4. Log logout event (audit trail)
5. Return success response

---

### 3.4. Session Cleanup

**Client-Side Cleanup:**
```typescript
function clearSession(): void {
  // Remove tokens
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.clear();

  // Clear user state
  userSignal.set(null);
  
  // Clear cached data
  cacheService.clear();
  
  // Reset form states
  resetAllForms();
  
  // Clear sensitive data from memory
  sensitiveDataStore.clear();
}
```

**What Gets Cleared:**
- Authentication tokens (JWT, refresh)
- User profile data
- Cached API responses
- Form data (if sensitive)
- Session preferences (optional)

**What Gets Preserved:**
- UI theme preference (optional)
- Language selection (optional)
- Non-sensitive settings

---

### 3.5. Post-Logout Behavior

#### Landing Page Display
- User redirected to `/home`
- Login button visible in header
- No user information displayed
- All protected routes inaccessible

#### Success Feedback
- Toast notification: "Successfully signed out"
- Auto-dismiss after 3 seconds
- Green checkmark icon
- Positioned top-right

#### Re-Authentication
- User can immediately log back in
- No cooldown period (unless rate limited)
- Previous session data not restored
- Fresh session created on next login

---

## 4. Session Management

### 4.1. Token Strategy

#### Access Token (JWT)
```typescript
interface AccessToken {
  sub: string;           // User ID
  iat: number;           // Issued at
  exp: number;           // Expiry (15-30 min)
  company: string;       // Company ID
  role: string;          // User role
  permissions: string[]; // Specific permissions
}
```

**Storage:** 
- LocalStorage (if "remember me" checked)
- SessionStorage (if not checked)

**Expiry:** 15-30 minutes

**Usage:** Included in Authorization header for all API requests

---

#### Refresh Token
```typescript
interface RefreshToken {
  sub: string;      // User ID
  iat: number;      // Issued at
  exp: number;      // Expiry (7 days)
  tokenFamily: string; // Token rotation family
}
```

**Storage:** HttpOnly cookie (more secure)

**Expiry:** 7 days (if "remember me")

**Usage:** Exchange for new access token when expired

---

### 4.2. Token Refresh Flow

```
Access Token Expires
       ↓
API request returns 401
       ↓
Interceptor detects expiry
       ↓
Call /api/auth/refresh
       ↓
   ┌─────────┴─────────┐
   │                   │
   ▼ Valid             ▼ Invalid
New Access Token    Refresh Expired
Store in Storage    Clear Session
       ↓            Redirect to Login
Retry Original Request
       ↓
Continue Normal Flow
```

**Implementation:**
```typescript
async refreshToken(): Promise<string> {
  const response = await http.post('/api/auth/refresh', {
    refreshToken: getRefreshToken()
  });

  // Store new access token
  const newToken = response.data.accessToken;
  localStorage.setItem('auth_token', newToken);

  // Optional: Rotate refresh token
  if (response.data.refreshToken) {
    setRefreshToken(response.data.refreshToken);
  }

  return newToken;
}
```

---

### 4.3. Inactivity Timeout

**Configuration:**
- Warning at: 25 minutes of inactivity
- Logout at: 30 minutes of inactivity
- Configurable per security policy

**Activity Detection:**
- Mouse movement
- Keyboard input
- Touch events
- API requests

**Warning Dialog:**
```typescript
interface InactivityWarning {
  title: "Session expiring soon";
  message: "You will be logged out in 5 minutes due to inactivity.";
  actions: [
    {
      label: "Stay signed in",
      action: refreshSession
    },
    {
      label: "Sign out now",
      action: logout
    }
  ];
}
```

---

### 4.4. Multi-Tab/Window Behavior

**Single Session Strategy:**
- Login in one tab logs in all tabs (shared localStorage)
- Logout in one tab logs out all tabs
- Token refresh in one tab updates all tabs

**Implementation:**
```typescript
// Listen for storage changes
window.addEventListener('storage', (event) => {
  if (event.key === 'auth_token') {
    if (event.newValue === null) {
      // Token removed - logout this tab
      handleLogoutEvent();
    } else {
      // Token updated - refresh this tab
      handleTokenUpdate(event.newValue);
    }
  }
});
```

**Broadcast Channel API (modern browsers):**
```typescript
const authChannel = new BroadcastChannel('auth_channel');

// Broadcast logout
authChannel.postMessage({ type: 'LOGOUT' });

// Listen for logout
authChannel.onmessage = (event) => {
  if (event.data.type === 'LOGOUT') {
    handleLogoutInThisTab();
  }
};
```

---

## 5. Route Guards and Access Control

### 5.1. Authentication Guard

**Purpose:** Protect private routes from unauthorized access

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store intended URL for redirect after login
  authService.setRedirectUrl(state.url);
  
  // Redirect to login
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

**Usage:**
```typescript
{
  path: 'app',
  canActivate: [authGuard],
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'onboarding', component: OnboardingComponent }
  ]
}
```

---

### 5.2. Role-Based Access

**Future Implementation:**

```typescript
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const userRole = authService.getUserRole();

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirect to unauthorized page
    return router.createUrlTree(['/403']);
  };
};
```

**Usage:**
```typescript
{
  path: 'admin',
  canActivate: [authGuard, roleGuard(['ADMIN', 'MANAGER'])]
}
```

---

## 6. Error Scenarios and Edge Cases

### 6.1. Network Errors

**Scenario:** API unavailable during login

**Handling:**
- Show error: "Connection error. Please check your internet connection."
- Retry button available
- Credentials preserved in form
- Log error to monitoring service

---

### 6.2. Expired Session

**Scenario:** User's session expires during active use

**Handling:**
1. Attempt automatic token refresh
2. If refresh fails:
   - Save current form data (if appropriate)
   - Show modal: "Your session has expired. Please log in again."
   - Redirect to login with return URL
   - Restore form data after successful login

---

### 6.3. Account Locked

**Scenario:** Too many failed login attempts

**Handling:**
- Show error: "Account temporarily locked due to multiple failed attempts."
- Display unlock time: "Please try again in 5 minutes."
- Provide support contact: "Need help? Contact corporate@bhnr.com"
- Log security event

---

### 6.4. Concurrent Sessions

**Scenario:** User logs in from another device/location

**Options:**

**Option A: Allow Multiple Sessions**
- Default behavior
- User can be logged in from multiple devices
- Each device has independent session

**Option B: Single Session Only**
- New login terminates previous session
- Previous device shows: "You have been logged out because you signed in from another device."
- User must log in again

**Configuration:** Set in security policy

---

## 7. Accessibility (WCAG 2.1 AA)

### 7.1. Form Accessibility

- All inputs have associated `<label>` elements
- Error messages linked with `aria-describedby`
- Focus management on error (focus first invalid field)
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader announcements for errors

### 7.2. ARIA Attributes

```html
<input
  type="text"
  id="identifier"
  name="identifier"
  aria-label="Identifier or Tax ID"
  aria-required="true"
  aria-invalid="{{ hasError }}"
  aria-describedby="identifier-error"
/>

<p id="identifier-error" class="error" aria-live="polite">
  {{ errorMessage }}
</p>
```

---

## 8. Analytics and Monitoring

### 8.1. Events to Track

**Login Events:**
- `login_attempt` - User submits login form
- `login_success` - Successful authentication
- `login_failure` - Failed authentication (with reason)
- `login_blocked` - Too many attempts

**Logout Events:**
- `logout_initiated` - User clicks sign out
- `logout_success` - Successful logout
- `session_expired` - Automatic logout due to inactivity
- `token_expired` - Token expiry without refresh

**Session Events:**
- `session_started` - New session created
- `session_refreshed` - Token refreshed
- `session_activity` - User activity detected
- `session_timeout_warning` - Inactivity warning shown

---

### 8.2. Security Monitoring

**Alerts for:**
- Multiple failed login attempts from single IP
- Login from unusual location/device
- Login outside business hours
- Multiple concurrent sessions
- Token reuse attempts
- Suspicious API patterns

---

## 9. Testing Requirements

### 9.1. Unit Tests

- Form validation logic
- Token storage/retrieval
- Error handling
- Guard logic
- State management

### 9.2. Integration Tests

- Complete login flow
- Complete logout flow
- Token refresh mechanism
- Multi-tab behavior
- Route protection

### 9.3. E2E Tests

```typescript
test('User can login and logout', async () => {
  // Navigate to login
  await page.goto('/auth/login');
  
  // Fill form
  await page.fill('[name="identifier"]', 'B12345678');
  await page.fill('[name="password"]', 'TestPassword123');
  await page.check('[name="remember"]');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verify redirect to dashboard
  await expect(page).toHaveURL('/app/dashboard');
  
  // Verify user info displayed
  await expect(page.locator('.user-greeting')).toContainText('Hello');
  
  // Logout
  await page.click('button:has-text("Sign out")');
  
  // Verify redirect to home
  await expect(page).toHaveURL('/home');
  
  // Verify token cleared
  const token = await page.evaluate(() => localStorage.getItem('auth_token'));
  expect(token).toBeNull();
});
```

---

## 10. Future Enhancements

### 10.1. Planned Features

- **Social Login:** OAuth integration (Google, Microsoft)
- **Two-Factor Authentication (2FA):** SMS or authenticator app
- **Biometric Authentication:** Face ID, Touch ID for mobile
- **Single Sign-On (SSO):** SAML integration for enterprise
- **Password Policies:** Complexity requirements, expiry, history
- **Account Recovery:** Email/SMS based recovery flow
- **Security Questions:** Additional verification for sensitive operations

### 10.2. Advanced Security

- **Device Fingerprinting:** Track known devices
- **Geolocation Verification:** Alert on unusual locations
- **Risk-Based Authentication:** Additional verification for high-risk actions
- **Behavioral Analytics:** Detect anomalous user behavior

---

## Change Control

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2025-11-26 | D. de la Rosa | Initial authentication specification |

---

## Related Documents

- [Corporate Portal and Navigation](./corporate-portal-navigation.md)
- [Create Corporate Account](./create-corporate-account.md)
- [Security Policy](../security/security-policy.md)
- [API Specification - Auth Endpoints](../api/auth-api.md)
