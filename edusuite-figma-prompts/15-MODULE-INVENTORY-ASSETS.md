# Module Prompt: Inventory & Assets (Hyperion EduSuite)

Design the **Inventory & Assets** module for **Hyperion EduSuite**. Use brand colors: Primary `#1A2BC2`, Navy `#0D0D52`, Charcoal `#1B1C1E`, Black `#000000`, White `#FFFFFF`. See `BRAND-COLORS-REFERENCE.md`.

## Scope

- **Inventory items**: List (name, category, qty, unit, min stock, supplier). Search, filters. Add/Edit (name, category, unit, min stock, supplier_id). Low-stock alert (qty &lt; min).
- **Stock in**: Form (item, qty, date, reference, notes). List of stock-in entries.
- **Stock out**: Form (item, qty, date, purpose, issued to). List of stock-out entries. Balance update.
- **Suppliers**: List (name, contact, email). Add/Edit. Used in item form.
- **Assets**: List (name, category, tag, assigned to, location, status). Add/Edit. Assign to staff/room. Return/transfer.
- **Audit**: Stock audit form (item, counted qty, variance). Audit history. Adjust stock.

## DB Entities (Context)

- inventory_items(id, name, category, qty, supplier_id)
- suppliers(id, name, contact)

## UX

- Sidebar: Items, Stock in, Stock out, Suppliers, Assets, Audit. Clear low-stock badge. Tables with pagination.

## Deliverables

- Inventory items list and form (with low-stock indicator).
- Stock in/out forms and lists.
- Suppliers CRUD.
- Assets list, form, and assignment.
- Audit form and history.
- Empty and loading states.
