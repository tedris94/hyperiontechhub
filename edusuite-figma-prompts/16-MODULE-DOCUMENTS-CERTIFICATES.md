# Module Prompt: Documents & Certificates (Hyperion EduSuite)

Design the **Documents & Certificates** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Document uploads**: List (name, type, uploaded by, date). Upload (file, name, category). Secure download (permission check). Optional folder/category.
- **Certificates**: Types: Bonafide, Transfer, Result, Conduct. Form: select student, certificate type, fill variables (date, reason). Generate PDF (preview). Download/print. Optional template editor (placeholders).
- **Document approval**: Optional workflow (submit → approve/reject). List of pending approvals. Approve/Reject with remarks.
- **Student documents**: Per-student document list (birth certificate, photos, etc.). Upload from student profile or here.

## UX

- Sidebar: Uploads, Certificates, Pending approvals. Certificate flow: Select type → Student → Variables → Preview → Generate. Clear download/preview actions.

## Deliverables

- Document list and upload form.
- Certificate type selector and generation flow (form → preview → download).
- Approval list and approve/reject actions.
- Student document list (linked from profile).
- Empty and loading states.
