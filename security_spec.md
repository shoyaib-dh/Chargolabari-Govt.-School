# Security Specification & Payload-First TDD

## 1. Data Invariants
1. **Default Deny**: All unmatched paths are denied read and write access (`match /{document=**} { allow read, write: if false; }`).
2. **Admin Verification**: Administrative mutations require either a verified primary bootstrap email (`sheakhsohel307@gmail.com` with `email_verified == true`) OR an active record in `/admins/{request.auth.uid}` with `email_verified == true`.
3. **Minor Student Privacy (PII Protection)**: Individual student documents in `/students/{studentId}` are NEVER publicly readable unless BOTH `isPublicApproved == true` AND `guardianConsent == true` AND `isActive == true`.
4. **Contact Message PII Isolation**: `/contactMessages/{messageId}` allows unauthenticated or authenticated public users ONLY to `create` messages with `status == 'unread'` and strict server timestamps (`request.time`); reading, listing, updating, and deleting are strictly admin-only.
5. **Strict Schema & Size Guards**: Every `create` and `update` enforces `isValid[Entity](incoming())` with `keys().hasAll(...)`, `keys().hasOnly(...)`, type checks, string `.size()` bounds, ID regex `^[a-zA-Z0-9_\\-]+$`, and immutable `createdAt`.
6. **Temporal Integrity**: `createdAt == request.time` on create; `incoming().createdAt == existing().createdAt` and `updatedAt == request.time` on update.

## 2. The "Dirty Dozen" Attack Payloads (Expected: PERMISSION_DENIED)
1. **Shadow Field Injection on Notice**: Public or non-admin creates/updates `/notices/n1` with extra `isAdminOverride: true`.
2. **Self-Assigned Admin Escalation**: Non-admin authenticated user creates `/admins/{theirUid}` with `role: "super_admin"`.
3. **Email Spoofing**: User with `email: "sheakhsohel307@gmail.com"` but `email_verified: false` attempts admin write on `/settings/site`.
4. **Minor Student PII Leak (Get)**: Public user tries `get` on `/students/s1` where `guardianConsent: false`.
5. **Minor Student PII Leak (List)**: Public user runs blanket `list` on `/students` without filtering `isPublicApproved == true && guardianConsent == true`.
6. **Contact Message Enumeration**: Non-admin user attempts `list` or `get` on `/contactMessages`.
7. **Pre-Approved Contact Status Bypass**: Attacker submits `/contactMessages/m1` with `status: "replied"` instead of `"unread"`.
8. **Timestamp Forgery**: Admin or public caller sends client-fabricated `createdAt` not equal to `request.time`.
9. **ID Poisoning**: Caller attempts document creation at `/notices/` with 300-character ID or invalid characters (`../admin`).
10. **Denial of Wallet Oversized String**: Attacker sends a 2MB string inside `contactMessages.message`.
11. **Immutable CreatedAt Tampering**: Update payload mutates `createdAt` on `/teachers/t1`.
12. **Blanket Unverified Write**: Unauthenticated or unverified user attempts `update` or `delete` on `/teachers/t1`.
