# Module Prompt: Transport Management (Hyperion EduSuite)

Design the **Transport** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Vehicles**: List (plate, type, capacity, driver). Add/Edit (plate, type, capacity, driver_id). Status (Active/Under maintenance).
- **Drivers**: List (name, phone, license). Add/Edit. Assign to vehicle.
- **Routes**: List (name, vehicle, stops, timings). Add/Edit (name, vehicle, stop list with sequence and time). Map placeholder optional.
- **Student allocation**: Select student, route, stop (pickup/drop). Fee integration (transport fee in invoice). List of students by route.
- **GPS/Tracking**: Placeholder screen (e.g. “Live tracking coming soon” or simple map placeholder).
- **Reports**: Students per route, vehicle utilization, fee collection by route.

## DB Entities (Context)

- routes(id, name, vehicle_id)
- vehicles(id, plate, driver_id, capacity)

## UX

- Flow: Vehicles & Drivers → Routes → Student allocation. Route detail shows stop list and assigned students.

## Deliverables

- Vehicles and drivers CRUD.
- Routes list and form (with stops).
- Student allocation form and list by route.
- GPS/tracking placeholder.
- Reports screen.
- Empty and loading states.
