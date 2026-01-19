# 👥 TEAM PAGE - STYLE GUIDE
**Hyperion Tech Hub | Team Page Design System**

---

## 📋 PAGE OVERVIEW

The Team page showcases leadership and team members with professional photos, bios, roles, and social links. It features a two-tier layout: Leadership section with larger cards and detailed bios, followed by team members in a grid layout.

---

## 🎨 PAGE STRUCTURE

```
Header (Fixed)
  ↓
Hero Section
  ↓
Leadership Section (3 large cards)
  ↓
Team Members Grid (3 columns)
  ↓
Join Our Team CTA
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
        <Users className="w-4 h-4 text-[#1A2BC2]" />
        <span className="text-sm text-[#1A2BC2]">Meet Our Team</span>
      </div>
      
      {/* Main Heading */}
      <h1 className="text-5xl md:text-6xl text-[#1B1C1E] mb-6">
        The People Behind Innovation
      </h1>
      
      {/* Description */}
      <p className="text-xl text-gray-600 leading-relaxed">
        A diverse team of experts passionate about delivering 
        exceptional technology solutions and driving digital transformation.
      </p>
    </div>
  </div>
</section>
```

---

## 👔 LEADERSHIP CARD (Large Format)

```jsx
<section className="py-24 bg-white">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Section Title */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
        Our Leadership
      </h2>
      <p className="text-xl text-gray-600">
        Experienced leaders guiding our vision
      </p>
    </div>
    
    {/* Leadership Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
      {leadership.map((leader, index) => (
        <Card key={index} className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
          {/* Profile Image */}
          <div className="relative h-80 overflow-hidden">
            <img 
              src={leader.image} 
              alt={leader.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D52]/60 to-transparent" />
          </div>
          
          <CardContent className="p-8">
            {/* Name & Role */}
            <h3 className="text-2xl text-[#1B1C1E] mb-1">
              {leader.name}
            </h3>
            <p className="text-[#1A2BC2] mb-4">
              {leader.role}
            </p>
            
            {/* Bio */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {leader.bio}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <a 
                href={leader.linkedin}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={leader.twitter}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href={`mailto:${leader.email}`}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
```

### Leadership Card Key Features:
```css
/* Image Container */
h-80                      /* 320px fixed height */
overflow-hidden           /* Clip scaled image */
hover:scale-105           /* Zoom on hover */

/* Gradient Overlay */
absolute inset-0          /* Cover entire image */
bg-gradient-to-t          /* Top gradient */
from-[#0D0D52]/60        /* Dark bottom */
to-transparent            /* Fade to clear */

/* Social Icons */
w-10 h-10                 /* 40px circles */
rounded-full              /* Circular shape */
bg-gray-100              /* Light gray default */
hover:bg-[#1A2BC2]       /* Blue on hover */
transition-colors         /* Smooth color change */
```

---

## 🧑‍💼 TEAM MEMBER CARD (Compact Format)

```jsx
<section className="py-24 bg-gray-50">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Section Title */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
        Our Team
      </h2>
      <p className="text-xl text-gray-600">
        Talented professionals delivering excellence
      </p>
    </div>
    
    {/* Team Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member, index) => (
        <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
          {/* Profile Image */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src={member.image} 
              alt={member.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D52]/40 to-transparent" />
          </div>
          
          <CardContent className="p-6">
            {/* Name & Role */}
            <h3 className="text-xl text-[#1B1C1E] mb-1">
              {member.name}
            </h3>
            <p className="text-[#1A2BC2] text-sm mb-3">
              {member.role}
            </p>
            
            {/* Short Bio */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {member.bio}
            </p>
            
            {/* Social Links (Smaller) */}
            <div className="flex items-center space-x-2">
              <a 
                href={member.linkedin}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={member.twitter}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={`mailto:${member.email}`}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#1A2BC2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
```

### Team Member Card Differences:
```css
/* Smaller Image */
h-64                      /* 256px height (vs 320px leadership) */

/* Smaller Text */
text-xl                   /* Heading (vs text-2xl) */
text-sm                   /* Role & bio (vs regular) */

/* Smaller Social Icons */
w-8 h-8                   /* 32px circles (vs 40px) */
w-4 h-4                   /* Icon size (vs 20px) */

/* Hover Effect */
hover:-translate-y-1      /* Lift card on hover */
```

---

## 💼 JOIN OUR TEAM CTA SECTION

```jsx
<section className="py-24 bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52]">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="text-center text-white max-w-4xl mx-auto">
      {/* Icon */}
      <div className="inline-flex w-20 h-20 rounded-full bg-white/10 items-center justify-center mb-6">
        <Briefcase className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-4xl md:text-5xl mb-6">
        Join Our Growing Team
      </h2>
      <p className="text-xl mb-8 text-white/90">
        We're always looking for talented individuals who share our passion 
        for innovation and excellence. Explore career opportunities at Hyperion Tech Hub.
      </p>
      
      <Link to="/careers">
        <Button size="lg" className="bg-white text-[#1A2BC2] hover:bg-gray-100">
          View Open Positions
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </div>
  </div>
</section>
```

---

## 📊 TEAM DATA STRUCTURE

```typescript
// Leadership Member Interface
interface LeadershipMember {
  name: string;
  role: string;
  image: string;
  bio: string;              // Longer bio (200-300 chars)
  linkedin: string;
  twitter: string;
  email: string;
}

// Team Member Interface
interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;              // Shorter bio (100-150 chars)
  linkedin: string;
  twitter: string;
  email: string;
}
```

---

## 📷 IMAGE GUIDELINES

```css
/* Image Dimensions */
Leadership Images:  800x1000px (4:5 ratio)
Team Images:       600x800px (3:4 ratio)

/* Image Requirements */
- Professional headshots or portraits
- Good lighting and clear backgrounds
- High resolution (minimum 600px width)
- Consistent style across all photos
- Use ImageWithFallback component

/* Image Optimization */
object-cover              /* Fill container without distortion */
transition-transform      /* Smooth zoom effect */
hover:scale-105          /* 5% zoom on hover */
```

---

## 🎨 LAYOUT PATTERNS

### Leadership Layout:
```
Desktop (lg):   3 columns
Tablet (md):    2 columns
Mobile:         1 column (stacked)
```

### Team Members Layout:
```
Desktop (lg):   3 columns
Tablet (md):    2 columns
Mobile:         1 column (stacked)
```

### Spacing:
```css
/* Section Spacing */
py-24                     /* Top and bottom padding */
mb-24                     /* Large margin between sections */
mb-16                     /* Margin below headings */

/* Grid Gaps */
gap-12                    /* Leadership grid gap */
gap-8                     /* Team members grid gap */
```

---

## 🎭 HOVER EFFECTS

```css
/* Card Hover */
hover:shadow-xl           /* Increase shadow */
hover:shadow-2xl          /* Extra shadow for leadership */
hover:-translate-y-1      /* Lift card up */
transition-all duration-300  /* Smooth animation */

/* Image Hover */
hover:scale-105           /* Zoom image */
transition-transform duration-500  /* Slow zoom */

/* Social Icon Hover */
hover:bg-[#1A2BC2]       /* Background to brand blue */
hover:text-white          /* Icon to white */
transition-colors         /* Smooth color change */
```

---

## 📱 RESPONSIVE CONSIDERATIONS

```css
/* Hero Text */
text-5xl md:text-6xl      /* Scale heading */

/* Card Grid */
grid md:grid-cols-2 lg:grid-cols-3  /* Responsive columns */

/* Image Heights */
h-80                      /* Leadership: 320px */
h-64                      /* Team: 256px */

/* Padding */
p-8                       /* Leadership card padding */
p-6                       /* Team card padding */
```

---

## ✅ COMPONENT CHECKLIST

When building the Team page:

- [ ] Use high-quality professional photos
- [ ] Implement image zoom on hover
- [ ] Add gradient overlays to all photos
- [ ] Include social media links (LinkedIn, Twitter, Email)
- [ ] Use larger cards for leadership team
- [ ] Separate leadership from team members
- [ ] Add "Join Our Team" CTA at bottom
- [ ] Ensure equal card heights in grid
- [ ] Make all email links functional
- [ ] Add hover effects to cards and icons
- [ ] Use ImageWithFallback for all photos
- [ ] Implement responsive grid layouts

---

## 🚀 CURSOR AI PROMPT

```
Create a Team page for Hyperion Tech Hub using the Team Page Style Guide.
Include:
- Hero section with gradient background
- Leadership section with 3 large cards (320px height images)
- Team members grid with compact cards (256px height images)
- Profile photos with gradient overlays
- Social media links (LinkedIn, Twitter, Email) for each person
- "Join Our Team" CTA section with gradient background
- Hover effects: card lift, shadow increase, image zoom
- Responsive 3-column grid that stacks on mobile

Use brand colors #1A2BC2 (Persian Blue) and #0D0D52 (Midnight Blue).
```

---

**Last Updated:** January 2026
**Version:** 1.0
**Page Type:** Team Showcase
