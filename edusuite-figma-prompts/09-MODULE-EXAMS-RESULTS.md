# Module Prompt: Exams & Results (Hyperion EduSuite)

Design the **Exams & Results** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Exam setup**: List of exams (name, term, type). Add/Edit (name, term, type, weight). Grading system selector (letter, points, percentage).
- **Exam schedule**: List by exam (subject, date, time, duration). Add/Edit. Conflict check.
- **Marks entry**: Select exam, class, section, subject. Grid: student × marks (or grade). Bulk entry, save. Moderation/remark request (optional).
- **Report card**: View by student + term. Subject-wise marks, grades, GPA, remarks. Print/PDF button. Optional custom template (school logo, layout).
- **Ranking**: Class/section ranking by exam. School-level toppers. GPA/CGPA display.
- **Publish results**: Toggle “Published” per exam. Notification to parents/students when published.
- **Grading systems**: CRUD for grading (e.g. A=90–100, B=80–89). Used in exam and report card.

## DB Entities (Context)

- exams(id, name, term_id, type)
- exam_schedule(id, exam_id, subject_id, date, time)
- marks(id, exam_id, student_id, subject_id, score, grade)
- report_cards(id, student_id, term_id, pdf_url)

## UX

- Flow: Exam → Schedule → Marks entry → Publish → Report card. Clear steps. Report card as read-only view with PDF CTA.

## Deliverables

- Exam list and form.
- Exam schedule list and form.
- Marks entry grid (with bulk).
- Report card view and print/PDF layout.
- Ranking list/screen.
- Grading system CRUD.
- Empty, loading, and validation states.
