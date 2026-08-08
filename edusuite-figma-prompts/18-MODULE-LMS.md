# Module Prompt: E-Learning / LMS (Lite) (Hyperion EduSuite)

Design the **E-Learning / LMS (Lite)** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Resources**: List by class/subject (title, type: file/link, upload date). Upload (file or URL, title, class, subject). Download/view. Optional folder.
- **Assignments**: List (title, subject, class, due date, status). Add (title, description, due date, class, subject, attachments). Edit/Delete.
- **Submissions**: Per assignment: list of students with submit status (Submitted/Pending), file link, grade, feedback. Teacher: grade and comment. Student: upload file, view grade.
- **Comments**: Optional discussion per assignment or resource (thread).
- **Student view**: My assignments (pending, submitted). My resources. Submit assignment form.
- **Teacher view**: My class assignments, submission list, grade form.

## DB Entities (Context)

- assignments(id, subject_id, title, due_date)
- submissions(id, assignment_id, student_id, file_url, grade, feedback)

## UX

- Teacher: Assignments → Create → Submissions → Grade. Student: Assignments list → Submit → View grade. Resources as simple list with download.

## Deliverables

- Resources list and upload.
- Assignments list and form.
- Submission list (teacher) with grade/feedback form.
- Student assignment list and submit form.
- Student resource list.
- Empty and loading states.
