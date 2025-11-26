# System Documentation - Design

This directory contains the functional specifications and design documentation for the Banca Henar (BHNR) Corporate Portal.

## Documents

### 1. [Create Corporate Account](./create-corporate-account.md)
Complete functional specification for the 3-step corporate onboarding wizard including:
- Step 1: Corporate Identity and Activity
- Step 2: Location and Contact
- Step 3: Legal Representatives and Economic Data (KYC)

### 2. [Corporate Portal and Navigation](./corporate-portal-navigation.md)
Specification for the portal structure including:
- Public Landing Page
- Authentication System (Login/Logout)
- Private Dashboard Area
- Navigation Menu Structure

## Original Documentation

The original functional specifications in DOCX format are preserved in:
```
docs/original-functional/
├── BHNR-FunctionalSpec-CreateCorporateAccount_v.1.0.docx
└── BHNR-FunctionalSpec-LandingCorporateMenus_v.1.0.docx
```

## Documentation as Code

All functional specifications are now maintained as Markdown files for:
- **Version Control:** Track changes via Git
- **Collaboration:** Easy to review and comment in PRs
- **Integration:** Can be rendered in documentation sites (GitBook, MkDocs, etc.)
- **Searchability:** Plain text format for better search and grep
- **Maintainability:** Edit with any text editor, no proprietary software needed

## Related Documentation

- `/docs/system-doc/api/` - API specifications
- `/docs/system-doc/architecture/` - System architecture diagrams
- `/docs/system-doc/security/` - Security policies and procedures

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-25 | D. de la Rosa | Initial conversion from DOCX to Markdown |
