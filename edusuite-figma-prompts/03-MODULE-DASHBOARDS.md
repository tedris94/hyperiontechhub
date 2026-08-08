# Module Prompt: Role-Specific Dashboards (Hyperion EduSuite)

Design **role-specific dashboards** for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Layout**: Left sidebar (nav + school logo) + top header (search, notifications, user menu). Main content area with cards and charts.
- **KPIs**: 4–6 stat cards per role (e.g. Total Students, Today’s Attendance, Pending Fees, Upcoming Exams). Use primary/navy for accents.
- **Charts**: At least one bar/line chart (e.g. attendance trend, fee collection), one pie/donut (e.g. class distribution). Use brand palette.
- **Alerts**: Small alert strip or card for overdue fees, pending leave, low stock, etc.
- **Recent activity**: List of latest actions (admissions, payments, exam publish).
- **Quick actions**: 2–4 buttons (e.g. “Add Student”, “Mark Attendance”, “Collect Fee”).
- **Calendar / to-do**: Compact calendar widget or to-do list for the day.

## Roles to Differentiate

- **Super Admin / School Owner**: Multi-school stats, revenue, system health.
- **Principal**: School-wide KPIs, attendance, fees, exams.
- **Teacher**: My classes, today’s timetable, pending marks, leave.
- **Accountant**: Fee collection, outstanding, expenses, daily summary.
- **Student**: My attendance, fees due, upcoming exams, homework.
- **Parent**: Children summary, attendance, fee status, messages.

## UX

- Consistent sidebar and header across all dashboards. Content area responsive (stack on mobile). Clear hierarchy: KPIs → Charts → Activity.

## Deliverables

- One dashboard layout (sidebar + header + content grid).
- 3 role variants (e.g. Principal, Teacher, Parent) with different KPI/chart content.
- KPI cards, 2 chart types, alert strip, activity list, quick actions.
- Empty and loading states.
- Desktop and mobile breakpoints.

