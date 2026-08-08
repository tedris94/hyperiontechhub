# Module Prompt: Fees & Accounting (Hyperion EduSuite)

Design the **Fees & Accounting** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Fee structure**: List (name, amount, term, class). Add/Edit. Categories (tuition, transport, hostel). Waivers/discounts (%, fixed).
- **Invoices**: List (student, total, due date, status: Paid/Partial/Overdue). Filter by class, status. Generate invoices (select term, class). View invoice detail (line items, payments, balance).
- **Payments**: Record payment (invoice, amount, method, reference, date). Receipt view/print. Payment history per student.
- **Outstanding**: List of students with balance. Send reminder. Payment gateway integration (Pay button → redirect or modal).
- **Financial reports**: Daily collection, term-wise collection, outstanding summary. Charts (revenue, expenses). Export CSV/PDF.
- **Expenses**: List (category, amount, date, description). Add/Edit. Categories CRUD. Expense report by period.
- **Ledger / Chart of accounts**: Optional: list of accounts, journal entries. Simple income vs expense dashboard.

## DB Entities (Context)

- fee_types(id, name, amount, term_id)
- invoices(id, student_id, total, status, due_date)
- payments(id, invoice_id, amount, method, reference, date)
- expenses(id, category, amount, date, description)

## UX

- Tabs or sidebar: Fee structure, Invoices, Payments, Outstanding, Reports, Expenses. Clear status badges (Paid/Partial/Overdue). Receipt and invoice as print-friendly layout.

## Deliverables

- Fee structure list and form.
- Invoice list, detail, and generate flow.
- Payment form and receipt view.
- Outstanding list and reminder action.
- Financial report dashboard (charts + table).
- Expense list and form.
- Empty, loading, and error states.
