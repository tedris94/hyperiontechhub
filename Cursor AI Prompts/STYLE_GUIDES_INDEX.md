# 📚 HYPERION TECH HUB - STYLE GUIDES INDEX
**Complete Design System Reference | Version 1.0**

---

## 🎯 OVERVIEW

This directory contains comprehensive style guides for every page and component of the Hyperion Tech Hub website. Each guide includes exact Tailwind CSS classes, component patterns, responsive behavior, and ready-to-use Cursor AI prompts.

---

## 📋 AVAILABLE STYLE GUIDES

### 1️⃣ **HYPERION_STYLE_GUIDE.md** - Master Foundation
**Core design system for home page components**

**Includes:**
- Complete typography system (Poppins, Inter, Clinton)
- Brand colors (#1A2BC2, #0D0D52, #1B1C1E)
- Button patterns (Primary, Outline, Full-width)
- Card components with hover effects
- Form inputs & controls
- Icon containers (3 sizes)
- Navigation links
- Badge/pill components
- Gradient overlays
- List with custom bullets
- Hero section
- Services section
- Contact/Get in Touch section
- About/Our Purpose section
- Header component
- Footer component (5 columns)
- Back to Top button
- Complete spacing & layout system
- Responsive breakpoints

**Best For:** Home page, general component reference, brand consistency

---

### 2️⃣ **SERVICES_PAGE_GUIDE.md** - Services Overview
**Comprehensive services showcase page**

**Includes:**
- Hero section with gradient background
- Service card component with colored icons
- 3-column responsive grid
- Feature lists with checkmarks
- Service category colors (9 variations)
- "Why Choose Us" section
- Call-to-action section with gradient
- Badge components for subtitles
- Equal height cards
- Hover effects and transitions

**Best For:** Services page, feature showcases, product listings

---

### 3️⃣ **TEAM_PAGE_GUIDE.md** - Team Showcase
**Professional team member profiles**

**Includes:**
- Hero section
- Leadership cards (large format, 320px images)
- Team member cards (compact, 256px images)
- Profile photos with gradient overlays
- Social media links (LinkedIn, Twitter, Email)
- Image zoom on hover
- "Join Our Team" CTA section
- Two-tier layout (leadership + team)
- Circular social icons with hover
- Card lift animations

**Best For:** Team pages, about pages, leadership showcases

---

### 4️⃣ **PORTFOLIO_PAGE_GUIDE.md** - Project Showcase
**Portfolio with tabbed filtering**

**Includes:**
- Sticky tabbed filter system
- Project cards with image zoom
- Hover overlay with "View Project" button
- Tech stack badges
- Project detail page layout
- Challenge/Solution/Results sections
- Project info sidebar
- Stats section (4 metrics)
- Clickable cards
- Category filtering (Web, Mobile, Cloud, AI/ML, Design)
- Line-clamp for descriptions

**Best For:** Portfolio pages, case studies, project galleries

---

### 5️⃣ **DASHBOARD_GUIDE.md** - Admin Dashboards
**Role-based dashboard system**

**Includes:**
- Fixed sidebar navigation (256px width)
- Top header bar with breadcrumbs
- Role-specific menu items (7 roles)
- Stat cards with icons
- Data tables with actions
- Mobile responsive sidebar toggle
- User profile dropdown
- Search and notifications
- Active state highlighting
- Badge notifications
- Dashboard color system
- Loading states

**Roles Covered:**
- Super Admin (full system access)
- Admin (content & user management)
- Subscriber (resources & subscriptions)
- Student (courses, assignments, grades)
- Consultant (appointments, clients)
- Instructor (classes, students, materials)
- Client (projects, invoices, support)

**Best For:** Admin panels, user dashboards, management interfaces

---

### 6️⃣ **AUTHENTICATION_GUIDE.md** - Login & Register
**Split-screen authentication pages**

**Includes:**
- Split-screen layout (50/50)
- Gradient brand panel with decorative circles
- Login form with remember me
- Register form with password strength indicator
- Input fields with left icons
- Password visibility toggle
- Social login buttons (Google, GitHub)
- "Forgot password?" link
- Terms & conditions checkbox
- Error/success alerts
- "Or continue with" divider
- Mobile responsive (stacks vertically)

**Best For:** Login pages, registration forms, authentication flows

---

### 7️⃣ **DOCUMENTS_GUIDE.md** - Document Management
**Quotes, Purchase Orders & Invoices system**

**Includes:**
- Documents list with filtering
- Document number format (PREFIX-DDMMYYYY-XXXX)
- Professional document layout
- Line items table
- Automatic VAT calculation (7.5%)
- Payment terms (Net 14 days)
- Create/Edit forms
- Role-based permissions (Admin/Super Admin)
- Download PDF & Print functions
- Status badges (Paid, Pending, Overdue)
- Type badges (Quote, PO, Invoice)
- Dynamic line item management

**Best For:** Invoice systems, quote generators, document management

---

### 8️⃣ **TRAINING_PAGE_GUIDE.md** - Corporate Training
**Professional development programs**

**Includes:**
- Split hero (text left, image right)
- Training program cards (2-column grid)
- Duration and participants meta info
- Topic pills with brand colors
- Benefits section with CheckCircle icons
- Award icon in benefits header
- "Request a Consultation" CTA
- Customized curriculum emphasis
- Professional development focus

**Best For:** Training programs, educational services, corporate workshops

---

### 9️⃣ **COURSES_PAGE_GUIDE.md** - Online Courses
**Self-paced learning catalog**

**Includes:**
- Centered hero section
- Course cards with featured images (3-column grid)
- Level badges (Beginner, Intermediate, Advanced)
- Star ratings with yellow filled icons
- Student enrollment counts
- Pricing display in large brand blue
- "Enroll Now" button with Play icon
- Instructor information
- Features section with icon circles
- Line-clamped descriptions

**Best For:** Online courses, e-learning platforms, course catalogs

---

### 🔟 **CONSULTANCY_PAGE_GUIDE.md** - Consultancy Services
**Expert technology consulting**

**Includes:**
- Split hero with Briefcase icon badge
- Consulting service cards (3-column grid)
- Features lists with CheckCircle icons
- 4-step process timeline with numbered circles
- Stats section (3 metrics with large icons)
- "Schedule a Consultation" CTA
- Process methodology showcase
- Client satisfaction metrics

**Best For:** Consulting services, professional services, B2B offerings

---

## 🎨 BRAND IDENTITY

### Colors:
```css
Primary:    #1A2BC2  (Persian Blue)
Secondary:  #0D0D52  (Midnight Blue)
Text:       #1B1C1E  (Eerie Black)
Gray-50:    Section backgrounds
Gray-100:   Card borders
Gray-200:   Dividers
Gray-600:   Body text
White:      Card backgrounds
```

### Typography:
```css
Headings:   Poppins (font-family: Poppins)
Body:       Inter (font-family: Inter)
Accent:     Clinton (optional, for special elements)
```

### Spacing:
```css
Sections:   py-24 (96px vertical padding)
Grids:      gap-8 (32px gap)
Cards:      p-6 or p-8 (24px or 32px padding)
Container:  mx-auto px-4 lg:px-8
```

---

## 🚀 HOW TO USE THESE GUIDES

### With Cursor AI:

1. **Open the relevant guide** for the page/component you're building
2. **Copy the Cursor AI prompt** at the bottom of each guide
3. **Paste into Cursor AI** and customize as needed
4. **Reference code examples** in the guide for specific components

### Example Workflow:

```bash
# Building a Services page
1. Open SERVICES_PAGE_GUIDE.md
2. Review the hero section structure
3. Copy service card component code
4. Use the Cursor AI prompt to generate full page
5. Customize colors, content, and features
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
sm:  640px   (mobile landscape)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
```

**Mobile-First Approach:**
- Start with mobile layout
- Add `md:` and `lg:` prefixes for larger screens
- Use `hidden lg:flex` to show/hide elements

---

## ✅ DESIGN PRINCIPLES

1. **Clean & Professional** - Minimal clutter, clear hierarchy
2. **Consistent Spacing** - Use py-24 for sections, gap-8 for grids
3. **Smooth Transitions** - Always add transition classes
4. **Accessible Colors** - High contrast ratios (WCAG AA)
5. **Mobile-First** - Start mobile, enhance for desktop
6. **Brand Consistency** - Always use #1A2BC2 for primary actions

---

## 🎯 QUICK REFERENCE

### Common Patterns:

**Hero Section:**
```jsx
<section className="pt-32 pb-16 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
  {/* Badge + Heading + Description */}
</section>
```

**Card with Hover:**
```jsx
<Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
  {/* Content */}
</Card>
```

**Primary Button:**
```jsx
<Button className="bg-[#1A2BC2] hover:bg-[#0D0D52] text-white group">
  Action
  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
</Button>
```

**Input with Icon:**
```jsx
<div className="relative">
  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  <Input className="pl-10 h-12 border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]" />
</div>
```

---

## 📞 CONTACT INFORMATION (For Use in Designs)

```
Company:  Hyperion Tech Hub
Phone:    +234 906 4951 938
Email:    info@hyperiontechhub.com
Address:  Plot 624, No. 9 Clifford Omozeghian Ave.
          Gbazango Extension II, Arab Road
          Arab Junction by Kubwa Express
          Kubwa, FCT-Abuja
Website:  www.hyperiontechhub.com
```

---

## 🔧 COMPONENT LIBRARY

All guides use these UI components from `/components/ui/`:
- Button
- Card / CardContent / CardHeader / CardTitle
- Input
- Textarea
- Select
- Badge
- Tabs / TabsList / TabsTrigger / TabsContent
- Table / TableHeader / TableBody / TableRow / TableCell
- DropdownMenu
- Alert / AlertTitle / AlertDescription
- Checkbox
- Dialog
- Tooltip

**Icons:** Lucide React (`lucide-react`)

---

## 📊 PAGE STATUS MATRIX

| Page Type | Style Guide | Status | Components |
|-----------|-------------|--------|------------|
| Home | HYPERION_STYLE_GUIDE.md | ✅ Complete | Hero, Services, About, Contact, Footer |
| Services | SERVICES_PAGE_GUIDE.md | ✅ Complete | Service Cards, Grid, CTA |
| Team | TEAM_PAGE_GUIDE.md | ✅ Complete | Leadership, Team Cards, Social |
| Portfolio | PORTFOLIO_PAGE_GUIDE.md | ✅ Complete | Tabs, Project Cards, Detail Page |
| Dashboard | DASHBOARD_GUIDE.md | ✅ Complete | Sidebar, Header, Stats, Tables |
| Login/Register | AUTHENTICATION_GUIDE.md | ✅ Complete | Split Screen, Forms, Validation |
| Documents | DOCUMENTS_GUIDE.md | ✅ Complete | List, View, Create/Edit Forms |
| Training | TRAINING_PAGE_GUIDE.md | ✅ Complete | Programs, Topic Pills, Benefits |
| Courses | COURSES_PAGE_GUIDE.md | ✅ Complete | Course Cards, Ratings, Enrollment |
| Consultancy | CONSULTANCY_PAGE_GUIDE.md | ✅ Complete | Services, Process, Stats |

---

## 🎓 LEARNING PATH

**New to Hyperion Tech Hub design system?**

1. Start with **HYPERION_STYLE_GUIDE.md** to understand core components
2. Review **brand colors and typography** sections
3. Study **button and card patterns** for consistency
4. Explore **page-specific guides** as needed
5. Use **Cursor AI prompts** to generate pages quickly
6. Customize and adapt to specific requirements

---

## 🔄 VERSION HISTORY

**Version 1.0** - January 2026
- Initial release
- 10 comprehensive style guides
- Full component library documentation
- Role-based dashboard specifications
- Document management system
- Authentication flows
- Training, Courses, and Consultancy pages

---

## 📝 NOTES FOR DEVELOPERS

### When Building New Pages:

1. **Check if a guide exists** for similar page type
2. **Use existing components** from style guides
3. **Maintain brand colors** and spacing
4. **Follow responsive patterns** (mobile-first)
5. **Add hover effects** to interactive elements
6. **Test at all breakpoints** (375px, 768px, 1024px, 1440px)

### When Adding New Features:

1. **Reference similar patterns** in existing guides
2. **Maintain consistency** with established designs
3. **Document new patterns** if creating original components
4. **Update this index** when adding new guides

---

## 🚀 QUICK START COMMANDS

```bash
# View all style guides
ls -la *.md

# Search for specific component
grep -r "Button" *.md

# Open specific guide
cat SERVICES_PAGE_GUIDE.md

# Find color usage
grep -r "#1A2BC2" *.md
```

---

## 💡 PRO TIPS

1. **Copy exact class names** - Don't approximate, use exact Tailwind classes
2. **Use group utilities** - For parent-child hover effects
3. **Add transitions** - Always include `transition-` classes
4. **Test hover states** - Every interactive element should have one
5. **Check mobile first** - Always view on mobile before desktop
6. **Use consistent spacing** - py-24 for sections, gap-8 for grids
7. **Follow color system** - #1A2BC2 for primary, #0D0D52 for hover

---

**Last Updated:** January 2026  
**Total Guides:** 10  
**Total Pages Documented:** 20+  
**Components Documented:** 75+

**Maintained By:** Hyperion Tech Hub Development Team  
**For Questions:** Refer to individual guide files or contact development lead

---

## 🎉 YOU'RE READY TO BUILD!

All the design patterns, components, and specifications you need are documented in these guides. Simply open the relevant guide, copy the code or prompt, and start building beautiful, consistent pages for Hyperion Tech Hub.

Happy Coding! 🚀