# Functional Specification: Create Corporate Account (B2B)

**Version:** 1.0  
**Date:** 2025-11-25  
**Author:** D. de la Rosa  
**Status:** Active

---

## Context

- **Application:** Banca Henar (BHNR) Banking Application
- **Platform:** Web/Tablet
- **Objective:** Data capture for corporate entity onboarding (Legal Person)
- **Format:** Sequential 3-step wizard

---

## General Wizard Structure

### Progress Indicator

- Must clearly indicate which step the user is on (1/3, 2/3, 3/3)
- Visual progress bar showing completed and current steps

### Navigation Controls

#### Next Button

- **State:** Disabled until all mandatory fields in the current step are valid
- **Action:** Advances to next step, persisting current data
- **Label:** "Continue" (Steps 1-2) / "Finalize and Sign Contract" (Step 3)

#### Back Button

- **Visibility:** Steps 2-3 only
- **Action:** Returns to previous step without losing data
- **Label:** "Back"

#### Save Draft Button

- **Visibility:** Optional but recommended
- **Action:** Saves current progress for later completion
- **Label:** "Save Draft"

#### Cancel Button

- **Visibility:** All steps
- **Action:** Exits wizard with confirmation dialog
- **Label:** "Cancel"

---

## Step 1: Corporate Identity and Activity

**Objective:** Legally identify the company and its economic nature.

### Form Fields

| Field | Component | Data Type | Size | Required | Validation Rules |
|-------|-----------|-----------|------|----------|------------------|
| **Tax ID (CIF/NIF)** | Input Text | Alphanumeric | 9 chars | ✓ | • Robust algorithmic validation<br>• Control digit verification by entity type<br>• Async query to check existing client in BHNR DB<br>• Format: Letter + 7 digits + Control |
| **Legal Name** | Input Text | Text | Max 150 | ✓ | • Must match incorporation deeds exactly<br>• Special chars allowed: `&`, `-`, `.`, `,` |
| **Trade Name** | Input Text | Text | Max 100 | ✗ | • If empty, send `null` |
| **Incorporation Date** | Datepicker | Date | DD/MM/YYYY | ✓ | • Cannot be future date<br>• Cannot be earlier than 1800-01-01 |
| **Legal Nature** | Select Dropdown | Selection | - | ✓ | • Options: S.A., S.L., Cooperative, Joint Venture, Association, Other<br>• Default: "Select" |
| **Activity Code (CNAE)** | Searchable Select | Code | 4 digits | ✓ | • Autocomplete from official CNAE list<br>• Search by text (e.g., "Hospitality") or code<br>• Pattern: `^\d{4}$` |
| **Corporate Purpose** | Textarea | Text | Max 500 | ✓ | • Brief description of actual activity<br>• Character counter displayed |
| **Tax Residence Country** | Select Dropdown | ISO Code | 2 chars | ✓ | • Pre-selection: Spain (ES)<br>• Alert for high-risk countries: "Additional documentation required" |

### Business Rules

1. **Tax ID Validation:**
   - Spanish CIF pattern: `^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$`
   - Spanish NIE pattern: `^[XYZ]\d{7}[A-Z]$`
   - Spanish NIF pattern: `^\d{8}[A-Z]$`
   - Implement control digit algorithm verification

2. **Duplicate Prevention:**
   - On Tax ID blur/change, trigger async validation
   - If exists, show error: "Company already registered in BHNR"
   - Provide link to login or contact support

3. **Tax Haven Alert:**
   - Maintain list of high-risk countries
   - Display warning banner if selected
   - Flag account for additional KYC review

---

## Step 2: Location and Contact

**Objective:** Establish the fiscal/operational headquarters and communication channels.

### UX Enhancement

- **Google Places API Integration:** Optional address search helper at the top
- On selection, auto-populate: Street Type, Street Name, Number, Zip, City, Province

### Location Fields

| Field | Component | Data Type | Size | Required | Validation Rules |
|-------|-----------|-----------|------|----------|------------------|
| **Address Search** | Search Input | Text | - | ✗ | • Helper tool only<br>• Google Places API integration |
| **Street Type** | Select Dropdown | Text | - | ✓ | • Options: Street, Avenue, Square, Boulevard, Industrial Estate, Plaza, Road |
| **Street Name** | Input Text | Text | Max 100 | ✓ | • Standard text validation |
| **Number/Block** | Input Text | Alphanumeric | Max 10 | ✓ | • Allows letters for blocks (e.g., "12B") |
| **Floor/Door** | Input Text | Alphanumeric | Max 10 | ✗ | • Format examples: "3A", "Planta 2" |
| **Zip/Postal Code** | Input Text | Numeric | 5 digits | ✓ | • Pattern: `^\d{5}$` (Spain)<br>• On 5-digit entry, auto-populate City/Province |
| **City/Locality** | Input Text | Text | Max 50 | ✓ | • Editable autocomplete from zip lookup |
| **Province/State** | Input Text | Text | Max 50 | ✓ | • Blocked autocomplete or Select<br>• Auto-populated from zip |
| **Different Mailing Address?** | Checkbox/Switch | Boolean | - | ✗ | • Default: `false`<br>• If `true`: Show sub-form with same address fields |
| **Contact Phone** | Input Tel | Numeric | 9-15 digits | ✓ | • International prefix validation<br>• Default prefix: +34 (Spain) |
| **Corporate Email** | Input Email | Email | Max 100 | ✓ | • Standard email regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`<br>• Block temporary email domains |
| **Confirm Email** | Input Email | Email | Max 100 | ✓ | • Must match Corporate Email exactly<br>• Disable paste functionality |
| **Website** | Input URL | URL | Max 200 | ✗ | • Pattern: `^https?://.*`<br>• Validate reachable domain (optional) |

### Address Validation Rules

1. **Zip Code Autocomplete (Spain only):**
   - Maintain local zip code database
   - On 5-digit completion, query city/province
   - Allow manual override if data incomplete

2. **Email Validation:**
   - Real-time validation on blur
   - Block known temporary email services (10minutemail, guerrillamail, etc.)
   - Show warning: "Corporate emails required"

3. **Phone Number Formatting:**
   - Auto-format with spaces: "+34 912 345 678"
   - Validate international prefixes against ISO list
   - Display formatted value, store normalized (no spaces)

4. **Mailing Address:**
   - If checkbox enabled, clone form structure
   - Independent validation for mailing address
   - Allow different country for mailing address

---

## Step 3: Legal Representatives and Economic Data (KYC)

**Objective:** Identify the signer (Representative) and establish financial profile for Anti-Money Laundering (AML) prevention.

---

### Section A: Legal Representative (Main Proxy)

| Field | Component | Data Type | Size | Required | Validation Rules |
|-------|-----------|-----------|------|----------|------------------|
| **Document Type** | Select Dropdown | Text | - | ✓ | • Options: National ID (DNI), Alien ID (NIE), Passport |
| **Document Number** | Input Text | Alphanumeric | Variable | ✓ | • Format validation by type:<br>&nbsp;&nbsp;- DNI: `^\d{8}[A-Z]$`<br>&nbsp;&nbsp;- NIE: `^[XYZ]\d{7}[A-Z]$`<br>&nbsp;&nbsp;- Passport: Alphanumeric |
| **First Name** | Input Text | Text | Max 50 | ✓ | • No numbers allowed<br>• Special chars: `-`, `'`, spaces |
| **Last Name** | Input Text | Text | Max 50 | ✓ | • Same as First Name validation |
| **Second Last Name** | Input Text | Text | Max 50 | Conditional | • Optional by default<br>• **Mandatory if Document Type = DNI** |
| **Role/Position** | Select Dropdown | Text | - | ✓ | • Options: Sole Administrator, CEO, Joint Proxy, Solidary Proxy |
| **Is PEP?** | Radio Button | Boolean | - | ✓ | • Options: Yes / No<br>• If "Yes": Show textarea for public office details |
| **Public Office** | Textarea | Text | Max 300 | Conditional | • Visible only if PEP = Yes<br>• Describe position and dates |
| **Attach ID (Front)** | File Upload | File | Max 5MB | ✓ | • Formats: `.jpg`, `.png`, `.pdf`<br>• Image quality check recommended |
| **Attach ID (Back)** | File Upload | File | Max 5MB | Conditional | • **Not required for Passport**<br>• Formats: `.jpg`, `.png`, `.pdf` |
| **Attach Powers of Attorney** | File Upload | PDF | Max 10MB | ✓ | • Format: `.pdf` only<br>• Must be notarized document |
| **Deed of Incorporation** | File Upload | PDF | Max 15MB | ✓ | • Format: `.pdf` only<br>• Complete incorporation document |

### Business Rules (Section A)

1. **PEP Detection:**
   - If PEP = Yes, trigger enhanced due diligence workflow
   - Flag account for manual compliance review
   - Store public office details in audit log

2. **Document Validation:**
   - DNI: Validate control letter algorithm
   - NIE: Validate X/Y/Z prefix and control letter
   - Passport: Store issuing country

3. **File Upload Security:**
   - Scan all uploads for malware
   - Validate file integrity (not corrupted)
   - Store encrypted in secure storage
   - Generate unique reference ID per file

---

### Section B: Economic Data and Operations

| Field | Component | Data Type | Size | Required | Validation Rules |
|-------|-----------|-----------|------|----------|------------------|
| **Est. Annual Turnover** | Input Money | Decimal | Max 15,2 | ✓ | • Format: `€ 1,000,000.00`<br>• Value must be > 0<br>• Currency mask with thousands separator |
| **Source of Funds** | Select Dropdown | Text | - | ✓ | • Options: Business Activity, Capital Increase, Grants, Loans<br>• Single selection |
| **Purpose of Relationship** | Multi-Select | Array | - | ✓ | • Minimum 1 selection required<br>• Options: Current Account, POS, Payroll Management, Financing, Investment<br>• Checkbox list |
| **Main Currency** | Select Dropdown | ISO Currency | 3 chars | ✓ | • Options: EUR, USD, GBP, CHF, etc.<br>• Pre-selection: EUR |
| **Ops. with Tax Havens?** | Radio Button | Boolean | - | ✓ | • Options: Yes / No<br>• If "Yes": Flag as "High Risk AML" |

### Business Rules (Section B)

1. **Risk Scoring:**
   - Calculate initial risk score based on:
     - Annual turnover bracket
     - Tax haven operations
     - PEP status
     - Tax residence country
   - Risk levels: Low / Medium / High / Very High

2. **AML Flags:**
   - **High Risk if any:**
     - Tax Haven operations = Yes
     - PEP = Yes
     - Tax Residence = High-risk country
     - Turnover > €5M with vague corporate purpose
   - Trigger manual review workflow

3. **Purpose of Relationship:**
   - Store as JSON array
   - Used for product recommendations
   - Financing selection triggers credit assessment workflow

---

## Final Actions (Step 3 Footer)

### Legal Declarations

#### Checkbox 1: Data Truthfulness
- **Label:** "I declare that the provided data is true and I am the beneficial owner of the activity."
- **Required:** ✓ (Mandatory)
- **Type:** Checkbox
- **Validation:** Must be checked to proceed

#### Checkbox 2: Privacy Policy
- **Label:** "I accept the [Privacy Policy](#) and Data Processing Agreement of Banca Henar (BHNR)."
- **Required:** ✓ (Mandatory)
- **Type:** Checkbox
- **Links:** Privacy Policy (opens modal or new tab)
- **Validation:** Must be checked to proceed

### Final Submission Button

- **Label:** "Finalize and Sign Contract"
- **State:** Disabled until both checkboxes are checked
- **Action:** 
  1. Validate all three steps
  2. Generate PDF contract with all entered data
  3. Initiate digital signature flow (OTP or Biometric)
  4. Store signed contract in document management system
  5. Create corporate account in BHNR system
  6. Send confirmation email to corporate email
  7. Redirect to success page or dashboard

---

## Technical Implementation Notes

### State Management
```typescript
interface WizardData {
  step1: {
    taxId: string;
    legalName: string;
    tradeName: string | null;
    incorporationDate: Date;
    legalNature: string;
    activityCode: string;
    corporatePurpose: string;
    taxResidenceCountry: string;
  };
  step2: {
    address: {
      streetType: string;
      streetName: string;
      number: string;
      floorDoor?: string;
      zipCode: string;
      city: string;
      province: string;
    };
    mailingAddress?: Address;
    contactPhone: string;
    corporateEmail: string;
    website?: string;
  };
  step3: {
    legalRepresentative: {
      documentType: 'DNI' | 'NIE' | 'PASSPORT';
      documentNumber: string;
      firstName: string;
      lastName: string;
      secondLastName?: string;
      role: string;
      isPEP: boolean;
      publicOffice?: string;
      documents: {
        idFront: File;
        idBack?: File;
        powersOfAttorney: File;
        deedOfIncorporation: File;
      };
    };
    economicData: {
      estimatedTurnover: number;
      sourceOfFunds: string;
      purposeOfRelationship: string[];
      mainCurrency: string;
      taxHavens: boolean;
    };
    declarations: {
      dataTruthfulness: boolean;
      privacyPolicy: boolean;
    };
  };
}
```

### Form Validation Strategy
- **Step-by-step validation:** Each step validates independently
- **Real-time feedback:** Show errors on blur or change
- **Progressive disclosure:** Only show relevant fields based on selections
- **Async validations:** Tax ID existence, email domain verification
- **File validations:** Size, type, malware scan before upload

### Navigation Flow
```
Landing Page
    ↓
Step 1 (Corporate Identity)
    ↓ [Valid] → Save to state
Step 2 (Location & Contact)
    ↓ [Valid] → Save to state
    ↑ [Back] ← Navigate back without data loss
Step 3 (KYC & Economic Data)
    ↓ [Valid] → All checkboxes checked
Submit → Generate PDF → Digital Signature → Account Creation → Success
```

### Error Handling
- Network errors: Show retry button, persist form data locally
- Validation errors: Highlight field, show inline error message
- File upload errors: Show specific error (size, format, corrupted)
- Backend errors: Log to monitoring, show user-friendly message

### Accessibility (WCAG 2.1 AA)
- All form fields have associated `<label>` elements
- Proper ARIA attributes for error states
- Keyboard navigation support (Tab, Enter, Escape)
- Focus management when navigating between steps
- Color contrast ratios meet standards
- Screen reader announcements for validation errors

---

## Change Control

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2025-11-25 | D. de la Rosa | Initial draft document |

---

## Related Documents
- [Privacy Policy](../legal/privacy-policy.md)
- [API Specification](../api/corporate-onboarding-api.md)
- [UI/UX Design System](../design/design-system.md)
- [AML/KYC Procedures](../compliance/aml-procedures.md)
