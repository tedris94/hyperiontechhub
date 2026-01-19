# 🔐 AUTHENTICATION PAGES - STYLE GUIDE
**Hyperion Tech Hub | Login & Register Design System**

---

## 📋 PAGE OVERVIEW

The authentication system includes Login and Register pages with a modern split-screen design: left side features branding and benefits, right side contains the form. Both pages maintain consistent styling with the brand identity.

---

## 🎨 PAGE STRUCTURE

```
Split Screen Layout (50/50)
├── Left Panel (Brand & Benefits)
│   ├── Logo
│   ├── Heading
│   ├── Description
│   └── Feature List
└── Right Panel (Form)
    ├── Form Header
    ├── Input Fields
    ├── Submit Button
    └── Alternate Action Link
```

---

## 🏗️ SPLIT SCREEN LAYOUT

```jsx
<div className="min-h-screen flex">
  {/* Left Panel - Brand Section */}
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1A2BC2] to-[#0D0D52] text-white p-12 flex-col justify-center">
    {/* Branding content */}
  </div>
  
  {/* Right Panel - Form Section */}
  <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
    {/* Form content */}
  </div>
</div>
```

### Layout Key Features:
```css
/* Container */
min-h-screen              /* Full viewport height */
flex                      /* Horizontal layout */

/* Left Panel */
hidden lg:flex            /* Hide on mobile, show on desktop */
lg:w-1/2                 /* 50% width on desktop */
bg-gradient-to-br         /* Diagonal gradient */
from-[#1A2BC2] to-[#0D0D52]  /* Brand blue gradient */

/* Right Panel */
w-full lg:w-1/2          /* Full width mobile, 50% desktop */
bg-white                  /* White background */
```

---

## 🎨 LOGIN PAGE - LEFT PANEL

```jsx
<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1A2BC2] to-[#0D0D52] text-white p-12 flex-col justify-center relative overflow-hidden">
  {/* Decorative Elements */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
  
  <div className="relative z-10 max-w-md">
    {/* Logo */}
    <div className="flex items-center space-x-3 mb-12">
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
        <span className="text-[#1A2BC2] font-bold text-2xl">H</span>
      </div>
      <span className="text-2xl font-semibold">Hyperion Tech Hub</span>
    </div>
    
    {/* Heading */}
    <h1 className="text-5xl mb-6 leading-tight">
      Welcome Back
    </h1>
    
    {/* Description */}
    <p className="text-xl text-white/90 mb-12 leading-relaxed">
      Access your dashboard and continue your journey with cutting-edge technology solutions.
    </p>
    
    {/* Features List */}
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <CheckCircle className="w-5 h-5" />
        </div>
        <span className="text-lg">Access all your projects</span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <CheckCircle className="w-5 h-5" />
        </div>
        <span className="text-lg">Track your progress</span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <CheckCircle className="w-5 h-5" />
        </div>
        <span className="text-lg">Manage your account</span>
      </div>
    </div>
  </div>
</div>
```

### Left Panel Key Styles:
```css
/* Background */
bg-gradient-to-br         /* Diagonal gradient */
from-[#1A2BC2] to-[#0D0D52]  /* Persian to midnight blue */

/* Decorative Circles */
absolute                  /* Position absolutely */
w-96 h-96                /* Large circle (384px) */
bg-white/5               /* 5% opacity white */
rounded-full              /* Circular shape */
-mr-48 -mt-48            /* Negative margin (overflow) */

/* Feature Icon Circles */
w-8 h-8                   /* 32px circles */
bg-white/20              /* 20% opacity white */
rounded-full              /* Circular */
```

---

## 📝 LOGIN PAGE - RIGHT PANEL (FORM)

```jsx
<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
  <div className="w-full max-w-md">
    {/* Mobile Logo (shown only on mobile) */}
    <div className="lg:hidden flex items-center justify-center mb-8">
      <div className="w-12 h-12 bg-[#1A2BC2] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-2xl">H</span>
      </div>
    </div>
    
    {/* Form Header */}
    <div className="mb-8">
      <h2 className="text-3xl text-[#1B1C1E] mb-2">
        Sign In
      </h2>
      <p className="text-gray-600">
        Enter your credentials to access your account
      </p>
    </div>
    
    {/* Login Form */}
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm text-[#1B1C1E] font-medium">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-10 h-12 border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
            required
          />
        </div>
      </div>
      
      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm text-[#1B1C1E] font-medium">
            Password
          </label>
          <a href="/forgot-password" className="text-sm text-[#1A2BC2] hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Remember Me */}
      <div className="flex items-center">
        <Checkbox id="remember" className="border-gray-300" />
        <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
          Remember me for 30 days
        </label>
      </div>
      
      {/* Submit Button */}
      <Button 
        type="submit"
        className="w-full h-12 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white text-base"
      >
        Sign In
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
      
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          type="button"
          variant="outline"
          className="h-12 border-gray-300 hover:bg-gray-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            {/* Google Icon */}
          </svg>
          Google
        </Button>
        <Button 
          type="button"
          variant="outline"
          className="h-12 border-gray-300 hover:bg-gray-50"
        >
          <Github className="w-5 h-5 mr-2" />
          GitHub
        </Button>
      </div>
    </form>
    
    {/* Sign Up Link */}
    <p className="mt-8 text-center text-gray-600">
      Don't have an account?{' '}
      <Link to="/register" className="text-[#1A2BC2] hover:underline font-medium">
        Sign up
      </Link>
    </p>
  </div>
</div>
```

### Form Key Features:
```css
/* Input Fields */
h-12                      /* 48px height */
pl-10                     /* Left padding for icon */
pr-10                     /* Right padding for toggle */
border-gray-300           /* Border color */
focus:border-[#1A2BC2]   /* Focus border color */
focus:ring-[#1A2BC2]     /* Focus ring color */

/* Icon Positioning */
absolute left-3           /* 12px from left */
top-1/2 -translate-y-1/2  /* Vertically centered */
w-5 h-5                   /* 20px icon size */
text-gray-400             /* Gray color */

/* Button */
w-full h-12               /* Full width, 48px height */
bg-[#1A2BC2]             /* Brand blue */
hover:bg-[#0D0D52]       /* Darker on hover */
```

---

## 📝 REGISTER PAGE - DIFFERENCES

```jsx
{/* Register Page Left Panel */}
<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1A2BC2] to-[#0D0D52] text-white p-12 flex-col justify-center">
  <div className="max-w-md">
    <h1 className="text-5xl mb-6 leading-tight">
      Join Hyperion Tech Hub
    </h1>
    
    <p className="text-xl text-white/90 mb-12 leading-relaxed">
      Create your account and unlock access to cutting-edge technology 
      solutions, expert training, and innovative services.
    </p>
    
    {/* Benefits */}
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <CheckCircle className="w-6 h-6" />
        <span className="text-lg">Access to 100+ courses</span>
      </div>
      <div className="flex items-center space-x-3">
        <CheckCircle className="w-6 h-6" />
        <span className="text-lg">Expert consultation</span>
      </div>
      <div className="flex items-center space-x-3">
        <CheckCircle className="w-6 h-6" />
        <span className="text-lg">24/7 support</span>
      </div>
      <div className="flex items-center space-x-3">
        <CheckCircle className="w-6 h-6" />
        <span className="text-lg">Community access</span>
      </div>
    </div>
  </div>
</div>

{/* Register Form - Additional Fields */}
<form className="space-y-6">
  {/* Full Name */}
  <div className="space-y-2">
    <label className="text-sm text-[#1B1C1E] font-medium">
      Full Name
    </label>
    <div className="relative">
      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input
        type="text"
        placeholder="John Doe"
        className="pl-10 h-12 border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
        required
      />
    </div>
  </div>
  
  {/* Email */}
  {/* Same as login */}
  
  {/* Password with Strength Indicator */}
  <div className="space-y-2">
    <label className="text-sm text-[#1B1C1E] font-medium">
      Password
    </label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input
        type="password"
        placeholder="••••••••"
        className="pl-10 h-12 border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
        required
      />
    </div>
    {/* Password Strength Indicator */}
    <div className="flex space-x-1">
      <div className="h-1 flex-1 rounded-full bg-gray-200"></div>
      <div className="h-1 flex-1 rounded-full bg-gray-200"></div>
      <div className="h-1 flex-1 rounded-full bg-gray-200"></div>
      <div className="h-1 flex-1 rounded-full bg-gray-200"></div>
    </div>
    <p className="text-xs text-gray-500">
      Use 8+ characters with a mix of letters, numbers & symbols
    </p>
  </div>
  
  {/* Confirm Password */}
  <div className="space-y-2">
    <label className="text-sm text-[#1B1C1E] font-medium">
      Confirm Password
    </label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input
        type="password"
        placeholder="••••••••"
        className="pl-10 h-12 border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
        required
      />
    </div>
  </div>
  
  {/* Terms & Conditions */}
  <div className="flex items-start">
    <Checkbox id="terms" className="border-gray-300 mt-1" required />
    <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
      I agree to the{' '}
      <a href="/terms" className="text-[#1A2BC2] hover:underline">
        Terms of Service
      </a>
      {' '}and{' '}
      <a href="/privacy" className="text-[#1A2BC2] hover:underline">
        Privacy Policy
      </a>
    </label>
  </div>
  
  {/* Submit Button */}
  <Button 
    type="submit"
    className="w-full h-12 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white text-base"
  >
    Create Account
    <ArrowRight className="ml-2 w-5 h-5" />
  </Button>
</form>

{/* Login Link */}
<p className="mt-8 text-center text-gray-600">
  Already have an account?{' '}
  <Link to="/login" className="text-[#1A2BC2] hover:underline font-medium">
    Sign in
  </Link>
</p>
```

---

## 🎨 PASSWORD STRENGTH INDICATOR

```jsx
const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
};

<div className="flex space-x-1">
  {[1, 2, 3, 4].map((level) => (
    <div
      key={level}
      className={`h-1 flex-1 rounded-full transition-colors ${
        strength >= level
          ? strength === 1
            ? 'bg-red-500'
            : strength === 2
            ? 'bg-orange-500'
            : strength === 3
            ? 'bg-yellow-500'
            : 'bg-green-500'
          : 'bg-gray-200'
      }`}
    />
  ))}
</div>
```

---

## 🔔 ERROR & SUCCESS ALERTS

```jsx
{/* Error Alert */}
{error && (
  <Alert variant="destructive" className="mb-6">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}

{/* Success Alert */}
{success && (
  <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
    <CheckCircle className="h-4 w-4" />
    <AlertTitle>Success</AlertTitle>
    <AlertDescription>{success}</AlertDescription>
  </Alert>
)}
```

---

## 📱 MOBILE RESPONSIVE

```css
/* Hide Left Panel on Mobile */
hidden lg:flex            /* Hidden on mobile, flex on desktop */

/* Show Logo on Mobile */
lg:hidden                 /* Show on mobile, hide on desktop */

/* Full Width Form on Mobile */
w-full lg:w-1/2          /* Full width on mobile, 50% on desktop */

/* Padding Adjustment */
p-8                       /* 32px padding on all sides */
```

---

## ✅ AUTHENTICATION CHECKLIST

When building auth pages:

- [ ] Implement split-screen layout (50/50)
- [ ] Add gradient background to left panel
- [ ] Include decorative circles on brand side
- [ ] Show mobile logo on small screens
- [ ] Add icons to all input fields
- [ ] Implement password visibility toggle
- [ ] Include "Remember me" checkbox (login)
- [ ] Add password strength indicator (register)
- [ ] Include "Forgot password?" link (login)
- [ ] Add terms & conditions checkbox (register)
- [ ] Implement social login buttons
- [ ] Show error/success alerts
- [ ] Add "Or continue with" divider
- [ ] Include sign up/sign in toggle links
- [ ] Make fully responsive

---

## 🚀 CURSOR AI PROMPT

```
Create Login and Register pages for Hyperion Tech Hub using the Authentication Style Guide.

Login Page should include:
- Split-screen layout (50/50)
- Left panel: Gradient background (#1A2BC2 to #0D0D52), logo, "Welcome Back" heading, 3 benefits with checkmarks
- Right panel: Login form with email, password fields (with icons), remember me checkbox, "Forgot password?" link, submit button, social login options
- Mobile responsive (hide left panel, show logo on mobile)

Register Page should include:
- Same split-screen layout
- Left panel: "Join Hyperion Tech Hub" heading, 4 benefits
- Right panel: Form with full name, email, password with strength indicator, confirm password, terms checkbox, submit button
- Password strength: 4-bar indicator (red/orange/yellow/green)

Both pages:
- Use brand colors #1A2BC2 and #0D0D52
- Input height: 48px with left icons
- Add decorative circles on brand panel
- Include error/success alerts
- Full mobile responsiveness
```

---

**Last Updated:** January 2026
**Version:** 1.0
**Page Type:** Authentication
