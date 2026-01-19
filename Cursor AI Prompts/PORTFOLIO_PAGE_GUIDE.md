# 🎨 PORTFOLIO PAGE - STYLE GUIDE
**Hyperion Tech Hub | Portfolio Page Design System**

---

## 📋 PAGE OVERVIEW

The Portfolio page showcases completed projects organized by category (Web Development, Mobile Apps, Cloud Solutions, AI/ML, Design, etc.). It uses a tabbed interface for filtering and features project cards with images, client names, tech stacks, and links to detailed case studies.

---

## 🎨 PAGE STRUCTURE

```
Header (Fixed)
  ↓
Hero Section
  ↓
Filter Tabs (All, Web, Mobile, Cloud, AI/ML, Design)
  ↓
Project Cards Grid (3 columns)
  ↓
Stats Section
  ↓
CTA Section
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
        <FolderOpen className="w-4 h-4 text-[#1A2BC2]" />
        <span className="text-sm text-[#1A2BC2]">Our Work</span>
      </div>
      
      {/* Main Heading */}
      <h1 className="text-5xl md:text-6xl text-[#1B1C1E] mb-6">
        Portfolio
      </h1>
      
      {/* Description */}
      <p className="text-xl text-gray-600 leading-relaxed">
        Explore our successful projects across web development, mobile apps, 
        cloud infrastructure, and more. Each project represents our commitment 
        to excellence and innovation.
      </p>
    </div>
  </div>
</section>
```

---

## 🎯 FILTER TABS COMPONENT

```jsx
<section className="py-12 bg-white border-b border-gray-200 sticky top-20 z-40">
  <div className="container mx-auto px-4 lg:px-8">
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="inline-flex h-12 items-center justify-start w-full bg-gray-100 p-1 rounded-lg overflow-x-auto">
        <TabsTrigger 
          value="all"
          className="px-6 py-2 rounded-md data-[state=active]:bg-[#1A2BC2] data-[state=active]:text-white transition-all"
        >
          All Projects
        </TabsTrigger>
        <TabsTrigger 
          value="web"
          className="px-6 py-2 rounded-md data-[state=active]:bg-[#1A2BC2] data-[state=active]:text-white transition-all"
        >
          Web Development
        </TabsTrigger>
        <TabsTrigger 
          value="mobile"
          className="px-6 py-2 rounded-md data-[state=active]:bg-[#1A2BC2] data-[state=active]:text-white transition-all"
        >
          Mobile Apps
        </TabsTrigger>
        <TabsTrigger 
          value="cloud"
          className="px-6 py-2 rounded-md data-[state=active]:bg-[#1A2BC2] data-[state=active]:text-white transition-all"
        >
          Cloud Services
        </TabsTrigger>
        <TabsTrigger 
          value="ai"
          className="px-6 py-2 rounded-md data-[state=active]:bg-[#1A2BC2] data-[state=active]:text-white transition-all"
        >
          AI/ML
        </TabsTrigger>
        <TabsTrigger 
          value="design"
          className="px-6 py-2 rounded-md data-[state=active]:bg-[#1A2BC2] data-[state=active]:text-white transition-all"
        >
          Design
        </TabsTrigger>
      </TabsList>
      
      {/* Tab Content */}
      <TabsContent value="all" className="mt-12">
        {/* Project Grid */}
      </TabsContent>
    </Tabs>
  </div>
</section>
```

### Filter Tabs Key Features:
```css
/* Sticky Header */
sticky top-20             /* Stick below main header */
z-40                      /* Above content, below header */
border-b                  /* Bottom border separator */

/* Tab Styling */
bg-gray-100              /* Light gray background */
rounded-lg               /* Rounded container */
h-12                     /* 48px height */

/* Active Tab */
data-[state=active]:bg-[#1A2BC2]      /* Blue background */
data-[state=active]:text-white         /* White text */

/* Scrollable on Mobile */
overflow-x-auto          /* Horizontal scroll if needed */
```

---

## 🎨 PROJECT CARD COMPONENT

```jsx
<Card 
  className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
  onClick={() => navigate(`/portfolio/${project.id}`)}
>
  {/* Project Image */}
  <div className="relative h-64 overflow-hidden bg-gray-100">
    <img 
      src={project.image} 
      alt={project.title}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    
    {/* Overlay on Hover */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D52]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
      <Button 
        size="sm" 
        className="bg-white text-[#1A2BC2] hover:bg-gray-100"
      >
        View Project
        <ExternalLink className="ml-2 w-4 h-4" />
      </Button>
    </div>
  </div>
  
  <CardContent className="p-6">
    {/* Project Title */}
    <h3 className="text-xl text-[#1B1C1E] mb-2 group-hover:text-[#1A2BC2] transition-colors">
      {project.title}
    </h3>
    
    {/* Client Name */}
    <p className="text-sm text-gray-500 mb-3">
      Client: {project.client}
    </p>
    
    {/* Description */}
    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
      {project.description}
    </p>
    
    {/* Tech Stack Pills */}
    <div className="flex flex-wrap gap-2">
      {project.tech.map((tech, idx) => (
        <Badge 
          key={idx}
          variant="secondary"
          className="bg-[#1A2BC2]/10 text-[#1A2BC2] hover:bg-[#1A2BC2] hover:text-white transition-colors"
        >
          {tech}
        </Badge>
      ))}
    </div>
  </CardContent>
</Card>
```

### Project Card Key Features:
```css
/* Card Container */
group                     /* Enable group-hover variants */
cursor-pointer            /* Show it's clickable */
hover:-translate-y-1      /* Lift on hover */
overflow-hidden           /* Clip image zoom */

/* Image */
h-64                      /* 256px fixed height */
object-cover              /* Fill without distortion */
group-hover:scale-110     /* Zoom on card hover */
transition-transform duration-500  /* Smooth zoom */

/* Hover Overlay */
opacity-0                 /* Hidden by default */
group-hover:opacity-100   /* Show on card hover */
bg-gradient-to-t          /* Bottom-to-top gradient */
from-[#0D0D52]/80        /* Dark bottom */

/* Title Hover */
group-hover:text-[#1A2BC2]  /* Change color on hover */

/* Tech Stack Badges */
bg-[#1A2BC2]/10          /* Light blue background */
text-[#1A2BC2]           /* Blue text */
hover:bg-[#1A2BC2]       /* Solid blue on hover */
hover:text-white          /* White text on hover */

/* Text Clamp */
line-clamp-2              /* Limit to 2 lines */
```

---

## 📊 PROJECT GRID LAYOUT

```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {projects.map((project, index) => (
    <ProjectCard key={index} project={project} />
  ))}
</div>
```

### Grid Responsive Behavior:
```
Mobile (< 768px):    1 column (stacked)
Tablet (768-1023px): 2 columns
Desktop (≥ 1024px):  3 columns
```

---

## 📈 STATS SECTION

```jsx
<section className="py-24 bg-gray-50">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {/* Stat Item */}
      <div className="text-center">
        <div className="text-5xl text-[#1A2BC2] mb-2">
          150+
        </div>
        <div className="text-gray-600">
          Projects Completed
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-5xl text-[#1A2BC2] mb-2">
          100+
        </div>
        <div className="text-gray-600">
          Happy Clients
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-5xl text-[#1A2BC2] mb-2">
          98%
        </div>
        <div className="text-gray-600">
          Success Rate
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-5xl text-[#1A2BC2] mb-2">
          24/7
        </div>
        <div className="text-gray-600">
          Support Available
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 💼 PROJECT DETAIL VIEW (Separate Page)

```jsx
<section className="py-24 bg-white">
  <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
    {/* Back Button */}
    <Button 
      variant="ghost" 
      className="mb-8 hover:text-[#1A2BC2]"
      onClick={() => navigate('/portfolio')}
    >
      <ArrowLeft className="mr-2 w-4 h-4" />
      Back to Portfolio
    </Button>
    
    {/* Project Hero Image */}
    <div className="relative h-[500px] rounded-2xl overflow-hidden mb-12">
      <img 
        src={project.image} 
        alt={project.title}
        className="w-full h-full object-cover"
      />
    </div>
    
    {/* Project Info Grid */}
    <div className="grid lg:grid-cols-3 gap-12">
      {/* Main Content (2 columns) */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-4xl text-[#1B1C1E] mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-gray-600">
            {project.fullDescription}
          </p>
        </div>
        
        {/* Challenge Section */}
        <div>
          <h2 className="text-2xl text-[#1B1C1E] mb-4">
            The Challenge
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {project.challenge}
          </p>
        </div>
        
        {/* Solution Section */}
        <div>
          <h2 className="text-2xl text-[#1B1C1E] mb-4">
            Our Solution
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {project.solution}
          </p>
        </div>
        
        {/* Results Section */}
        <div>
          <h2 className="text-2xl text-[#1B1C1E] mb-4">
            Results
          </h2>
          <ul className="space-y-3">
            {project.results.map((result, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#1A2BC2] mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{result}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Sidebar (1 column) */}
      <div className="space-y-6">
        {/* Project Info Card */}
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg text-[#1B1C1E] mb-4">
              Project Info
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Client</div>
                <div className="text-[#1B1C1E]">{project.client}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Industry</div>
                <div className="text-[#1B1C1E]">{project.industry}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Duration</div>
                <div className="text-[#1B1C1E]">{project.duration}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Technologies</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tech.map((tech, idx) => (
                    <Badge 
                      key={idx}
                      className="bg-[#1A2BC2]/10 text-[#1A2BC2]"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* CTA Card */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-[#1A2BC2] to-[#0D0D52] text-white">
          <CardContent className="p-6">
            <h3 className="text-lg mb-3">
              Like this project?
            </h3>
            <p className="mb-4 text-white/90 text-sm">
              Let's discuss how we can help your business succeed.
            </p>
            <Button 
              className="w-full bg-white text-[#1A2BC2] hover:bg-gray-100"
            >
              Get in Touch
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</section>
```

---

## 🎨 PROJECT DATA STRUCTURE

```typescript
interface Project {
  id: string;
  title: string;
  client: string;
  description: string;        // Short (100 chars)
  fullDescription?: string;   // Long (for detail page)
  tech: string[];             // Tech stack array
  image: string;              // Main image URL
  category: 'web' | 'mobile' | 'cloud' | 'ai' | 'design';
  
  // Detail Page Only
  challenge?: string;
  solution?: string;
  results?: string[];
  industry?: string;
  duration?: string;
  link?: string;              // External link
}
```

---

## 📱 RESPONSIVE CONSIDERATIONS

```css
/* Grid Columns */
grid md:grid-cols-2 lg:grid-cols-3  /* Responsive project grid */
grid-cols-2 md:grid-cols-4          /* Stats grid */

/* Hero Image */
h-[500px]                /* Fixed height for detail page */
h-64                     /* Card image height */

/* Detail Page Layout */
lg:grid-cols-3           /* Sidebar layout */
lg:col-span-2           /* Main content spans 2 */

/* Tabs Scroll */
overflow-x-auto          /* Horizontal scroll on mobile */
```

---

## ✅ COMPONENT CHECKLIST

When building the Portfolio page:

- [ ] Implement tabbed filtering system
- [ ] Add sticky filter tabs below header
- [ ] Include project images with zoom on hover
- [ ] Show overlay with "View Project" button
- [ ] Display tech stack as colored badges
- [ ] Make entire card clickable
- [ ] Create separate detail page for each project
- [ ] Include stats section with metrics
- [ ] Add "Back to Portfolio" button on detail pages
- [ ] Show client name and project info
- [ ] Include Challenge/Solution/Results sections
- [ ] Add sidebar with project metadata
- [ ] Use line-clamp for descriptions
- [ ] Implement responsive grid layouts

---

## 🚀 CURSOR AI PROMPT

```
Create a Portfolio page for Hyperion Tech Hub using the Portfolio Page Style Guide.
Include:
- Hero section with gradient background
- Sticky tabbed filter (All, Web, Mobile, Cloud, AI/ML, Design)
- Project cards in 3-column grid with:
  - 256px height images with zoom on hover
  - Gradient overlay with "View Project" button on hover
  - Client name and description
  - Tech stack badges
  - Clickable cards
- Stats section with 4 metrics (2x4 grid)
- Separate project detail page with:
  - Large hero image
  - Challenge/Solution/Results sections
  - Sidebar with project info
  - "Back to Portfolio" button
- Responsive mobile layout

Use brand colors #1A2BC2 (Persian Blue) and #0D0D52 (Midnight Blue).
Make cards lift and zoom images on hover.
```

---

**Last Updated:** January 2026
**Version:** 1.0
**Page Type:** Portfolio Showcase
