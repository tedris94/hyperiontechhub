# 🛠️ SERVICES PAGE - STYLE GUIDE
**Hyperion Tech Hub | Services Page Design System**

---

## 📋 PAGE OVERVIEW

The Services page showcases all technology solutions offered by Hyperion Tech Hub with detailed feature lists, pricing information, and clear call-to-action buttons. It uses a full-width card grid layout with colored accents for each service category.

---

## 🎨 PAGE STRUCTURE

```
Header (Fixed)
  ↓
Hero Section
  ↓
Services Grid (3 columns)
  ↓
Why Choose Us Section
  ↓
Call-to-Action Section
  ↓
Footer
  ↓
Back to Top Button
```

---

## 🏗️ HERO SECTION

```jsx
<section className="pt-32 pb-16 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="text-center max-w-4xl mx-auto">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full mb-6">
        <Briefcase className="w-4 h-4 text-[#1A2BC2]" />
        <span className="text-sm text-[#1A2BC2]">Comprehensive Solutions</span>
      </div>
      
      {/* Main Heading */}
      <h1 className="text-5xl md:text-6xl text-[#1B1C1E] mb-6">
        Our Services
      </h1>
      
      {/* Description */}
      <p className="text-xl text-gray-600 leading-relaxed">
        From software development to cloud services and training, we provide 
        end-to-end technology solutions tailored to your needs.
      </p>
    </div>
  </div>
</section>
```

### Hero Key Styles:
```css
pt-32                    /* Extra padding top for fixed header */
pb-16                    /* Padding bottom */
bg-gradient-to-br        /* Diagonal gradient background */
from-[#1A2BC2]/5         /* Light blue start */
via-white                /* White middle */
to-[#0D0D52]/5          /* Light midnight blue end */
```

---

## 🎯 SERVICE CARD COMPONENT

```jsx
<Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
  <CardHeader className="pb-4">
    {/* Icon with Colored Background */}
    <div className="inline-flex mb-4">
      <div className={`w-14 h-14 rounded-xl ${service.color} text-white flex items-center justify-center`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
    
    {/* Service Title */}
    <CardTitle className="text-2xl text-[#1B1C1E] mb-2">
      {service.title}
    </CardTitle>
    
    {/* Subtitle Badge */}
    <Badge variant="secondary" className="w-fit">
      {service.subtitle}
    </Badge>
  </CardHeader>
  
  <CardContent className="flex-1 flex flex-col">
    {/* Description */}
    <p className="text-gray-600 mb-6 leading-relaxed">
      {service.description}
    </p>
    
    {/* Features List */}
    <div className="space-y-3 mb-6 flex-1">
      {service.features.map((feature, idx) => (
        <div key={idx} className="flex items-start">
          <CheckCircle className="w-5 h-5 text-[#1A2BC2] mr-3 flex-shrink-0 mt-0.5" />
          <span className="text-gray-700">{feature}</span>
        </div>
      ))}
    </div>
    
    {/* CTA Button */}
    <Link to={service.link}>
      <Button className="w-full bg-[#1A2BC2] hover:bg-[#0D0D52] text-white group">
        Learn More
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Link>
  </CardContent>
</Card>
```

### Service Card Key Features:
```css
/* Card Layout */
h-full                    /* Full height for equal cards */
flex flex-col             /* Vertical flex layout */
flex-1                    /* Flexible grow for content */

/* Icon Background Colors (rotate through) */
bg-blue-500              /* Software Development */
bg-purple-500            /* Web Development */
bg-cyan-500              /* Cloud Services */
bg-green-500             /* Android Development */
bg-orange-500            /* Corporate Training */
bg-pink-500              /* Online Courses */
bg-red-500               /* Computer Repairs */
bg-indigo-500            /* Graphic Design */
bg-teal-500              /* Cybersecurity */

/* Feature List Item */
flex items-start         /* Align icon to top */
flex-shrink-0            /* Prevent icon shrinking */
mt-0.5                   /* Slight top margin alignment */
```

---

## 📊 SERVICES GRID LAYOUT

```jsx
<section className="py-24 bg-white">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Grid - 3 columns on large screens */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <ServiceCard key={index} service={service} />
      ))}
    </div>
  </div>
</section>
```

### Grid Responsive Behavior:
```
Mobile (< 768px):    1 column (stacked)
Tablet (768-1023px): 2 columns
Desktop (≥ 1024px):  3 columns
```

---

## 🌟 WHY CHOOSE US SECTION

```jsx
<section className="py-24 bg-gray-50">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
        Why Choose Hyperion Tech Hub?
      </h2>
      <p className="text-xl text-gray-600">
        We deliver excellence through expertise, innovation, and commitment
      </p>
    </div>
    
    {/* Benefits Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Benefit Card */}
      <div className="text-center p-6">
        <div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center mb-4">
          <Award className="w-8 h-8 text-[#1A2BC2]" />
        </div>
        <h3 className="text-xl text-[#1B1C1E] mb-2">Expert Team</h3>
        <p className="text-gray-600">
          Industry-certified professionals with 10+ years experience
        </p>
      </div>
      
      {/* More benefit cards... */}
    </div>
  </div>
</section>
```

---

## 📞 CALL-TO-ACTION SECTION

```jsx
<section className="py-24 bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52]">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="text-center text-white max-w-4xl mx-auto">
      <h2 className="text-4xl md:text-5xl mb-6">
        Ready to Transform Your Business?
      </h2>
      <p className="text-xl mb-8 text-white/90">
        Let's discuss how our services can help you achieve your goals
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/consultancy">
          <Button size="lg" className="bg-white text-[#1A2BC2] hover:bg-gray-100">
            Schedule Consultation
          </Button>
        </Link>
        <Link to="/contact">
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  </div>
</section>
```

---

## 🎨 COLOR PALETTE FOR SERVICE CATEGORIES

```jsx
const serviceColors = {
  softwareDev: 'bg-blue-500',        // #3B82F6
  webDev: 'bg-purple-500',           // #A855F7
  cloud: 'bg-cyan-500',              // #06B6D4
  android: 'bg-green-500',           // #22C55E
  training: 'bg-orange-500',         // #F97316
  courses: 'bg-pink-500',            // #EC4899
  repairs: 'bg-red-500',             // #EF4444
  design: 'bg-indigo-500',           // #6366F1
  cybersecurity: 'bg-teal-500'       // #14B8A6
};
```

---

## 📱 RESPONSIVE CONSIDERATIONS

```css
/* Card Stack on Mobile */
md:grid-cols-2           /* 2 columns on tablet */
lg:grid-cols-3           /* 3 columns on desktop */

/* Hero Text Sizing */
text-5xl md:text-6xl     /* Scale up heading on larger screens */

/* Button Layout */
flex-col sm:flex-row     /* Stack vertically on mobile */
```

---

## ✅ COMPONENT CHECKLIST

When building the Services page:

- [ ] Include colored icon backgrounds for each service
- [ ] Use CheckCircle icons for feature lists
- [ ] Make all cards equal height with `h-full`
- [ ] Add hover effects to cards (shadow-xl on hover)
- [ ] Link each service to appropriate detail page
- [ ] Include Badge components for subtitles
- [ ] Use gradient CTA section at bottom
- [ ] Ensure responsive grid behavior
- [ ] Add loading states for dynamic content
- [ ] Include "Why Choose Us" section

---

## 🚀 CURSOR AI PROMPT

```
Create a Services page for Hyperion Tech Hub using the Services Page Style Guide.
Include:
- Hero section with gradient background
- Service cards in 3-column grid with colored icons
- Feature lists with checkmarks
- "Why Choose Us" section with 4 benefits
- Gradient CTA section at bottom
- Responsive mobile layout

Use brand colors #1A2BC2 (Persian Blue) and #0D0D52 (Midnight Blue).
Make cards equal height and add hover effects.
```

---

**Last Updated:** January 2026
**Version:** 1.0
**Page Type:** Services Overview
