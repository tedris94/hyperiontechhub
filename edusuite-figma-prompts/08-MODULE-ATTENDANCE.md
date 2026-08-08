# Module Prompt: Attendance (Hyperion EduSuite)

Design the **Attendance** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Student attendance**: Date picker + class/section filter. List/grid of students with Present/Absent/Late/Leave toggle per student. Bulk “Mark all present”. Save. Summary (present count, absent count).
- **Period-wise attendance** (optional): Same by period; grid student × period.
- **Staff attendance**: Date + list of staff with Present/Absent/Leave. Bulk actions.
- **Leave requests**: Student leave request form (from student/parent). Staff leave (from Staff/HR). List with Approve/Reject. Calendar view of leave.
- **Reports**: Attendance report by class/student/date range. Export. Charts (daily trend, % by class).

## DB Entities (Context)

- student_attendance(id, student_id, date, status, remarks)
- staff_attendance(id, staff_id, date, status, remarks)

## UX

- Quick date + class selector at top. Table or card list for marking. Clear P/A/L indicators. Report as separate screen with filters and export.

## Deliverables

- Student daily attendance screen (list/grid + bulk).
- Staff attendance screen.
- Leave request form and list (approve/reject).
- Attendance report screen with chart and table.
- Empty and loading states.
- Mobile-friendly marking view.
