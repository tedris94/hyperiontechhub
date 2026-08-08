# Module Prompt: Settings & Configuration (Hyperion EduSuite)

Design the **Settings & Configuration** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **School profile**: Form (name, address, phone, email, logo upload, timezone, currency, language). Save. Optional multi-school selector for Super Admin.
- **Branding**: Logo, favicon, primary color (default #1A2BC2), secondary (default #0D0D52). Preview on sample header/footer.
- **Academic sessions**: List (name, start, end, is_active). Add/Edit. Set active session.
- **Terms**: List by session (name, start, end). Add/Edit.
- **Grading systems**: List (name, type: letter/points). Add/Edit. Define grades (e.g. A=90–100, B=80–89). Set default.
- **Fee types / categories**: List (name, amount, term/session). Add/Edit. Currency display.
- **User roles & permissions**: List of roles. Edit role (name, permissions: checkboxes by module/action). Optional clone role.
- **System settings**: Optional (session timeout, backup, email/SMS provider keys). Placeholder or simple form.
- **Onboarding wizard** (optional): Step 1 School profile → Step 2 Session/Term → Step 3 Classes → Step 4 Admin user. Progress indicator. Skip option.

## UX

- Settings sidebar: School profile, Branding, Sessions, Terms, Grading, Fee types, Roles, System. Each as form or list + form. Clear “Save” and “Set default” actions.

## Deliverables

- School profile form (with logo upload).
- Branding form (colors, logo) and preview.
- Academic sessions and terms CRUD.
- Grading system list and form (with grade definitions).
- Fee types CRUD.
- Roles list and permission matrix/form.
- System settings placeholder.
- Onboarding wizard (3–4 steps).
- Empty and loading states.
