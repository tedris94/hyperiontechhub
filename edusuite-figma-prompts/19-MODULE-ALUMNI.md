# Module Prompt: Alumni Management (Hyperion EduSuite)

Design the **Alumni** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Alumni list**: List (name, graduation year, class, occupation, contact). Search, filters (year, class). Add/Edit (link to ex-student or manual). Import optional.
- **Alumni profile**: Header (photo, name, graduation year). Tabs: Contact, Occupation, Education, Donations, Events attended.
- **Donations**: Record donation (alumni, amount, date, purpose). List of donations. Report (total by year, by alumni).
- **Events**: Alumni-specific events (reunion, meetup). List. RSVP. Attendance.
- **Engagement**: Optional (newsletter signup, survey). Track engagement (opened, clicked).
- **Alumni portal** (optional): Login for alumni to update profile, view events, donate. Simplified nav.

## DB Entities (Context)

- alumni(id, student_id, graduation_year, occupation, contact)

## UX

- Admin: List → Profile → Edit. Donations and events as sub-sections or tabs. Alumni portal as separate flow with minimal nav.

## Deliverables

- Alumni list and profile.
- Add/Edit alumni form.
- Donations list and form.
- Alumni events list and RSVP.
- Engagement placeholder or simple list.
- Alumni portal layout (optional).
- Empty and loading states.
