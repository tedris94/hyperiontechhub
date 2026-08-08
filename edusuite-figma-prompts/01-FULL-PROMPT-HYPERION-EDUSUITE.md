# Full Figma Make AI Prompt: Hyperion EduSuite

Design a full-featured, modern web application UI/UX for **Hyperion EduSuite**, a standalone Next.js school management platform that mirrors **all modules and functionality of school-management-pro-10.6.3**. The system must be comprehensive with role-based dashboards, admin management, academic operations, finance, HR, communication, and reporting. Provide consistent navigation, responsive layouts, clean tables, and detailed CRUD flows for all entities.

---

## Hyperion Tech Hub Brand Colors

Use these colors consistently across all screens and components:

| Token        | Hex       | Usage                          |
|-------------|-----------|--------------------------------|
| **Primary** | `#1A2BC2` | Primary buttons, links, accents |
| **Navy**    | `#0D0D52` | Headers, dark sections, footer  |
| **Charcoal**| `#1B1C1E` | Body text, secondary surfaces   |
| **Black**   | `#000000` | Strong contrast, borders       |
| **White**   | `#FFFFFF` | Backgrounds, cards, light text  |

- **Primary (#1A2BC2)**: CTAs, active states, key highlights, progress indicators.
- **Navy (#0D0D52)**: Top nav, sidebar headers, footer background.
- **Charcoal (#1B1C1E)**: Body copy, labels, secondary UI.
- **Black (#000000)**: Borders, dividers, high-contrast elements.
- **White (#FFFFFF)**: Page background, card surfaces, input backgrounds.

Support **light and dark mode** using these tokens (e.g. invert surfaces in dark mode while keeping primary/navy accents).

---

## User Roles & Access

- Super Admin, School Owner, Principal, Vice Principal, Head of Department
- Teacher, Accountant, HR/Staff Manager, Librarian, Transport Manager, Hostel Manager
- Student, Parent/Guardian, Admission Officer, Receptionist, Alumni, IT Support

Each role must have its own dashboard, menus, KPIs, and quick actions.

---

## Core Modules & Functionalities (Must Include All)

### 1. Authentication & Security
Login, OTP/2FA, SSO (optional), password reset. Role-based access control (RBAC). Session management, device history. Audit logs for actions.

### 2. Dashboard (Role-Specific)
KPIs, charts, alerts, recent activities. Attendance summary, fee status, exam progress. To-do tasks and calendar.

### 3. Student Management
Student profiles (photo, bio, guardian details, medical). Admission workflow + application tracking. Enrollment, class allocation, roll numbers. Promotions, transfers, withdrawals. Discipline records, behavior logs.

### 4. Parent/Guardian Portal
Child performance, attendance, fees, messages. Download reports and invoices. Schedule meetings.

### 5. Staff/Teacher Management (HR)
Staff profiles, roles, departments. Hiring, contracts, documents. Payroll, salary structure, deductions. Leave management (requests, approvals). Performance appraisal and evaluation.

### 6. Academic Management
Classes, sections, subjects, streams. Timetable management (drag/drop). Lesson plans and syllabus tracking. Teacher assignments.

### 7. Attendance
Daily/period attendance. Staff attendance. Leave requests and approvals. Attendance reports and analytics.

### 8. Exams & Results
Exam types, grading systems. Marks entry, moderation, remarking. Report cards (PDF). Ranking, GPA/CGPA. Result publishing and notifications.

### 9. Fees & Accounting
Fee structures, categories, waivers. Invoice generation, receipts. Payment tracking, outstanding balances. Payment gateway integration. Financial reports (daily, term, annual). Expense tracking, ledger, charts of accounts.

### 10. Library Management
Book catalog, ISBN, authors. Issue/return, fines. Member management. Reports.

### 11. Transport Management
Routes, vehicles, drivers. Student transport allocation. GPS/Tracking placeholder. Fee integration.

### 12. Hostel Management
Rooms, beds, allocation. Hostel fees, attendance. Meal plans and discipline.

### 13. Communication
SMS/Email/Push notifications. Bulk messaging. Templates and scheduling. Announcements and notice board.

### 14. Inventory & Assets
Inventory items, suppliers. Asset assignment. Stock in/out, audit.

### 15. Documents & Certificates
Uploads, secure downloads. Generate certificates (bonafide, transfer, result). Document approval workflow.

### 16. Events & Calendar
School calendar. Events, holidays, exams. RSVP, reminders.

### 17. E-Learning / LMS (Lite)
Upload resources, assignments. Submission tracking. Comments, grading.

### 18. Alumni Management
Alumni profiles. Donations, events. Engagement tracking.

### 19. Reports & Analytics
Academic performance reports. Attendance analytics. Financial dashboards. Custom report builder.

### 20. Settings & Configuration
School profile, branding. Academic sessions/terms. Grading systems. Fee types, currency. User roles & permissions.

---

## Key UX Expectations

- Left sidebar navigation + top header.
- Search everywhere.
- Filters, exports (CSV, PDF), bulk actions.
- Consistent data tables with pagination.
- Modals for quick edits, full pages for complex flows.
- Clear error/success states.
- Notification bell & message inbox.
- Onboarding wizard for new schools.

---

## Database Schema (High-Level Entities)

### Users & Roles
- users(id, name, email, phone, password_hash, role_id, status, last_login)
- roles(id, name, permissions_json)

### School Setup
- schools(id, name, address, logo, contact)
- academic_sessions(id, school_id, name, start_date, end_date, is_active)
- terms(id, session_id, name, start_date, end_date)

### Students & Guardians
- students(id, school_id, admission_no, name, gender, dob, class_id, section_id, guardian_id, status)
- guardians(id, name, phone, email, address, relation)

### Staff & HR
- staff(id, school_id, name, role, department_id, salary, status)
- departments(id, name)
- leave_requests(id, staff_id, type, from_date, to_date, status)
- payroll(id, staff_id, month, gross, deductions, net)

### Academics
- classes(id, name, level)
- sections(id, class_id, name)
- subjects(id, name, code)
- teacher_subjects(id, staff_id, subject_id, class_id)
- timetable(id, class_id, section_id, day, period, subject_id, staff_id)

### Attendance
- student_attendance(id, student_id, date, status, remarks)
- staff_attendance(id, staff_id, date, status, remarks)

### Exams & Results
- exams(id, name, term_id, type)
- exam_schedule(id, exam_id, subject_id, date, time)
- marks(id, exam_id, student_id, subject_id, score, grade)
- report_cards(id, student_id, term_id, pdf_url)

### Fees & Finance
- fee_types(id, name, amount, term_id)
- invoices(id, student_id, total, status, due_date)
- payments(id, invoice_id, amount, method, reference, date)
- expenses(id, category, amount, date, description)

### Library
- books(id, title, author, isbn, copies)
- issues(id, book_id, student_id, issue_date, return_date, fine)

### Transport & Hostel
- routes(id, name, vehicle_id)
- vehicles(id, plate, driver_id, capacity)
- hostels(id, name)
- rooms(id, hostel_id, room_no, capacity)
- hostel_allocations(id, student_id, room_id)

### Communication
- messages(id, sender_id, target_role, content, channel, status, sent_at)
- notices(id, title, content, audience, publish_date)

### Inventory
- inventory_items(id, name, category, qty, supplier_id)
- suppliers(id, name, contact)

### LMS
- assignments(id, subject_id, title, due_date)
- submissions(id, assignment_id, student_id, file_url, grade)

### Alumni
- alumni(id, student_id, graduation_year, occupation, contact)

---

## Deliverables Required From Figma Make AI

- Full UI screens for every module above.
- Responsive layouts (desktop, tablet, mobile).
- Design system: colors (brand above), typography, components.
- Forms, tables, charts, and empty/loading states.
- Role-specific dashboards and permission-based menus.
- User onboarding and setup wizard.

---

**For higher quality output:** Use the module-by-module prompts in this folder (see **00-INDEX-HOW-TO-USE.md**). Each module has a dedicated prompt with scope, DB context, and deliverables.
