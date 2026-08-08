# Module Prompt: Reports & Analytics (Hyperion EduSuite)

Design the **Reports & Analytics** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Academic performance**: Report by class/section/term (avg marks, pass %, subject-wise). Student-wise report (marks, rank, trend). Export PDF/CSV. Charts (bar: subject avg; line: trend).
- **Attendance analytics**: Report by class/student/date range (present %, absent, late). Charts (daily trend, class comparison). Export.
- **Financial dashboards**: Fee collection by term/month. Outstanding by class. Expense vs income. Charts (revenue, expenses, pie by category). Export.
- **Custom report builder** (optional): Select data source (students, fees, attendance), filters, columns. Preview table. Export CSV/PDF.
- **Report list**: Predefined reports (Performance, Attendance, Fees, etc.). Click to open with default filters. Schedule report (email) optional.
- **Charts**: Use brand primary/navy for series. Clear legends, axis labels. Responsive.

## UX

- Sidebar: Academic, Attendance, Financial, Custom (if any). Each report: filter bar (date, class, term) → chart(s) → table → Export. Consistent layout across report types.

## Deliverables

- Academic performance report (filters, chart, table, export).
- Attendance analytics report (filters, chart, table, export).
- Financial dashboard (charts + table, export).
- Custom report builder (simple: source + filters + columns + preview).
- Report list / landing.
- Empty and loading states.
- Desktop and mobile.
