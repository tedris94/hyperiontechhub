# 💼 CONSULTANCY PAGE - STYLE GUIDE
**Hyperion Tech Hub | Technology Consultancy Design System**

---

## 📋 PAGE OVERVIEW

The Consultancy page showcases technology consulting services with a split-hero layout, service cards with feature lists, a 4-step process timeline, and impressive statistics. It emphasizes strategic guidance and business transformation.

---

## 🎨 PAGE STRUCTURE

```
Header (Fixed)
  ↓
Hero Section (Split: Text Left, Image Right)
  ↓
Consulting Services Grid (3 columns)
  ↓
Process Timeline (4 steps)
  ↓
Stats Section (3 columns)
  ↓
Footer
  ↓
Back to Top Button
```

---

## 🏗️ HERO SECTION (SPLIT LAYOUT)

```jsx
<section className="relative pt-32 pb-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Column - Text Content */}
      <div>
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full mb-6">
          <Briefcase className="w-4 h-4 text-[#1A2BC2]" />
          <span className="text-sm text-[#1A2BC2]">Expert Guidance</span>
        </div>
        
        {/* Heading */}
        <h1 className="text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
          Technology <span className="text-[#1A2BC2]">Consultancy</span>
        </h1>
        
        {/* Description */}
        <p className="text-xl text-gray-600 mb-8">
          Transform your business with strategic technology consulting from industry experts.
        </p>
        
        {/* CTA Button with Link */}
        <Link to="/schedule-consultation">
          <Button size="lg" className="bg-[#1A2BC2] hover:bg-[#0D0D52]">
            Schedule a Consultation
          </Button>
        </Link>
      </div>
      
      {/* Right Column - Hero Image */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
        <img 
          src="consulting-image-url" 
          alt="Business consulting"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</section>
```

### Hero Key Styles:
```css
/* Split Layout */
grid lg:grid-cols-2       /* 2 columns on desktop */
gap-12                    /* Large gap: 48px */
items-center              /* Vertically center */

/* Badge */
inline-flex               /* Inline flex */
bg-[#1A2BC2]/10          /* 10% opacity brand blue */
rounded-full              /* Fully rounded */

/* Heading Highlight */
text-[#1A2BC2]           /* Brand blue for "Consultancy" */

/* Hero Image */
h-[400px]                 /* Fixed 400px height */
rounded-2xl               /* Large rounded corners */
shadow-2xl                /* Extra large shadow */
```

---

## 🎯 CONSULTING SERVICE CARD

```jsx
<Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
  <CardHeader>
    {/* Service Title */}
    <CardTitle className="text-xl text-[#1B1C1E]">
      {service.title}
    </CardTitle>
  </CardHeader>
  
  <CardContent>
    {/* Description */}
    <p className="text-gray-600 mb-4">
      {service.description}
    </p>
    
    {/* Features List */}
    <div className="space-y-2">
      {service.features.map((feature, idx) => (
        <div key={idx} className="flex items-center text-sm text-gray-700">
          <CheckCircle className="w-4 h-4 mr-2 text-[#1A2BC2] flex-shrink-0" />
          {feature}
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

### Service Card Key Features:
```css
/* Card */
border-none               /* No border */
shadow-lg                 /* Large shadow */
hover:shadow-xl           /* Extra shadow on hover */
transition-shadow         /* Smooth shadow transition */

/* Title */
text-xl                   /* Large text: 20px */
text-[#1B1C1E]           /* Dark heading */

/* Features List */
space-y-2                 /* Vertical spacing: 8px */
flex items-center         /* Horizontal layout */
text-sm                   /* Small text: 14px */

/* CheckCircle Icon */
w-4 h-4                   /* 16px icon */
mr-2                      /* Right margin: 8px */
text-[#1A2BC2]           /* Brand blue */
flex-shrink-0             /* Prevent shrinking */
```

---

## 📊 SERVICES GRID SECTION

```jsx
<section className="py-20 bg-white">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl text-[#1B1C1E] mb-4">
        Our Consulting Services
      </h2>
      <p className="text-xl text-gray-600">
        Comprehensive technology solutions for your business
      </p>
    </div>

    {/* Services Grid - 3 Columns */}
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
Mobile (< 768px):     1 column (stacked)
Tablet (768-1023px):  2 columns
Desktop (≥ 1024px):   3 columns
```

---

## 🔄 PROCESS TIMELINE SECTION

```jsx
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl text-[#1B1C1E] mb-4">
        Our Consulting Process
      </h2>
      <p className="text-xl text-gray-600">
        A proven approach to delivering results
      </p>
    </div>

    {/* Process Steps - 4 Columns */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {process.map((item, index) => (
        <div key={index} className="text-center">
          {/* Step Number Circle */}
          <div className="w-16 h-16 bg-[#1A2BC2] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-semibold text-white">
              {item.step}
            </span>
          </div>
          
          {/* Step Title */}
          <h3 className="text-xl text-[#1B1C1E] mb-2">
            {item.title}
          </h3>
          
          {/* Step Description */}
          <p className="text-gray-600">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### Process Timeline Key Styles:
```css
/* Step Circle */
w-16 h-16                 /* 64px circle */
bg-[#1A2BC2]             /* Brand blue background */
rounded-full              /* Circular */
flex items-center justify-center  /* Center number */
mx-auto mb-4             /* Center horizontally, bottom margin */

/* Step Number */
text-2xl                  /* Large text: 24px */
font-semibold             /* Semi-bold weight */
text-white                /* White color */

/* Layout */
text-center               /* Center all text */
grid md:grid-cols-2 lg:grid-cols-4  /* Responsive grid */
gap-8                     /* Gap: 32px */
```

---

## 📈 STATS SECTION

```jsx
<section className="py-20 bg-white">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Stats Grid - 3 Columns */}
    <div className="grid md:grid-cols-3 gap-12 text-center">
      {/* Stat Item */}
      <div>
        {/* Icon */}
        <Users className="w-12 h-12 text-[#1A2BC2] mx-auto mb-4" />
        
        {/* Number */}
        <div className="text-4xl font-semibold text-[#1B1C1E] mb-2">
          200+
        </div>
        
        {/* Label */}
        <div className="text-gray-600">
          Businesses Consulted
        </div>
      </div>
      
      <div>
        <TrendingUp className="w-12 h-12 text-[#1A2BC2] mx-auto mb-4" />
        <div className="text-4xl font-semibold text-[#1B1C1E] mb-2">
          95%
        </div>
        <div className="text-gray-600">
          Client Satisfaction
        </div>
      </div>
      
      <div>
        <CheckCircle className="w-12 h-12 text-[#1A2BC2] mx-auto mb-4" />
        <div className="text-4xl font-semibold text-[#1B1C1E] mb-2">
          500+
        </div>
        <div className="text-gray-600">
          Projects Completed
        </div>
      </div>
    </div>
  </div>
</section>
```

### Stats Key Styles:
```css
/* Grid */
grid md:grid-cols-3       /* 3 columns on tablet+ */
gap-12                    /* Large gap: 48px */
text-center               /* Center all text */

/* Icon */
w-12 h-12                 /* 48px icon */
text-[#1A2BC2]           /* Brand blue */
mx-auto mb-4             /* Center horizontally, bottom margin */

/* Number */
text-4xl                  /* Extra large: 36px */
font-semibold             /* Semi-bold weight */
text-[#1B1C1E]           /* Dark color */
mb-2                      /* Bottom margin: 8px */

/* Label */
text-gray-600             /* Gray color */
```

---

## 📋 DATA STRUCTURES

```typescript
interface ConsultingService {
  title: string;
  description: string;
  features: string[];      // Array of service features
}

interface ProcessStep {
  step: string;            // e.g., "1", "2", "3", "4"
  title: string;
  description: string;
}

// Examples:
const services: ConsultingService[] = [
  {
    title: 'Technology Strategy',
    description: 'Develop comprehensive technology roadmaps aligned with your business goals.',
    features: ['Strategic Planning', 'Technology Assessment', 'Digital Transformation', 'ROI Analysis']
  },
  // More services...
];

const process: ProcessStep[] = [
  {
    step: '1',
    title: 'Discovery',
    description: 'We learn about your business challenges and objectives.'
  },
  // More steps...
];
```

---

## 🎨 COLOR USAGE

```css
/* Primary Elements */
bg-[#1A2BC2]             /* Circles, buttons, icons */
hover:bg-[#0D0D52]       /* Button hover */
text-[#1A2BC2]           /* Icons, highlighted text */

/* Backgrounds */
bg-gray-50                /* Process section */
bg-white                  /* Services & stats sections */
bg-[#1A2BC2]/10          /* Badge background */

/* Text */
text-[#1B1C1E]           /* Headings, numbers */
text-gray-600             /* Body text, descriptions */
text-gray-700             /* Feature text */
text-white                /* Circle numbers */
```

---

## 📱 RESPONSIVE PATTERNS

```css
/* Hero Layout */
grid lg:grid-cols-2       /* Split on desktop, stack on mobile */
gap-12                    /* Maintain gap */

/* Heading Size */
text-5xl lg:text-6xl      /* Scale up on desktop */

/* Services Grid */
grid md:grid-cols-2 lg:grid-cols-3  /* Responsive columns */

/* Process Grid */
grid md:grid-cols-2 lg:grid-cols-4  /* 4 columns on desktop */

/* Stats Grid */
grid md:grid-cols-3       /* 3 columns on tablet+ */

/* Image */
h-[400px]                 /* Fixed height */
```

---

## ✅ COMPONENT CHECKLIST

When building the Consultancy page:

- [ ] Split hero with text left, image right
- [ ] Include badge with Briefcase icon
- [ ] Add "Schedule a Consultation" CTA button
- [ ] Use 3-column grid for services
- [ ] Include CheckCircle icons for features
- [ ] Create 4-step process timeline
- [ ] Use numbered circles for process steps
- [ ] Add stats section with 3 metrics
- [ ] Include large icons above stats
- [ ] Use gradient background on hero
- [ ] Add shadow effects to cards
- [ ] Make fully responsive
- [ ] Link consultation button to booking page

---

## 🚀 CURSOR AI PROMPT

```
Create a Technology Consultancy page for Hyperion Tech Hub using the Consultancy Page Style Guide.

Include:
- Hero section with split layout:
  - Left: Badge with Briefcase icon, heading "Technology Consultancy", description, "Schedule a Consultation" button
  - Right: 400px height hero image
  - Gradient background from #1A2BC2/5 to #0D0D52/5
  
- Consulting Services section (3-column grid):
  - Service cards with title, description, features list with CheckCircle icons
  - Shadow effects and hover states
  
- Process section (gray-50 background, 4-column grid):
  - "Our Consulting Process" heading
  - 4 numbered steps with:
    - 64px circular badge with number (bg-[#1A2BC2], white text)
    - Step title
    - Step description
  
- Stats section (3 columns):
  - Large icons (Users, TrendingUp, CheckCircle) in #1A2BC2
  - Large numbers in text-4xl
  - Gray labels
  
Use brand colors #1A2BC2 and #0D0D52.
Make responsive with mobile stacking.

Example services:
1. Technology Strategy - Strategic Planning, Technology Assessment, Digital Transformation, ROI Analysis
2. Cloud Solutions - Cloud Migration, Architecture Design, Cost Optimization, Security Implementation
3. Cybersecurity Consulting - Security Audits, Risk Assessment, Compliance Consulting, Incident Response
4. Software Architecture - System Design, Code Review, Performance Optimization, Best Practices
5. DevOps Transformation - CI/CD Implementation, Infrastructure as Code, Automation, Monitoring Setup
6. AI & Data Strategy - AI Implementation, Data Analytics, Machine Learning, Business Intelligence

Process steps:
1. Discovery - Learn about business challenges
2. Analysis - Conduct thorough assessment
3. Strategy - Develop customized roadmap
4. Implementation - Execute with ongoing support

Stats:
- 200+ Businesses Consulted
- 95% Client Satisfaction
- 500+ Projects Completed
```

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Page Type:** Technology Consultancy
