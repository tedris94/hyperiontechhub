# Module Prompt: Events & Calendar (Hyperion EduSuite)

Design the **Events & Calendar** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **School calendar**: Month/week view. Events, holidays, exams, parent-teacher meetings. Color by type. Click date to add/view.
- **Events**: List (title, date, type, audience). Add/Edit (title, date, time, type, description, audience, venue). Publish. RSVP optional (yes/no/count).
- **Holidays**: List (name, start, end). Add/Edit. Show on calendar.
- **Exams on calendar**: Pull from exam schedule. Optional manual “exam block” entry.
- **Reminders**: Optional reminder (email/push) X days before event. Settings per event type.
- **Public view**: Optional shareable calendar link (read-only) for parents.

## UX

- Main view: calendar (month). Side panel or modal for event detail. Add event from date click or “Add event” button. Filters: Events, Holidays, Exams.

## Deliverables

- Calendar view (month with events).
- Event list and form (with audience and venue).
- Holiday list and form.
- Event detail modal (with RSVP if applicable).
- Empty and loading states.
- Mobile calendar view.
