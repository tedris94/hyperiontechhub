# Module Prompt: Communication (Hyperion EduSuite)

Design the **Communication** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Channels**: SMS, Email, Push (in-app). Optional WhatsApp placeholder.
- **Compose message**: Select audience (role, class, section, or individual). Subject, body. Rich text or plain. Attachments. Schedule (send now / date-time). Channel selector.
- **Templates**: List (name, channel, subject, body). Add/Edit. Use template in compose (prefill, edit).
- **Bulk messaging**: List of sent campaigns (subject, audience, sent at, status). View detail (delivered, failed). Resend or retry failed.
- **Announcements / Notice board**: List (title, content, audience, publish date, expiry). Add/Edit. Publish/Unpublish. Display as card list or feed for students/parents.
- **Inbox** (optional): Per-role inbox for replies or internal notices. Link from dashboard.

## DB Entities (Context)

- messages(id, sender_id, target_role, content, channel, status, sent_at)
- notices(id, title, content, audience, publish_date, expiry_date)

## UX

- Sidebar: Compose, Templates, Sent messages, Announcements. Compose as stepped form (audience → content → schedule). Clear audience selector (checkboxes or tags).

## Deliverables

- Compose screen (audience, content, schedule, channel).
- Templates list and form.
- Sent messages list and detail.
- Announcements list and form (with publish).
- Notice board view (student/parent facing).
- Empty and loading states.
