# Module Prompt: Library Management (Hyperion EduSuite)

Design the **Library** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Book catalog**: List (title, author, ISBN, category, copies, available). Search, filters (category, author). Add/Edit book (title, author, ISBN, category, copies, shelf).
- **Issue book**: Select member (student/staff), book, due date. Issue. List of current issues (member, book, issue date, due date, fine if overdue).
- **Return book**: Search by member or book. Return action. Calculate fine (overdue days × rate). Pay fine or waive.
- **Members**: List of students/staff with library access. Optional membership validity.
- **Fines**: List of fines (member, book, amount, status: Paid/Unpaid). Collect payment.
- **Reports**: Books issued/returned by date. Overdue list. Popular books. Export.

## DB Entities (Context)

- books(id, title, author, isbn, copies, category)
- issues(id, book_id, student_id, issue_date, return_date, fine)

## UX

- Sidebar: Catalog, Issue, Return, Members, Fines, Reports. Quick issue/return forms. Clear overdue highlighting.

## Deliverables

- Book catalog list and form.
- Issue and return screens.
- Current issues list and fine calculation.
- Members list.
- Fines list and payment.
- Reports screen.
- Empty and loading states.
