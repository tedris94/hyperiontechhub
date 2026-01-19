# Hyperion Tech Hub - Complete Style Guide for Cursor AI

## 🎨 BRAND COLORS

```css
/* Primary Colors */
--persian-blue: #1A2BC2;      /* Primary brand color - buttons, links, accents */
--midnight-blue: #0D0D52;     /* Secondary/hover states */
--eerie-black: #1B1C1E;       /* Primary text color */

/* Neutral Colors */
--white: #ffffff;
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-600: #4b5563;          /* Body text */
--gray-700: #374151;

/* Semantic Colors */
--destructive: #d4183d;       /* Error states */
--success: #10b981;
--warning: #f59e0b;
```

---

## 📝 TYPOGRAPHY

### Font Families
```css
/* Import in CSS */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

/* Usage */
--font-poppins: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Apply to elements */
body { font-family: 'Inter', sans-serif; }
h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
```

### Typography Scale (Tailwind Classes)

```
HERO/DISPLAY TEXT (H1):
- Desktop: text-5xl md:text-6xl lg:text-7xl (48px → 60px → 72px)
- Font: Poppins
- Weight: Default (don't specify)
- Color: text-[#1B1C1E] or text-[#1A2BC2]
- Leading: leading-tight
- Example: "Welcome to Hyperion Tech Hub"

SECTION HEADINGS (H2):
- Desktop: text-4xl md:text-5xl (36px → 48px)
- Font: Poppins (inherited)
- Color: text-[#1B1C1E]
- Example: "Our Services"

SUBSECTION HEADINGS (H3):
- Desktop: text-xl (20px)
- Font: Poppins (inherited)
- Color: text-[#1B1C1E]
- Example: Service card titles

BODY TEXT:
- Desktop: text-xl for large body (20px)
- Regular: text-base (16px)
- Small: text-sm (14px)
- Font: Inter (inherited)
- Color: text-gray-600
- Leading: leading-relaxed

STATS/NUMBERS:
- Size: text-3xl (30px)
- Color: text-[#1A2BC2]
- Font: Poppins (inherited)
```

---

## 🎯 COMPONENT PATTERNS

### Buttons

```jsx
/* Primary Button */
<Button 
  size="lg" 
  className="bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-8 group"
>
  Explore Services
  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
</Button>

/* Outline Button */
<Button 
  size="lg" 
  variant="outline" 
  className="border-[#1A2BC2] text-[#1A2BC2] hover:bg-[#1A2BC2] hover:text-white"
>
  Get Started
</Button>
```

### Cards

```jsx
<Card 
  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
>
  <CardContent className="p-8">
    {/* Icon container with colored background */}
    <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#1A2BC2] flex items-center justify-center mb-6">
      <Icon className="w-7 h-7" />
    </div>
    
    {/* Title */}
    <h3 className="text-xl text-[#1B1C1E] mb-3">
      Service Title
    </h3>
    
    {/* Description */}
    <p className="text-gray-600 leading-relaxed">
      Service description text goes here
    </p>
  </CardContent>
</Card>
```

### Navigation Links

```jsx
{/* Desktop Navigation */}
<Link
  to={link.href}
  className={`transition-colors ${
    location.pathname === link.href
      ? "text-[#1A2BC2]"
      : "text-[#1B1C1E] hover:text-[#1A2BC2]"
  }`}
>
  {link.label}
</Link>
```

### Badge/Pill Component

```jsx
<div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full">
  <Sparkles className="w-4 h-4 text-[#1A2BC2]" />
  <span className="text-sm text-[#1A2BC2]">Your Technology Partner</span>
</div>
```

---

## 📐 SPACING & LAYOUT

### Container
```jsx
<div className="container mx-auto px-4 lg:px-8">
  {/* Content */}
</div>
```

### Section Spacing
```jsx
/* Standard section */
<section className="py-24 bg-gray-50">
  {/* Content */}
</section>

/* Hero section */
<section className="relative min-h-screen flex items-center pt-20">
  {/* Content */}
</section>
```

### Grid Layouts
```jsx
/* 2-column layout */
<div className="grid lg:grid-cols-2 gap-12 items-center">

/* 3-column services grid */
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

/* Stats grid */
<div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
```

---

## 🎭 EFFECTS & INTERACTIONS

### Transitions
```css
/* Smooth color transitions */
transition-colors

/* Transform transitions */
transition-all duration-300

/* Hover effects */
hover:shadow-xl transition-all duration-300 hover:-translate-y-1

/* Button icon animation */
group-hover:translate-x-1 transition-transform
```

### Gradients
```jsx
/* Background gradient */
<div className="absolute inset-0 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5 -z-10" />

/* Image overlay */
<div className="absolute inset-0 bg-gradient-to-t from-[#0D0D52]/40 to-transparent" />
```

### Shadows
```css
shadow-lg         /* Default card shadow */
shadow-xl         /* Hover card shadow */
shadow-2xl        /* Hero image shadow */
shadow-md         /* Scrolled header */
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints (Tailwind)
```
sm:  640px   (mobile landscape)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
```

### Mobile-First Examples
```jsx
/* Typography responsive */
<h1 className="text-5xl md:text-6xl lg:text-7xl">

/* Layout responsive */
<div className="grid lg:grid-cols-2 gap-12">

/* Image height responsive */
<div className="relative lg:h-[600px] h-[400px]">

/* Button stack on mobile */
<div className="flex flex-col sm:flex-row gap-4">

/* Hide on mobile */
<nav className="hidden md:flex">

/* Show only on mobile */
<button className="md:hidden">
```

---

## 🎨 COLOR USAGE GUIDE

### Where to Use Each Color

**#1A2BC2 (Persian Blue) - Primary Brand Color**
- Primary buttons background
- Active navigation links
- Icon backgrounds
- Stats numbers
- Primary accents and highlights
- Links hover state

**#0D0D52 (Midnight Blue) - Secondary**
- Button hover states
- Darker accents
- Gradients

**#1B1C1E (Eerie Black) - Text**
- All headings
- Body text (alternative)
- Navigation links default
- Logo text

**Gray Variations**
- gray-50/gray-100: Section backgrounds
- gray-200: Borders, dividers
- gray-600: Body text, descriptions
- white: Card backgrounds, text on dark

---

## 🏗️ COMPLETE SECTION EXAMPLES

### Hero Section
```jsx
<section id="home" className="relative min-h-screen flex items-center pt-20">
  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5 -z-10" />
  
  <div className="container mx-auto px-4 lg:px-8 py-20">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Content */}
      <div className="space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full">
          <Sparkles className="w-4 h-4 text-[#1A2BC2]" />
          <span className="text-sm text-[#1A2BC2]">Your Technology Partner</span>
        </div>
        
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl text-[#1B1C1E] leading-tight">
          <span className="block">Welcome to</span>
          <span className="block text-[#1A2BC2]">Hyperion Tech Hub</span>
        </h1>
        
        {/* Description */}
        <p className="text-xl text-gray-600 max-w-xl">
          A one-stop destination for tech solutions, education, and innovation.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-[#1A2BC2] hover:bg-[#0D0D52] text-white px-8">
            Explore Services
          </Button>
          <Button size="lg" variant="outline" className="border-[#1A2BC2] text-[#1A2BC2] hover:bg-[#1A2BC2] hover:text-white">
            Get Started
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
          <div>
            <div className="text-3xl text-[#1A2BC2] mb-1">10+</div>
            <div className="text-sm text-gray-600">Services</div>
          </div>
        </div>
      </div>
      
      {/* Right Image */}
      <div className="relative lg:h-[600px] h-[400px] rounded-2xl overflow-hidden shadow-2xl">
        <img src="image-url" alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D52]/40 to-transparent" />
      </div>
    </div>
  </div>
</section>
```

### Services Section
```jsx
<section id="services" className="py-24 bg-gray-50">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Section Header */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
        Our Services
      </h2>
      <p className="text-xl text-gray-600">
        Comprehensive technology solutions
      </p>
    </div>

    {/* Services Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Service cards here */}
    </div>
  </div>
</section>
```

---

## 🎯 HEADER COMPONENT

```jsx
<header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="flex items-center justify-between h-20">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-[#1A2BC2] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <span className="text-xl text-[#1B1C1E] font-semibold">
          Hyperion Tech Hub
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {/* Links */}
      </nav>
      
      {/* CTA Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Buttons */}
      </div>
    </div>
  </div>
</header>
```

---

## ✅ KEY DESIGN PRINCIPLES

1. **Clean & Professional**: Minimal clutter, clear hierarchy
2. **Consistent Spacing**: Use py-24 for sections, gap-8 for grids
3. **Smooth Transitions**: Always use transition classes
4. **Accessible Colors**: High contrast ratios for text
5. **Mobile-First**: Start with mobile, enhance for desktop
6. **Brand Consistency**: Always use #1A2BC2 for primary actions

---

## 📦 TAILWIND UTILITY CLASSES REFERENCE

```
SPACING:
p-8         padding: 2rem
px-4        padding-left/right: 1rem
py-24       padding-top/bottom: 6rem
gap-8       gap: 2rem
space-y-8   margin-bottom: 2rem (between children)

SIZING:
w-10        width: 2.5rem
h-20        height: 5rem
max-w-3xl   max-width: 48rem
min-h-screen min-height: 100vh

BORDERS:
rounded-lg      border-radius: 0.5rem
rounded-xl      border-radius: 0.75rem
rounded-2xl     border-radius: 1rem
rounded-full    border-radius: 9999px

SHADOWS:
shadow-lg       box-shadow large
shadow-xl       box-shadow extra large
shadow-2xl      box-shadow 2x extra large

TRANSFORMS:
hover:-translate-y-1  Move up on hover
scale-105             Scale to 105%

FILTERS:
backdrop-blur-sm      Blur background
```

---

## 🚀 IMPLEMENTATION CHECKLIST

When building with Cursor AI, ensure:

- [ ] Import Poppins & Inter fonts in globals.css
- [ ] Set body font to Inter, headings to Poppins
- [ ] Use #1A2BC2 for all primary actions
- [ ] Use #1B1C1E for all text headings
- [ ] Use text-gray-600 for body text
- [ ] Include hover states on all interactive elements
- [ ] Make all sections responsive (mobile-first)
- [ ] Add smooth transitions (transition-all duration-300)
- [ ] Use container mx-auto px-4 lg:px-8 for all sections
- [ ] Test at breakpoints: 375px, 768px, 1024px, 1440px

---

**Last Updated:** January 2026
**Version:** 1.0
**Project:** Hyperion Tech Hub Website
