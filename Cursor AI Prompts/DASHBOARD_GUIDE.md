# 📊 DASHBOARD - STYLE GUIDE
**Hyperion Tech Hub | Dashboard Design System**

---

## 📋 DASHBOARD OVERVIEW

The Hyperion Tech Hub platform includes seven role-based dashboards with custom navigation menus and role-specific functionality. Each dashboard features a sidebar navigation, main content area, and consistent header with user profile dropdown.

---

## 🎨 DASHBOARD TYPES

```
1. Super Admin Dashboard  - Full system access & management
2. Admin Dashboard        - Content & user management
3. Subscriber Dashboard   - Resource access & subscriptions
4. Student Dashboard      - Courses, assignments, grades
5. Consultant Dashboard   - Appointments, clients, projects
6. Instructor Dashboard   - Classes, students, materials
7. Client Dashboard       - Projects, invoices, support
```

---

## 🏗️ DASHBOARD LAYOUT STRUCTURE

```jsx
<div className="flex h-screen bg-gray-50">
  {/* Sidebar Navigation */}
  <aside className="w-64 bg-[#0D0D52] text-white flex flex-col">
    {/* Logo */}
    {/* Navigation Menu */}
    {/* User Profile Section */}
  </aside>
  
  {/* Main Content Area */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Top Header Bar */}
    <header className="bg-white border-b border-gray-200 h-16">
      {/* Breadcrumbs, Search, Notifications, Profile */}
    </header>
    
    {/* Content Scroll Area */}
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Content */}
      </div>
    </main>
  </div>
</div>
```

---

## 🎯 SIDEBAR NAVIGATION

```jsx
<aside className="w-64 bg-[#0D0D52] text-white flex flex-col h-screen fixed left-0 top-0">
  {/* Logo Section */}
  <div className="p-6 border-b border-white/10">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-[#1A2BC2] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xl">H</span>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Hyperion Tech Hub</h2>
        <p className="text-xs text-gray-400">Admin Dashboard</p>
      </div>
    </div>
  </div>
  
  {/* Navigation Menu */}
  <nav className="flex-1 overflow-y-auto py-6 px-3">
    <div className="space-y-1">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            location.pathname === item.path
              ? 'bg-[#1A2BC2] text-white'
              : 'text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
          {item.badge && (
            <Badge className="ml-auto bg-red-500 text-white">
              {item.badge}
            </Badge>
          )}
        </Link>
      ))}
    </div>
    
    {/* Section Divider */}
    <div className="my-6 border-t border-white/10"></div>
    
    {/* Secondary Menu */}
    <div className="space-y-1">
      {secondaryItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  </nav>
  
  {/* User Profile Section */}
  <div className="p-6 border-t border-white/10">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-[#1A2BC2] flex items-center justify-center">
        <span className="text-white font-semibold">JD</span>
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">John Doe</div>
        <div className="text-xs text-gray-400">john@example.com</div>
      </div>
      <button className="text-gray-400 hover:text-white">
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  </div>
</aside>
```

### Sidebar Key Styles:
```css
/* Sidebar Container */
w-64                      /* 256px width */
bg-[#0D0D52]             /* Midnight blue background */
text-white                /* White text */
fixed left-0 top-0        /* Fixed position */
h-screen                  /* Full viewport height */

/* Active Menu Item */
bg-[#1A2BC2]             /* Persian blue background */
text-white                /* White text */

/* Hover Menu Item */
hover:bg-white/10         /* Semi-transparent white */
hover:text-white          /* White text */

/* Dividers */
border-white/10           /* Semi-transparent border */
```

---

## 📊 TOP HEADER BAR

```jsx
<header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
  {/* Left Side - Breadcrumbs */}
  <div className="flex items-center space-x-4">
    <button className="lg:hidden text-gray-600 hover:text-[#1A2BC2]">
      <Menu className="w-6 h-6" />
    </button>
    
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Overview</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
  
  {/* Right Side - Actions */}
  <div className="flex items-center space-x-4">
    {/* Search */}
    <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2">
      <Search className="w-4 h-4 text-gray-400 mr-2" />
      <input 
        type="text" 
        placeholder="Search..."
        className="bg-transparent border-none outline-none text-sm w-48"
      />
    </div>
    
    {/* Notifications */}
    <button className="relative p-2 text-gray-600 hover:text-[#1A2BC2] hover:bg-gray-100 rounded-lg transition-colors">
      <Bell className="w-5 h-5" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>
    
    {/* User Profile Dropdown */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#1A2BC2] flex items-center justify-center">
            <span className="text-white text-sm font-semibold">JD</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <User className="mr-2 w-4 h-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 w-4 h-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <LogOut className="mr-2 w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</header>
```

---

## 📈 DASHBOARD STATS CARDS

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {/* Stat Card */}
  <Card className="border-none shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#1A2BC2] flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
        <Badge variant="secondary" className="bg-green-50 text-green-600 border-none">
          +12.5%
        </Badge>
      </div>
      
      <div className="text-3xl text-[#1B1C1E] mb-1">
        2,543
      </div>
      <div className="text-sm text-gray-600">
        Total Users
      </div>
    </CardContent>
  </Card>
  
  {/* More stat cards... */}
</div>
```

### Stat Card Color Variations:
```css
/* Blue - Users/Clients */
bg-blue-50 text-[#1A2BC2]

/* Green - Revenue/Success */
bg-green-50 text-green-600

/* Orange - Pending/Warnings */
bg-orange-50 text-orange-600

/* Purple - Projects/Courses */
bg-purple-50 text-purple-600
```

---

## 📋 DATA TABLE COMPONENT

```jsx
<Card className="border-none shadow-lg">
  <CardHeader>
    <CardTitle className="text-xl text-[#1B1C1E]">Recent Activity</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} className="hover:bg-gray-50">
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#1A2BC2]/10 flex items-center justify-center">
                  <span className="text-sm text-[#1A2BC2] font-medium">
                    {item.initials}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-[#1B1C1E]">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.subtitle}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge 
                className={`${
                  item.status === 'Active' 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-gray-100 text-gray-600'
                } border-none`}
              >
                {item.status}
              </Badge>
            </TableCell>
            <TableCell className="text-gray-600">{item.date}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

---

## 🎨 DASHBOARD COLOR SYSTEM

```css
/* Backgrounds */
bg-gray-50                /* Page background */
bg-white                  /* Card backgrounds */
bg-[#0D0D52]             /* Sidebar background */
bg-[#1A2BC2]             /* Active states, primary buttons */

/* Text Colors */
text-[#1B1C1E]           /* Headings, primary text */
text-gray-600             /* Body text, secondary */
text-gray-400             /* Muted text, placeholders */
text-white                /* Sidebar text */

/* Status Colors */
bg-green-50 text-green-600    /* Success, active, completed */
bg-orange-50 text-orange-600  /* Warning, pending */
bg-red-50 text-red-600        /* Error, inactive */
bg-blue-50 text-[#1A2BC2]     /* Info, default */
```

---

## 📊 ROLE-SPECIFIC MENU ITEMS

### Super Admin Menu:
```jsx
const superAdminMenu = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Users, label: 'User Management', path: '/dashboard/users' },
  { icon: FileText, label: 'Content Management', path: '/dashboard/content' },
  { icon: BarChart, label: 'Analytics & Reports', path: '/dashboard/reports' },
  { icon: Settings, label: 'System Settings', path: '/dashboard/settings' },
  { icon: Shield, label: 'Security', path: '/dashboard/security' },
  { icon: Database, label: 'Database', path: '/dashboard/database' },
];
```

### Student Menu:
```jsx
const studentMenu = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'My Courses', path: '/dashboard/courses' },
  { icon: FileText, label: 'Assignments', path: '/dashboard/assignments' },
  { icon: Award, label: 'Grades', path: '/dashboard/grades' },
  { icon: Download, label: 'Resources', path: '/dashboard/resources' },
  { icon: Certificate, label: 'Certificates', path: '/dashboard/certificates' },
];
```

### Consultant Menu:
```jsx
const consultantMenu = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments', badge: '3' },
  { icon: Users, label: 'My Clients', path: '/dashboard/clients' },
  { icon: Briefcase, label: 'Projects', path: '/dashboard/projects' },
  { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
  { icon: BookOpen, label: 'Resources', path: '/dashboard/resources' },
];
```

### Client Menu:
```jsx
const clientMenu = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'My Projects', path: '/dashboard/projects' },
  { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
  { icon: Receipt, label: 'Invoices', path: '/dashboard/invoices' },
  { icon: MessageSquare, label: 'Support', path: '/dashboard/support' },
];
```

---

## 📱 MOBILE RESPONSIVE SIDEBAR

```jsx
{/* Mobile Menu Toggle */}
<button 
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1A2BC2] text-white rounded-lg"
>
  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
</button>

{/* Mobile Sidebar Overlay */}
{mobileMenuOpen && (
  <>
    <div 
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={() => setMobileMenuOpen(false)}
    />
    <aside className={`fixed left-0 top-0 z-50 w-64 h-screen bg-[#0D0D52] transform transition-transform duration-300 lg:translate-x-0 ${
      mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Sidebar content */}
    </aside>
  </>
)}

{/* Main Content with Sidebar Offset */}
<main className="lg:ml-64 min-h-screen">
  {/* Content */}
</main>
```

---

## ✅ DASHBOARD CHECKLIST

When building dashboards:

- [ ] Implement fixed sidebar navigation
- [ ] Create role-specific menu items
- [ ] Add active state highlighting
- [ ] Include top header bar with breadcrumbs
- [ ] Add search, notifications, profile dropdown
- [ ] Create stat cards with icons
- [ ] Implement data tables with actions
- [ ] Add mobile responsive sidebar toggle
- [ ] Include user profile section in sidebar
- [ ] Add badge notifications on menu items
- [ ] Use consistent color system
- [ ] Implement smooth transitions
- [ ] Add hover states to all interactive elements
- [ ] Include loading states for data
- [ ] Make tables scrollable on overflow

---

## 🚀 CURSOR AI PROMPT

```
Create a role-based dashboard for Hyperion Tech Hub using the Dashboard Style Guide.
Include:
- Fixed sidebar (256px width) with #0D0D52 background
- Logo section at top
- Navigation menu with icons and active states (#1A2BC2 for active)
- User profile section at bottom
- Top header bar (64px height) with breadcrumbs, search, notifications
- Main content area with:
  - 4 stat cards in responsive grid
  - Data table with hover effects
  - Action dropdown menus
- Mobile responsive with hamburger menu toggle
- Smooth transitions on all interactions

Use brand colors #1A2BC2 (Persian Blue) and #0D0D52 (Midnight Blue).
Make sidebar fixed and content scrollable.
```

---

**Last Updated:** January 2026
**Version:** 1.0
**Page Type:** Admin Dashboard
