# Module Prompt: Hostel Management (Hyperion EduSuite)

Design the **Hostel** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Hostels**: List (name, type: Boys/Girls, capacity). Add/Edit.
- **Rooms**: List by hostel (room no, capacity, occupied). Add/Edit. Bed-level optional (beds per room).
- **Allocation**: Assign student to room (and bed). Check-in date. List of occupants per room/hostel. Deallocate (check-out date, reason).
- **Hostel fees**: Fee type linked to hostel. Invoice integration. Outstanding per student.
- **Attendance**: Optional daily roll call (present/absent/leave) for hostel residents.
- **Meal plans**: Optional (meal type, timing). Discipline/incident log optional.

## DB Entities (Context)

- hostels(id, name)
- rooms(id, hostel_id, room_no, capacity)
- hostel_allocations(id, student_id, room_id, check_in, check_out)

## UX

- Hierarchy: Hostels → Rooms → Allocations. Room view shows occupants. Clear vacancy indicator.

## Deliverables

- Hostels and rooms CRUD.
- Allocation form and list (by hostel/room).
- Occupants list and check-out flow.
- Hostel fee link to invoices.
- Optional attendance and meal placeholder.
- Empty and loading states.
