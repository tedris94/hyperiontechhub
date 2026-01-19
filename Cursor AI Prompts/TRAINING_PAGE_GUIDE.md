# 🎓 TRAINING PAGE - STYLE GUIDE
**Hyperion Tech Hub | Corporate Training Programs Design System**

---

## 📋 PAGE OVERVIEW

The Training page showcases corporate training programs with a split-hero layout, program cards with duration/participant info, topic pills, and a benefits section. It emphasizes professional development and customized curriculum.

---

## 🎨 PAGE STRUCTURE

```
Header (Fixed)
  ↓
Hero Section (Split: Text Left, Image Right)
  ↓
Training Programs Grid (2 columns)
  ↓
Benefits Section
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
          <GraduationCap className="w-4 h-4 text-[#1A2BC2]" />
          <span className="text-sm text-[#1A2BC2]">Professional Development</span>
        </div>
        
        {/* Heading */}
        <h1 className="text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
          Corporate <span className="text-[#1A2BC2]">Training Programs</span>
        </h1>
        
        {/* Description */}
        <p className="text-xl text-gray-600 mb-8">
          Empower your team with cutting-edge technology skills through our 
          comprehensive corporate training programs.
        </p>
        
        {/* CTA Button */}
        <Button size="lg" className="bg-[#1A2BC2] hover:bg-[#0D0D52]">
          Request a Consultation
        </Button>
      </div>
      
      {/* Right Column - Hero Image */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
        <img 
          src="training-image-url" 
          alt="Corporate training"
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
gap-12                    /* Large gap between columns */
items-center              /* Vertically center content */

/* Hero Image */
h-[400px]                 /* Fixed 400px height */
rounded-2xl               /* Large rounded corners */
shadow-2xl                /* Extra large shadow */
object-cover              /* Fill without distortion */
```

---

## 📚 TRAINING PROGRAM CARD

```jsx
<Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
  <CardHeader>
    {/* Program Title */}
    <CardTitle className="text-xl text-[#1B1C1E]">
      {program.title}
    </CardTitle>
    
    {/* Meta Info - Duration & Participants */}
    <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-2 text-[#1A2BC2]" />
        {program.duration}
      </div>
      <div className="flex items-center">
        <Users className="w-4 h-4 mr-2 text-[#1A2BC2]" />
        {program.participants} people
      </div>
    </div>
  </CardHeader>
  
  <CardContent>
    {/* Description */}
    <p className="text-gray-600 mb-4">
      {program.description}
    </p>
    
    {/* Key Topics Pills */}
    <div className="space-y-2">
      <div className="text-sm text-[#1B1C1E] font-medium">Key Topics:</div>
      <div className="flex flex-wrap gap-2">
        {program.topics.map((topic, idx) => (
          <span
            key={idx}
            className="text-xs px-3 py-1 bg-[#1A2BC2]/10 text-[#1A2BC2] rounded-full"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
    
    {/* CTA Button */}
    <Button className="w-full mt-6 bg-[#1A2BC2] hover:bg-[#0D0D52]">
      Learn More
    </Button>
  </CardContent>
</Card>
```

### Program Card Key Features:
```css
/* Card */
border-none               /* No border */
shadow-lg                 /* Large shadow */
hover:shadow-xl           /* Extra shadow on hover */
transition-shadow         /* Smooth shadow transition */

/* Meta Info Icons */
w-4 h-4                   /* 16px icon size */
text-[#1A2BC2]           /* Brand blue color */
space-x-6                 /* Space between meta items */

/* Topic Pills */
text-xs                   /* Extra small text */
px-3 py-1                 /* Padding: 12px horizontal, 4px vertical */
bg-[#1A2BC2]/10          /* 10% opacity brand blue */
text-[#1A2BC2]           /* Brand blue text */
rounded-full              /* Fully rounded (pill shape) */
gap-2                     /* Gap between pills */

/* Button */
w-full                    /* Full width */
mt-6                      /* Margin top: 24px */
```

---

## 📊 PROGRAMS GRID SECTION

```jsx
<section className="py-20 bg-white">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl text-[#1B1C1E] mb-4">
        Our Training Programs
      </h2>
      <p className="text-xl text-gray-600">
        Choose from our specialized corporate training offerings
      </p>
    </div>

    {/* Programs Grid - 2 Columns */}
    <div className="grid md:grid-cols-2 gap-8">
      {programs.map((program, index) => (
        <ProgramCard key={index} program={program} />
      ))}
    </div>
  </div>
</section>
```

### Grid Responsive Behavior:
```
Mobile (< 768px):    1 column (stacked)
Tablet/Desktop (≥ 768px): 2 columns
```

---

## ✨ BENEFITS SECTION

```jsx
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="max-w-3xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <Award className="w-12 h-12 text-[#1A2BC2] mx-auto mb-4" />
        <h2 className="text-4xl text-[#1B1C1E] mb-4">
          Why Choose Our Training?
        </h2>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-[#1A2BC2] mt-1 flex-shrink-0" />
            <span className="text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

### Benefits Key Styles:
```css
/* Container */
max-w-3xl                 /* Max width: 768px */
mx-auto                   /* Center horizontally */

/* Icon */
w-12 h-12                 /* 48px icon */
text-[#1A2BC2]           /* Brand blue */
mx-auto mb-4             /* Center with bottom margin */

/* Benefit Item */
flex items-start          /* Align items to top */
space-x-3                 /* Gap: 12px */
flex-shrink-0             /* Prevent icon shrinking */
mt-1                      /* Slight top alignment */

/* Grid */
grid md:grid-cols-2       /* 2 columns on tablet+ */
gap-6                     /* Gap: 24px */
```

---

## 📋 PROGRAM DATA STRUCTURE

```typescript
interface TrainingProgram {
  title: string;
  duration: string;          // e.g., "4 weeks", "12 weeks"
  participants: string;      // e.g., "10-50", "5-20"
  description: string;
  topics: string[];          // Array of key topics
}

// Example:
const programs: TrainingProgram[] = [
  {
    title: 'Corporate IT Training',
    duration: '4 weeks',
    participants: '10-50',
    description: 'Comprehensive IT skills training tailored for corporate teams.',
    topics: ['Cloud Computing', 'Cybersecurity Fundamentals', 'DevOps Practices', 'Agile Methodologies']
  },
  // More programs...
];
```

---

## 🎨 COLOR USAGE

```css
/* Primary Elements */
bg-[#1A2BC2]             /* Buttons, active states */
hover:bg-[#0D0D52]       /* Button hover */
text-[#1A2BC2]           /* Links, badges, icons */

/* Background */
bg-gray-50                /* Benefits section */
bg-white                  /* Programs section */
bg-[#1A2BC2]/10          /* Topic pills (10% opacity) */

/* Text */
text-[#1B1C1E]           /* Headings */
text-gray-600             /* Body text, descriptions */
text-gray-700             /* Benefit text */
```

---

## 📱 RESPONSIVE PATTERNS

```css
/* Hero Layout */
grid lg:grid-cols-2       /* Stack on mobile, split on desktop */
gap-12                    /* Maintain gap */

/* Heading Size */
text-5xl lg:text-6xl      /* Scale up on desktop */

/* Programs Grid */
grid md:grid-cols-2       /* 1 column mobile, 2 on tablet+ */

/* Benefits Grid */
grid md:grid-cols-2       /* 1 column mobile, 2 on tablet+ */

/* Image Height */
h-[400px]                 /* Fixed height all screens */
```

---

## ✅ COMPONENT CHECKLIST

When building the Training page:

- [ ] Split hero with text left, image right
- [ ] Include badge with GraduationCap icon
- [ ] Add duration and participants meta info
- [ ] Create topic pills with 10% opacity background
- [ ] Use 2-column grid for programs
- [ ] Include Award icon in benefits section
- [ ] Add CheckCircle icons for benefit items
- [ ] Make all cards equal height
- [ ] Add hover effects to cards
- [ ] Include "Request a Consultation" CTA
- [ ] Use gradient background on hero
- [ ] Make fully responsive

---

## 🚀 CURSOR AI PROMPT

```
Create a Corporate Training page for Hyperion Tech Hub using the Training Page Style Guide.

Include:
- Hero section with split layout:
  - Left: Badge, heading "Corporate Training Programs", description, CTA button
  - Right: 400px height hero image with rounded corners
  - Gradient background from #1A2BC2/5 to #0D0D52/5
  
- Training Programs section (2-column grid):
  - Program cards with title, duration (Clock icon), participants (Users icon)
  - Description text
  - Topic pills (rounded-full, bg-[#1A2BC2]/10, text-[#1A2BC2])
  - "Learn More" button (full width)
  
- Benefits section (gray-50 background):
  - Award icon centered at top
  - "Why Choose Our Training?" heading
  - 2-column grid of benefits with CheckCircle icons
  
Use brand colors #1A2BC2 (Persian Blue) and #0D0D52 (Midnight Blue).
Make responsive with mobile stacking.

Example programs:
1. Corporate IT Training - 4 weeks, 10-50 people
2. Software Development Bootcamp - 12 weeks, 5-20 people
3. Cybersecurity Certification Prep - 8 weeks, 5-15 people
4. Cloud Technologies Workshop - 6 weeks, 10-30 people

Benefits: Expert instructors, Hands-on exercises, Customized curriculum, 
Flexible scheduling, Certificate of completion, Post-training support
```

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Page Type:** Corporate Training Programs
