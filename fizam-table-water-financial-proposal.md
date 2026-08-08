---
title: "Technical Proposal — Fizam Table Water Website, Web App & CMS"
prepared_by: "Hyperion Tech Hub"
reference_design: "https://panic-shred-66166669.figma.site/"
document_type: "Technical Proposal"
---

# Technical Proposal — Fizam Table Water Website, Web App & CMS
Prepared by **Hyperion Tech Hub**  
Client: **Fizam Table Water Company**  
Reference design: https://panic-shred-66166669.figma.site/  
Date: February 2, 2026

---

## Page 1 — Executive Summary
This technical proposal describes the design and implementation approach for Fizam Table Water’s public website, an internal web app, and a custom CMS. The solution will be built to match the approved Figma design, prioritize performance and SEO, and provide a simple content management workflow for non-technical staff. The architecture uses a modern Next.js frontend with a Headless WordPress CMS and a custom admin experience for streamlined publishing.

---

## Page 2 — Project Objectives
- Deliver a fast, responsive, and accessible marketing website aligned with the Figma design.
- Provide a secure CMS and admin workflow for content updates and approvals.
- Enable analytics, SEO, and performance best practices from day one.
- Support scalability for future features (e.g., product expansion, multilingual).

---

## Page 3 — Scope Overview
**In Scope**
- UI/UX implementation based on the Figma design.
- Public website (marketing site).
- Web app (admin and content tools).
- Headless CMS setup with structured content.
- Deployment, analytics, SEO, and security hardening.

**Out of Scope**
- E-commerce payments or online ordering (unless later added).
- ERP integrations or inventory systems.
- Mobile apps (native iOS/Android).

---

## Page 4 — Information Architecture
**Public Website**
- Home
- About
- Products
- Quality & Process
- Blog/News
- Careers (optional)
- Contact

**Web App (Internal)**
- Content Dashboard
- Product Catalog Manager
- Blog/News Manager
- Media Library
- Contact Submissions
- User & Roles Management

---

## Page 5 — UI/UX Implementation (Figma Reference)
The implementation will match the approved layout, typography, spacing, and visual system in the Figma design.

**Screenshot Placement (from Figma):**
1. Home page hero section
2. Home page sections overview
3. Product listing layout
4. Blog/news section
5. Contact page layout

**Insert images in MS Word at the following locations:**
- After “Page 5 — UI/UX Implementation (Figma Reference)”
- Each image should have a short caption referencing the section

---

## Page 6 — Technical Architecture (High-Level)
**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS

**CMS & Data**
- Headless WordPress (custom post types, taxonomies)
- REST API or WPGraphQL
- MySQL database

**Admin Web App**
- Secure admin routes in Next.js
- Role-based access control (RBAC)
- Content workflow (draft → review → publish)

---

## Page 7 — CMS Content Model
**Core Content Types**
- Pages (Home, About, Contact, Quality)
- Products (name, size, description, images, certificates)
- Blog/News (title, summary, body, tags)
- Media (images, PDFs, certificates)

**Taxonomies**
- Product Categories
- Blog Tags

---

## Page 8 — Admin Roles & Permissions
**Roles**
- Super Admin: full access
- Editor: create/edit/publish content
- Contributor: create/edit, pending approval
- Viewer: read-only access

**Permissions**
- Fine-grained access to content types
- Approval workflow for publishing
- Audit log of changes

---

## Page 9 — Core Features (Website)
- Responsive and mobile-first layout
- SEO and metadata setup (OpenGraph, schema)
- Performance optimization (Core Web Vitals)
- Analytics integration
- Contact form with email notification

---

## Page 10 — Core Features (Web App & CMS)
- Structured content editing (forms and validations)
- Image upload and optimization
- Draft/Review/Publish workflow
- Content preview before publishing
- Role-based access control

---

## Page 11 — Security & Compliance
- HTTPS enforced
- Input validation and sanitization
- Secure authentication for admins
- Protected admin routes
- Regular backups

---

## Page 12 — Performance & SEO Strategy
- Server-side rendering for critical pages
- Image optimization and lazy loading
- Optimized CSS and JS bundles
- SEO-friendly URLs and sitemap
- Schema markup for products and articles

---

## Page 13 — Analytics & Reporting
- Google Analytics 4 (or equivalent)
- Event tracking for CTA buttons and contact submissions
- Monthly performance reports (optional)

---

## Page 14 — Testing & QA
- Cross-browser testing (Chrome, Edge, Safari, Firefox)
- Responsive testing (desktop, tablet, mobile)
- Accessibility checks (WCAG 2.1 AA baseline)
- Performance testing and Lighthouse audits

---

## Page 15 — Deployment & Hosting
**Recommended Hosting**
- Frontend + Admin: Vercel
- CMS: Managed WordPress hosting or VPS
- Media: CDN-backed delivery

**Environments**
- Development
- Staging
- Production

---

## Page 16 — Project Timeline (Estimated)
- Discovery & Content Audit: 1 week
- UI/UX Adaptation: 2–3 weeks
- Frontend Development: 3–4 weeks
- CMS & Admin Development: 2–3 weeks
- QA & Launch: 1 week

**Total:** 9–12 weeks (subject to feedback cycles)

---

## Page 17 — Assumptions
- Content (copy, images, brand assets) provided by client.
- Final Figma design is approved before build starts.
- Client feedback within 2–3 business days.
- No third-party integrations beyond agreed scope.

---

## Page 18 — Acceptance Criteria
- Website matches approved Figma design.
- Admin users can create/edit/publish content without developer assistance.
- Performance meets Core Web Vitals targets.
- Site is SEO-ready and analytics are configured.

---

## Page 19 — Maintenance & Support (Optional)
- Content updates assistance
- Security and dependency updates
- Performance monitoring
- Backup verification

---

## Page 20 — Next Steps
- Confirm scope and any optional modules.
- Provide final content and brand assets.
- Approve the final Figma design for implementation.
- Kickoff meeting and timeline sign-off.
# Financial Proposal: Fizam Table Water Website (Next.js + Headless WP + Custom CMS)

Client reference design: https://panic-shred-66166669.figma.site/

## Executive Summary
This proposal provides a financial estimate to design and implement a marketing website for a table water production company, modeled after the referenced Figma layout. The solution includes a Next.js frontend, a WordPress Headless CMS for content, and a lightweight custom CMS layer for non-technical staff workflows. Hosting is planned on Vercel for the frontend, with WordPress hosted separately on a managed VPS or WP-optimized hosting.

## Scope Overview
- UI/UX design aligned with the Figma layout and content sections.
- Responsive frontend build (desktop, tablet, mobile).
- Headless WordPress setup (content types, taxonomies, media).
- Custom CMS layer (simplified admin experience, content approval flow).
- SEO, analytics, performance optimization, and deployment.

## Assumptions
- Final design is based on the reference structure and brand assets provided by the client.
- Content (text, images, product data) is supplied by the client.
- The custom CMS layer will include role-based access, simplified forms, and basic approvals.
- No e-commerce or payment processing is included in this phase.

## UI/UX Cost Estimate
The UI/UX estimate is based on a complete design pass for all pages listed below, including responsive states.

**Pages/Sections**
- Home
- About
- Products
- Blog
- Contact
- Global components (header, footer, CTA, sliders, cards)

**UI/UX Deliverables**
- Wireframes
- High-fidelity mockups
- Design system (colors, typography, spacing, buttons)
- Responsive variants (desktop/tablet/mobile)
- Clickable prototype

**Estimated Cost**
- UI/UX Design: **$2,200 – $3,500**

## Development Cost Estimate

### Frontend (Next.js on Vercel)
- Responsive implementation
- Performance optimization (Core Web Vitals)
- SEO meta, OpenGraph, structured data
- Analytics integration

Estimated Cost: **$4,500 – $6,500**

### Headless WordPress CMS
- Custom post types (Products, Blog, Pages)
- Taxonomies and media setup
- REST/GraphQL configuration
- Content modeling and data validation

Estimated Cost: **$2,000 – $3,000**

### Custom CMS Layer (Admin UX)
- Custom admin UI for non-technical users
- Role-based access
- Editorial workflow (draft, review, publish)
- Basic content audit log

Estimated Cost: **$2,800 – $4,000**

### Integration & QA
- End-to-end integration (Next.js + WP API)
- Cross-browser testing
- Performance checks and accessibility fixes

Estimated Cost: **$1,500 – $2,500**

## Total Project Estimate
**Overall Range:** **$13,000 – $19,500**

## Timeline Estimate
Assuming client feedback cycles within 2–3 business days.

- UI/UX Design: 2–3 weeks  
- Frontend Development: 3–4 weeks  
- CMS + Custom Admin: 2–3 weeks  
- QA + Deployment: 1 week  

**Total:** 8–11 weeks

## Intended Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS  
- **CMS (Headless):** WordPress + REST API (or WPGraphQL)  
- **Custom CMS Layer:** Next.js admin app + secure API routes  
- **Hosting:** Vercel (frontend + admin), Managed WP Hosting or VPS (CMS)  
- **Database:** MySQL (WordPress)  
- **Media:** WordPress media library + CDN  
- **Auth:** JWT or OAuth for admin access  

## Hosting & Ongoing Costs (Optional)
These are recurring costs not included in development estimate.

- Vercel Pro (frontend + admin): **$20–$60/mo**
- WP Hosting (managed VPS): **$20–$50/mo**
- CDN/Email services (optional): **$10–$40/mo**

## Optional Add-ons
- Multilingual support: **$1,500 – $2,500**
- Product catalog filters: **$800 – $1,500**
- Gallery/video production page: **$700 – $1,200**
- Content migration: **$500 – $1,000**

## Payment Schedule (Suggested)
- 40% upfront to begin UI/UX  
- 30% after UI/UX approval  
- 30% after final deployment  

## Notes
- Estimates are based on the current scope and reference structure.  
- Any major change in content scale or features may affect cost and timeline.  
- Proposal is valid for 30 days from issuance.  
