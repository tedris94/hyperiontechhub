# 📖 COURSES PAGE - STYLE GUIDE
**Hyperion Tech Hub | Online Courses Design System**

---

## 📋 PAGE OVERVIEW

The Courses page displays self-paced online courses with featured images, instructor names, ratings, pricing, and enrollment buttons. It uses a 3-column grid layout with course cards that include level badges and detailed meta information.

---

## 🎨 PAGE STRUCTURE

```
Header (Fixed)
  ↓
Hero Section (Centered)
  ↓
Courses Grid (3 columns)
  ↓
Features Section
  ↓
Footer
  ↓
Back to Top Button
```

---

## 🏗️ HERO SECTION (CENTERED)

```jsx
<section className="relative pt-32 pb-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="text-center max-w-3xl mx-auto">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 bg-[#1A2BC2]/10 px-4 py-2 rounded-full mb-6">
        <BookOpen className="w-4 h-4 text-[#1A2BC2]" />
        <span className="text-sm text-[#1A2BC2]">Learn at Your Own Pace</span>
      </div>
      
      {/* Heading */}
      <h1 className="text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
        Online <span className="text-[#1A2BC2]">Courses</span>
      </h1>
      
      {/* Description */}
      <p className="text-xl text-gray-600 mb-8">
        Master new skills with our comprehensive online courses. 
        Learn from industry experts and advance your career.
      </p>
    </div>
  </div>
</section>
```

### Hero Key Styles:
```css
/* Centered Layout */
text-center               /* Center all text */
max-w-3xl                 /* Max width: 768px */
mx-auto                   /* Center horizontally */

/* Badge */
inline-flex               /* Inline flex for badge */
bg-[#1A2BC2]/10          /* 10% opacity brand blue */
rounded-full              /* Fully rounded */

/* Heading */
text-5xl lg:text-6xl      /* Responsive sizing */
text-[#1B1C1E]           /* Dark heading */
text-[#1A2BC2]           /* Highlighted word */
```

---

## 📚 COURSE CARD COMPONENT

```jsx
<Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
  {/* Course Image with Level Badge */}
  <div className="relative h-48 overflow-hidden">
    <img 
      src={course.image} 
      alt={course.title}
      className="w-full h-full object-cover"
    />
    {/* Level Badge - Top Right */}
    <div className="absolute top-4 right-4">
      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
        {course.level}
      </span>
    </div>
  </div>
  
  <CardHeader>
    {/* Course Title */}
    <CardTitle className="text-lg text-[#1B1C1E]">
      {course.title}
    </CardTitle>
    
    {/* Instructor */}
    <div className="text-sm text-gray-600">
      by {course.instructor}
    </div>
  </CardHeader>
  
  <CardContent className="flex-1 flex flex-col">
    {/* Description */}
    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
      {course.description}
    </p>
    
    {/* Meta Information */}
    <div className="space-y-2 mb-4">
      {/* Duration */}
      <div className="flex items-center text-sm text-gray-600">
        <Clock className="w-4 h-4 mr-2 text-[#1A2BC2]" />
        {course.duration}
      </div>
      
      {/* Students Enrolled */}
      <div className="flex items-center text-sm text-gray-600">
        <Users className="w-4 h-4 mr-2 text-[#1A2BC2]" />
        {course.students.toLocaleString()} students
      </div>
      
      {/* Rating */}
      <div className="flex items-center text-sm text-gray-600">
        <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
        {course.rating} rating
      </div>
    </div>

    {/* Price & Enroll Section */}
    <div className="mt-auto pt-4 border-t border-gray-200">
      {/* Price */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-semibold text-[#1A2BC2]">
          {course.price}
        </span>
      </div>
      
      {/* Enroll Button */}
      <Button className="w-full bg-[#1A2BC2] hover:bg-[#0D0D52] text-white">
        <Play className="w-4 h-4 mr-2" />
        Enroll Now
      </Button>
    </div>
  </CardContent>
</Card>
```

### Course Card Key Features:
```css
/* Card Container */
flex flex-col             /* Vertical flex layout */
border-none               /* No border */
shadow-lg                 /* Large shadow */
hover:shadow-xl           /* Extra shadow on hover */
transition-all duration-300  /* Smooth transitions */

/* Course Image */
h-48                      /* 192px fixed height */
overflow-hidden           /* Clip overflow */
object-cover              /* Fill without distortion */

/* Level Badge */
absolute top-4 right-4    /* Position top-right */
bg-white/90              /* 90% white with transparency */
backdrop-blur-sm         /* Blur background */
rounded-full              /* Fully rounded */
text-xs                   /* Extra small text */

/* Meta Icons */
w-4 h-4                   /* 16px icons */
text-[#1A2BC2]           /* Brand blue for Clock/Users */
text-yellow-500          /* Yellow for Star */
fill-yellow-500          /* Filled star */

/* Price */
text-2xl                  /* Large price */
font-semibold             /* Bold weight */
text-[#1A2BC2]           /* Brand blue */

/* Content Layout */
flex-1                    /* Flex grow */
mt-auto                   /* Push to bottom */
pt-4 border-t            /* Top border separator */

/* Description */
line-clamp-2              /* Limit to 2 lines */
```

---

## 📊 COURSES GRID SECTION

```jsx
<section className="py-20 bg-white">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Courses Grid - 3 Columns */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course, index) => (
        <CourseCard key={index} course={course} />
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

## ✨ FEATURES SECTION

```jsx
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      {/* Section Title */}
      <h2 className="text-4xl text-[#1B1C1E] mb-12">
        What You Get
      </h2>
      
      {/* Features Grid - 3 Columns */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Icon Circle */}
            <div className="w-12 h-12 bg-[#1A2BC2] rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            
            {/* Feature Text */}
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

### Features Key Styles:
```css
/* Container */
max-w-4xl                 /* Max width: 896px */
mx-auto                   /* Center horizontally */
text-center               /* Center text */

/* Icon Circle */
w-12 h-12                 /* 48px circle */
bg-[#1A2BC2]             /* Brand blue background */
rounded-full              /* Circular */
flex items-center justify-center  /* Center icon */

/* Icon */
w-6 h-6                   /* 24px icon */
text-white                /* White color */

/* Grid */
grid md:grid-cols-3       /* 3 columns on tablet+ */
gap-8                     /* Gap: 32px */
```

---

## 📋 COURSE DATA STRUCTURE

```typescript
interface Course {
  title: string;
  instructor: string;
  duration: string;          // e.g., "8 weeks"
  students: number;          // Total enrolled
  rating: number;            // 0-5 rating
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  price: string;             // e.g., "$199"
  image: string;             // Course thumbnail
  modules?: string[];        // Optional: Course modules
}

// Example:
const courses: Course[] = [
  {
    title: 'Web Development Fundamentals',
    instructor: 'John Smith',
    duration: '8 weeks',
    students: 1245,
    rating: 4.8,
    level: 'Beginner',
    description: 'Learn HTML, CSS, and JavaScript from scratch to build modern websites.',
    price: '$199',
    image: 'course-image-url.jpg'
  },
  // More courses...
];
```

---

## 🎨 LEVEL BADGE COLORS

```css
/* You can customize badge colors by level */
Beginner:     bg-green-50 text-green-700
Intermediate: bg-blue-50 text-blue-700
Advanced:     bg-purple-50 text-purple-700

/* Current Implementation (All White) */
bg-white/90              /* 90% white transparency */
backdrop-blur-sm         /* Subtle blur effect */
```

---

## ⭐ RATING DISPLAY

```css
/* Star Icon */
text-yellow-500          /* Yellow color */
fill-yellow-500          /* Filled star */
w-4 h-4                  /* 16px size */

/* Rating Number */
text-sm                  /* Small text */
text-gray-600            /* Gray color */
```

---

## 💰 PRICING DISPLAY

```css
/* Price Text */
text-2xl                 /* Large size (24px) */
font-semibold            /* Semi-bold weight */
text-[#1A2BC2]          /* Brand blue color */

/* Alignment */
flex items-center justify-between  /* Space between price and other elements */
```

---

## 📱 RESPONSIVE PATTERNS

```css
/* Hero */
text-center max-w-3xl mx-auto  /* Center content, max width */
text-5xl lg:text-6xl           /* Scale heading */

/* Grid */
grid md:grid-cols-2 lg:grid-cols-3  /* Responsive columns */

/* Course Card */
h-48                     /* Fixed image height */
flex flex-col            /* Vertical layout */

/* Features Grid */
grid md:grid-cols-3      /* 3 columns on tablet+ */
```

---

## ✅ COMPONENT CHECKLIST

When building the Courses page:

- [ ] Centered hero with BookOpen icon badge
- [ ] 3-column responsive grid for courses
- [ ] Course images with 192px fixed height
- [ ] Level badge overlay (top-right)
- [ ] Star rating with yellow filled icon
- [ ] Student count with Users icon
- [ ] Duration with Clock icon
- [ ] Large price display in brand blue
- [ ] "Enroll Now" button with Play icon
- [ ] Line-clamp description to 2 lines
- [ ] Features section with icon circles
- [ ] Equal height cards with flex layout
- [ ] Hover shadow effects
- [ ] Mobile responsive stacking

---

## 🚀 CURSOR AI PROMPT

```
Create an Online Courses page for Hyperion Tech Hub using the Courses Page Style Guide.

Include:
- Hero section (centered):
  - Badge with BookOpen icon "Learn at Your Own Pace"
  - Heading "Online Courses" with "Courses" in #1A2BC2
  - Description text
  - Gradient background from #1A2BC2/5 to #0D0D52/5
  
- Courses grid (3 columns, responsive):
  - Course cards with:
    - 192px height course image
    - Level badge (top-right, white/90 with backdrop-blur)
    - Title and instructor name
    - Duration (Clock icon), Students (Users icon), Rating (Star icon - yellow)
    - 2-line clamped description
    - Large price in #1A2BC2
    - "Enroll Now" button with Play icon
  
- Features section (gray-50 background):
  - "What You Get" heading
  - 3-column grid with circular blue icons
  
Use brand colors #1A2BC2 and #0D0D52.
Make cards equal height with flex-col layout.

Example courses:
1. Web Development Fundamentals - John Smith, 8 weeks, 1,245 students, 4.8 rating, Beginner, $199
2. Python for Data Science - Sarah Johnson, 10 weeks, 892 students, 4.9 rating, Intermediate, $249
3. Mobile App Development - Mike Davis, 12 weeks, 654 students, 4.7 rating, Intermediate, $299
4. Cloud Computing with AWS - Emily Chen, 6 weeks, 1,089 students, 4.8 rating, Advanced, $279
5. Cybersecurity Essentials - David Williams, 8 weeks, 734 students, 4.9 rating, Beginner, $229
6. AI & Machine Learning - Dr. Lisa Martinez, 14 weeks, 567 students, 4.9 rating, Advanced, $349

Features: Self-paced learning, Lifetime access, Certificate of completion, 
Interactive projects, Community support, Regular updates
```

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Page Type:** Online Courses Catalog
