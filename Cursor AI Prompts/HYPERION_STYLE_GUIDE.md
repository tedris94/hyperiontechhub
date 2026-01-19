/NUMBERS:
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

/* Full Width Button with Icon */
<Button 
  type="submit"
  className="w-full bg-[#1A2BC2] hover:bg-[#0D0D52] text-white group"
  size="lg"
>
  Send Message
  <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

### Form Inputs & Controls

```jsx
/* Text Input */
<Input
  id="name"
  type="text"
  placeholder="John Doe"
  required
  className="border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
/>

/* Select Dropdown */
<select
  id="service"
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1A2BC2] focus:ring-2 focus:ring-[#1A2BC2]/20"
>
  <option value="">Select a service</option>
  <option value="ai-coding">AI & Native Coding</option>
</select>

/* Textarea */
<Textarea
  id="message"
  placeholder="Tell us about your project..."
  rows={5}
  required
  className="border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2] resize-none"
/>

/* Form Label */
<label htmlFor="name" className="text-[#1B1C1E]">
  Full Name
</label>
```

### Icon Containers

```jsx
/* Small Icon Box - Contact Cards */
<div className="w-12 h-12 rounded-lg bg-[#1A2BC2]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A2BC2] transition-colors">
  <Mail className="w-6 h-6 text-[#1A2BC2] group-hover:text-white transition-colors" />
</div>

/* Medium Icon Box - Service Cards */
<div className="w-14 h-14 rounded-xl bg-blue-50 text-[#1A2BC2] flex items-center justify-center mb-6">
  <Icon className="w-7 h-7" />
</div>

/* Large Icon Circle - Values/Features */
<div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center">
  <Target className="w-8 h-8 text-[#1A2BC2]" />
</div>
```

### List with Bullets

```jsx
<ul className="space-y-3">
  <li className="flex items-center text-gray-700">
    <div className="w-2 h-2 rounded-full bg-[#1A2BC2] mr-3"></div>
    24/7 Customer Support
  </li>
  <li className="flex items-center text-gray-700">
    <div className="w-2 h-2 rounded-full bg-[#1A2BC2] mr-3"></div>
    Expert Technical Team
  </li>
</ul>
```

### Gradient Boxes

```jsx
/* Background Gradient Overlay */
<div className="absolute inset-0 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5 -z-10" />

/* Image Gradient Overlay */
<div className="absolute inset-0 bg-gradient-to-t from-[#0D0D52]/40 to-transparent" />
<div className="absolute inset-0 bg-gradient-to-tr from-[#1A2BC2]/30 to-transparent" />

/* Gradient Content Box */
<div className="bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52] rounded-2xl p-12 text-white">
  <p className="text-2xl leading-relaxed">
    Content with <span className="font-semibold">emphasized text</span>
  </p>
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

### Get in Touch / Contact Section
```jsx
<section id="contact" className="py-24 bg-gray-50">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Section Header */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
        Get in Touch
      </h2>
      <p className="text-xl text-gray-600">
        Ready to transform your technology experience? Let's start a conversation.
      </p>
    </div>

    {/* Two Column Layout */}
    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      
      {/* LEFT COLUMN - Contact Info */}
      <div className="space-y-8">
        {/* Intro Text */}
        <div>
          <h3 className="text-2xl text-[#1B1C1E] mb-4">
            Let's Connect
          </h3>
          <p className="text-gray-600 mb-8">
            Whether you have a question about our services, pricing, or anything else, 
            our team is ready to answer all your questions.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="space-y-6">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <a href="mailto:info@hyperiontechhub.com" className="flex items-start space-x-4 group">
                <div className="w-12 h-12 rounded-lg bg-[#1A2BC2]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A2BC2] transition-colors">
                  <Mail className="w-6 h-6 text-[#1A2BC2] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-[#1B1C1E] mb-1">Email Us</h4>
                  <p className="text-gray-600">info@hyperiontechhub.com</p>
                </div>
              </a>
            </CardContent>
          </Card>
          
          {/* Phone & Address cards follow same pattern */}
        </div>

        {/* Why Choose Us Box */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg text-[#1B1C1E] mb-4">
            Why Choose Us?
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <div className="w-2 h-2 rounded-full bg-[#1A2BC2] mr-3"></div>
              24/7 Customer Support
            </li>
            {/* More list items... */}
          </ul>
        </div>
      </div>

      {/* RIGHT COLUMN - Contact Form */}
      <Card className="border-none shadow-xl">
        <CardContent className="p-8">
          <form className="space-y-6">
            {/* Form Field Pattern */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-[#1B1C1E]">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                className="border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
              />
            </div>

            {/* Select Dropdown */}
            <div className="space-y-2">
              <label htmlFor="service" className="text-[#1B1C1E]">
                Service Interested In
              </label>
              <select
                id="service"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1A2BC2] focus:ring-2 focus:ring-[#1A2BC2]/20"
              >
                <option value="">Select a service</option>
                <option value="ai-coding">AI & Native Coding</option>
                {/* More options... */}
              </select>
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-[#1B1C1E]">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Tell us about your project or inquiry..."
                rows={5}
                required
                className="border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2] resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              className="w-full bg-[#1A2BC2] hover:bg-[#0D0D52] text-white group"
              size="lg"
            >
              Send Message
              <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</section>
```

### About / Our Purpose Section
```jsx
<section id="about" className="py-24 bg-white">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Section Header */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
        Our Purpose
      </h2>
      <p className="text-xl text-gray-600">
        Bridging the gap between technology and the people who use it
      </p>
    </div>

    {/* Two Column Content */}
    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
      {/* Image with Order Control */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
        <img src="image-url" alt="Workspace" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1A2BC2]/30 to-transparent" />
      </div>

      {/* Text Content */}
      <div className="space-y-6 order-1 lg:order-2">
        <div className="space-y-4">
          <p className="text-lg text-gray-700 leading-relaxed">
            At Hyperion Tech Hub, our purpose is to bridge the gap...
          </p>
          {/* More paragraphs... */}
        </div>
      </div>
    </div>

    {/* Values Grid - 4 Columns */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="text-center space-y-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
        <div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center">
          <Target className="w-8 h-8 text-[#1A2BC2]" />
        </div>
        <h3 className="text-xl text-[#1B1C1E]">Our Mission</h3>
        <p className="text-gray-600">Value description...</p>
      </div>
      {/* More value cards... */}
    </div>

    {/* Bottom Statement with Gradient */}
    <div className="mt-16 text-center max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52] rounded-2xl p-12 text-white">
        <p className="text-2xl leading-relaxed">
          Hyperion Tech Hub exists to be a <span className="font-semibold">catalyst for change</span>...
        </p>
      </div>
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

## 🦶 FOOTER COMPONENT

```jsx
<footer className="bg-[#0D0D52] text-white">
  <div className="container mx-auto px-4 lg:px-8 py-16">
    
    {/* Main Footer Grid - 5 Columns */}
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
      
      {/* Brand Column - Spans 2 columns */}
      <div className="lg:col-span-2 space-y-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#1A2BC2] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="text-xl font-semibold">Hyperion Tech Hub</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-300 max-w-md leading-relaxed">
          A one-stop destination for tech solutions, education, and innovation. 
          Empowering businesses and individuals through cutting-edge technology.
        </p>
        
        {/* Contact Info */}
        <div className="space-y-3">
          <a href="mailto:info@hyperiontechhub.com" className="flex items-center text-gray-300 hover:text-[#1A2BC2] transition-colors">
            <Mail className="w-5 h-5 mr-3" />
            info@hyperiontechhub.com
          </a>
          <a href="tel:+2349064951938" className="flex items-center text-gray-300 hover:text-[#1A2BC2] transition-colors">
            <Phone className="w-5 h-5 mr-3" />
            (+234) 906 4951 938
          </a>
          <div className="flex items-start text-gray-300">
            <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
            <span>Plot 624, No. 9 Clifford Omozeghian Ave...</span>
          </div>
        </div>
      </div>

      {/* Company Links Column */}
      <div>
        <h3 className="text-lg mb-4">Company</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/about" className="text-gray-300 hover:text-[#1A2BC2] transition-colors">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/team" className="text-gray-300 hover:text-[#1A2BC2] transition-colors">
              Team
            </Link>
          </li>
          {/* More links... */}
        </ul>
      </div>

      {/* Services Links Column */}
      <div>
        <h3 className="text-lg mb-4">Services</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/training" className="text-gray-300 hover:text-[#1A2BC2] transition-colors">
              Training Programs
            </Link>
          </li>
          {/* More links... */}
        </ul>
      </div>

      {/* Support Links Column */}
      <div>
        <h3 className="text-lg mb-4">Support</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/help-center" className="text-gray-300 hover:text-[#1A2BC2] transition-colors">
              Help Center
            </Link>
          </li>
          {/* More links... */}
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="pt-8 border-t border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        
        {/* Copyright */}
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Hyperion Tech Hub. All rights reserved.
        </p>
        
        {/* Social Links */}
        <div className="flex items-center space-x-4">
          <a
            href="#"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-full bg-[#1B1C1E] hover:bg-[#1A2BC2] flex items-center justify-center transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="w-10 h-10 rounded-full bg-[#1B1C1E] hover:bg-[#1A2BC2] flex items-center justify-center transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
          {/* More social icons... */}
        </div>
      </div>
    </div>
  </div>
</footer>
```

### Footer Key Styles:
```css
/* Footer Background */
bg-[#0D0D52]           /* Midnight blue background */
text-white             /* White text */

/* Footer Links */
text-gray-300          /* Default link color */
hover:text-[#1A2BC2]   /* Hover to brand blue */
transition-colors      /* Smooth transition */

/* Social Icons */
w-10 h-10              /* 40px x 40px */
rounded-full           /* Circular */
bg-[#1B1C1E]          /* Dark background */
hover:bg-[#1A2BC2]     /* Hover to brand blue */

/* Grid Layout */
grid md:grid-cols-2 lg:grid-cols-5  /* Responsive grid */
lg:col-span-2         /* Brand column spans 2 */
```

---

## 🔝 BACK TO TOP BUTTON

```jsx
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#1A2BC2] hover:bg-[#0D0D52] text-white shadow-lg transition-all duration-300 hover:scale-110"
          size="icon"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </>
  );
}
```

### Back to Top Key Styles:
```css
/* Position & Size */
fixed bottom-8 right-8   /* Fixed 32px from bottom-right */
z-50                     /* Above other content */
w-12 h-12               /* 48px x 48px */
rounded-full            /* Circular button */

/* Colors */
bg-[#1A2BC2]           /* Brand blue background */
hover:bg-[#0D0D52]     /* Darker blue on hover */
text-white             /* White icon */

/* Effects */
shadow-lg              /* Large shadow */
transition-all duration-300  /* Smooth transitions */
hover:scale-110        /* Scale up 10% on hover */

/* Behavior */
- Shows when scrolled > 300px
- Smooth scroll to top
- Fade in/out animation
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