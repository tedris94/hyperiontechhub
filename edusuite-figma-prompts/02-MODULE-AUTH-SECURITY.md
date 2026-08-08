# Module Prompt: Authentication & Security (Hyperion EduSuite)

Design the **Authentication & Security** UI/UX for **Hyperion EduSuite** school management app. Use **Hyperion Tech Hub** brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md` for usage.

## Scope

- **Login**: Email/username + password, “Remember me”, “Forgot password” link. Optional OTP/2FA step screen. Optional SSO buttons (Google/Microsoft).
- **Password reset**: Request reset (email input), reset confirmation, “Set new password” form with strength indicator.
- **Session management**: List of active sessions (device, location, last active). “Log out other devices” action.
- **Audit logs**: Table of user actions (user, action, resource, timestamp, IP). Filters by user, date range, action type. Export CSV.
- **Role-based access**: Permission matrix or role editor (optional for this module; can be in Settings).

## DB Entities (Context)

- users(id, name, email, phone, password_hash, role_id, status, last_login)
- roles(id, name, permissions_json)
- sessions(id, user_id, device, ip, last_active)
- audit_logs(id, user_id, action, resource, created_at, ip)

## UX

- Centered card layout for login/reset. Clear error messages below fields. Success toasts. Loading states on submit.
- Session list: table with actions. Audit log: filter bar + paginated table.

## Deliverables

- Login (default + OTP step + SSO).
- Forgot password + Set new password.
- Sessions list + Audit log list.
- Empty and error states.
- Light and dark variants.

