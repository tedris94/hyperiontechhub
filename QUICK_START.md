# 🚀 Quick Start Guide

## Step 1: Install Dependencies

Open terminal in the `hyperion-frontend` directory and run:

```bash
cd C:\wamp64\www\testhub.com\hyperion-frontend
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios (for API calls)
- Headless UI & Heroicons

## Step 2: Create Environment File

Create `.env.local` file in `hyperion-frontend/` directory:

```env
NEXT_PUBLIC_WP_API_URL=http://localhost/testhub.com/wp-json/wp/v2
NEXT_PUBLIC_WP_SITE_URL=http://localhost/testhub.com
NEXT_PUBLIC_SITE_NAME=Hyperion Tech Hub
```

## Step 3: Start Development Server

```bash
npm run dev
```

## Step 4: Open in Browser

Visit: **http://localhost:3000**

---

## ✅ What's Already Set Up

- ✅ Next.js 14 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS
- ✅ WordPress API client (`lib/wp-api.ts`)
- ✅ All homepage components:
  - Header with navigation
  - Hero section with stats
  - Services grid (fetches from WordPress)
  - Purpose section
  - CTA banner
  - Contact form
  - Footer with social links

## 🔧 Next Steps

1. **Test WordPress API Connection:**
   - Visit: http://localhost/testhub.com/wp-json/wp/v2
   - Should see JSON response

2. **Add Services in WordPress:**
   - Go to WordPress Admin
   - Create Services (custom post type)
   - They'll automatically appear in Next.js

3. **Customize Components:**
   - Edit components in `components/` folder
   - Match your Figma design exactly

4. **Add Images:**
   - Upload hero image in WordPress
   - Update image URLs in components

---

## 📚 Documentation

- **WordPress API:** Check `lib/wp-api.ts` for available functions
- **Components:** All components in `components/` folder
- **Styling:** Tailwind CSS classes used throughout

---

## 🐛 Troubleshooting

**API not connecting?**
- Check WordPress is running
- Verify REST API is enabled
- Check `.env.local` file has correct URLs

**Components not showing?**
- Check browser console for errors
- Verify all dependencies installed
- Check TypeScript errors

**Styles not working?**
- Ensure Tailwind is configured
- Check `tailwind.config.ts`
- Verify `globals.css` imports Tailwind

---

**Ready to build! 🎉**

