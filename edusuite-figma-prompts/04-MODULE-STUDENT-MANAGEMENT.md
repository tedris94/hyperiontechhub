# Module Prompt: Student Management (Hyperion EduSuite)

Design the **Student Management** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Student list**: Table with photo thumbnail, admission no, name, class, section, guardian, status. Search, filters (class, section, status). Bulk actions (promote, export). Pagination.
- **Student profile**: Header (photo, name, admission no, class). Tabs or sections: Personal (DOB, gender, blood group, address), Guardian (name, phone, email, relation), Medical (allergies, conditions), Academic (class history, subjects), Discipline (incidents, remarks), Documents (uploads). Edit button.
- **Add/Edit student**: Form with above fields; class/section dropdown; guardian selector or inline form. Validation messages.
- **Admission workflow**: Application list (status: draft, submitted, under review, approved, rejected). Application form (personal + guardian + previous school). Review screen with Approve/Reject and remarks.
- **Enrollment**: Assign class, section, roll number. Optional bulk enrollment from list.
- **Promotions**: Select session/term, source class, target class; student list with checkboxes; “Promote selected”.
- **Transfers & withdrawals**: Transfer form (to class/school), withdrawal form (reason, date). Status badges (Active, Transferred, Withdrawn).
- **Discipline**: Log incident (date, type, description, action). List per student.

## DB Entities (Context)

- students(id, school_id, admission_no, name, gender, dob, class_id, section_id, guardian_id, status)
- guardians(id, name, phone, email, address, relation)
- admissions(id, student_id, status, applied_at, reviewed_at)
- discipline_logs(id, student_id, type, description, action, date)

## UX

- List → profile → edit flow. Modals for quick add; full page for profile and admission. Clear status badges and filters.

## Deliverables

- Student list (table, filters, bulk actions).
- Student profile (all tabs/sections).
- Add/Edit student form.
- Admission list + application form + review screen.
- Promotions and transfer/withdrawal flows.
- Discipline log form and list.
- Empty, loading, and validation states.
