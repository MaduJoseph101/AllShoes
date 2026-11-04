# Security Review

**Review date:** 2026-11-04

**Scope:** Browser-local authentication, password reset, and session restoration.

This review covers the demo authentication flow and data stored in the browser. The findings affect accounts and data in the same browser profile; they do not represent access to server-side accounts. Local storage is user-editable and must not be treated as an authorization boundary.

| # | Severity | File | Lines | Vulnerability | Confidence |
|---|----------|------|-------|---------------|------------|
| 1 | 🟡 MEDIUM | `src/CartContext.jsx` | 524-552 | Password reset accepts an account email without proving ownership or requiring the current password. A person using the same browser can set a new password for that browser-local account. | 10/10 |
| 2 | 🟡 MEDIUM | `src/CartContext.jsx` | 167-192 | The active user is restored from editable localStorage without validating the identity against a trusted session. A person with access to the browser profile can forge the stored identity and appear signed in. | 9/10 |

## Recommendations

- For real account recovery, require a server-verified, single-use, expiring reset token sent through a verified channel. If verification is unavailable in the demo, avoid presenting this flow as secure account recovery.
- For production authorization, validate identity and sessions on a backend. Do not rely on localStorage-backed identity or client-side checks to protect accounts or data.
