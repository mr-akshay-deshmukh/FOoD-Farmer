# Security Policy

## Supported Versions

We provide security updates for the following versions of **FOOD FARMER**:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The **FOOD FARMER** team takes security vulnerabilities seriously. If you discover a potential vulnerability in our codebase, authentication flow, or API endpoints:

1. **Do NOT publicly disclose the issue** in GitHub issues, forums, or social media.
2. Email your findings directly to the maintainers or security leads with the subject line:
   `[SECURITY] Vulnerability Report: FOOD FARMER`.
3. Include:
   - A description of the vulnerability and its potential impact.
   - Exact steps or proof-of-concept scripts to reproduce the issue.
   - Suggested mitigations (if known).

### Response Timeline
- **Acknowledgement**: Within 48 hours.
- **Triage & Assessment**: Within 5 business days.
- **Fix & Advisory Release**: Coordinated with the reporter before public disclosure.

## Security Practices Enforced
- **Authentication**: Google OAuth with Cloud Firestore session management.
- **Data Partitioning**: Subcollection rules ensuring users can only read and write their own claims, listings, and verification records.
- **HMAC Signatures**: SHA-256 HMAC digest verification on all external Webhooks (`X-FoodFarmer-Signature-256`).
- **Server-Side AI API Keys**: Sensitive tokens and `@google/genai` instances remain strictly on the backend.
