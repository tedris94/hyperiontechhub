# Module Prompt: Staff / Teacher Management (HR) (Hyperion EduSuite)

Design the **Staff & HR** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Staff list**: Table (photo, name, role, department, join date, status). Search, filters (department, role). Add/Edit/View.
- **Staff profile**: Header (photo, name, role, department). Tabs: Personal, Employment (contract, designation), Documents (uploads), Payroll summary, Leave balance, Appraisal history.
- **Add/Edit staff**: Form (name, email, phone, role, department, salary, join date, designation). Document upload.
- **Departments**: List + add/edit (name, head). Used in dropdowns.
- **Payroll**: List (staff, month, gross, deductions, net, status). Generate payroll (select month, run). Payslip view/print. Salary structure per staff (basic, allowances, deductions).
- **Leave management**: Leave request form (type, from, to, reason). Request list (pending/approved/rejected). Approve/Reject with remarks. Leave balance display per staff. Leave type setup (annual, sick, etc.).
- **Performance appraisal**: Form (staff, period, goals, rating, comments). List of appraisals. Optional 360 view.

## DB Entities (Context)

- staff(id, school_id, name, role, department_id, salary, status)
- departments(id, name)
- leave_requests(id, staff_id, type, from_date, to_date, status)
- payroll(id, staff_id, month, gross, deductions, net)

## UX

- List → profile → edit. Modals for quick add; full page for profile and payroll. Clear status and filters.

## Deliverables

- Staff list and profile (all tabs).
- Add/Edit staff and department CRUD.
- Payroll list, generate flow, payslip view.
- Leave request form, list, approve/reject.
- Appraisal form and list.
- Empty, loading, and error states.
