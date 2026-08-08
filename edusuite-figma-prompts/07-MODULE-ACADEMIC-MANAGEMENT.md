# Module Prompt: Academic Management (Hyperion EduSuite)

Design the **Academic Management** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Classes**: List (name, level, section count). Add/Edit (name, level). Optional stream.
- **Sections**: List by class (e.g. Class 10 – A, B, C). Add/Edit (name, class, capacity). Class teacher assignment.
- **Subjects**: List (name, code, type). Add/Edit. Assign to classes.
- **Teacher–subject assignment**: Matrix or form: select teacher, subject, class/section. List view of assignments.
- **Timetable**: Grid (days × periods). Drag-and-drop or click to assign subject + teacher per cell. Filter by class/section. Conflict warning (same teacher, same period).
- **Lesson plans**: List by class/subject/date. Add (topic, objectives, activities, homework). Calendar view optional.
- **Syllabus**: List by class/subject (chapters, completion status). Upload or add chapters. Track progress.

## DB Entities (Context)

- classes(id, name, level)
- sections(id, class_id, name)
- subjects(id, name, code)
- teacher_subjects(id, staff_id, subject_id, class_id)
- timetable(id, class_id, section_id, day, period, subject_id, staff_id)

## UX

- Hierarchy: Classes → Sections → Subjects. Timetable as main interactive screen. Lesson plan and syllabus as list + detail.

## Deliverables

- Classes and sections CRUD.
- Subjects CRUD and class assignment.
- Teacher–subject assignment screen (matrix or list).
- Timetable grid (desktop) with assign modal.
- Lesson plan list and form.
- Syllabus list and chapter progress.
- Empty and loading states.
