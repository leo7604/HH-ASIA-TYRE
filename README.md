# HH Asia Tyre Alliance Plus+ - Landing Page & Booking System

A modern, responsive frontend prototype for HH Asia Tyre Alliance Plus+ auto service centers.

## 🚀 Features

### Landing Page

- **Hero Section**: Auto-rotating promotional carousel with CTAs
- **Services Showcase**: 9 main services + expandable special services
- **Advantages Section**: Trust signals and company statistics
- **Gallery**: Filterable image gallery with lightbox
- **Testimonials**: Customer review carousel with ratings
- **Promotions**: Current deals and offers
- **Locations**: Multi-branch finder (Manilo + Laoag) with map links
- **Contact**: Contact form with business hours and social links

### Booking System

- 5-step wizard booking flow:
  1. Vehicle Selection (Year/Make/Model/Trim)
  2. Service Selection (multi-select)
  3. Location & Time Picker
  4. Customer Details
  5. Confirmation with booking reference

### PWA Features

- Install prompt for mobile users
- Offline support with service worker
- Web app manifest
- App-like experience on mobile devices

### SEO Optimized

- Meta tags for search engines
- Open Graph tags for social sharing
- Schema.org structured data
- Semantic HTML structure
- Fast page load performance

### Mobile-First Design

- Touch-friendly buttons (44x44px minimum)
- Collapsible hamburger menu
- Swipe gestures for carousels
- Responsive layouts for all screen sizes
- Click-to-call phone numbers

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
hh-asia-tyre-prototype/
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   ├── offline.html       # Offline fallback page
│   ├── favicon.svg        # Site icon
│   ├── icons/             # PWA icons (192x192, 512x512)
│   └── screenshots/       # PWA screenshots
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── ServicesSection.jsx
│   │   ├── AdvantagesSection.jsx
│   │   ├── GallerySection.jsx
│   │   ├── TestimonialsSection.jsx
│   │   ├── PromotionsSection.jsx
│   │   ├── LocationsSection.jsx
│   │   ├── ContactSection.jsx
│   │   ├── Footer.jsx
│   │   ├── PWAInstallPrompt.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── BookingPage.jsx
│   │   └── ConfirmationPage.jsx
│   ├── data/
│   │   └── mockData.js    # Mock data for prototype
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Brand Colors

- **Primary Yellow**: `#EBCB00`
- **Gold**: `#F4C430`
- **Red (CTA)**: `#E31837`
- **Dark**: `#1a1a1a`
- **Gray**: `#2d2d2d`

## 📱 Routes

| Route           | Description                    |
| --------------- | ------------------------------ |
| `/`             | Landing page with all sections |
| `/book`         | Multi-step booking wizard      |
| `/confirmation` | Booking confirmation page      |

## 🌐 Locations Included

1. **Alabang** - Metro Manila (Open)
2. **Bicutan** - Metro Manila (Open)
3. **Bacoor** - Cavite (Open)
4. **Sucat** - Metro Manila (Open)
5. **Laoag** - Ilocos Norte (Open)
6. **Tire Asia GT Radial** - Sucat (Coming Soon)

## 🔧 PWA Setup

To fully enable PWA features:

1. Generate app icons (192x192, 512x512) and place in `/public/icons/`
2. Add screenshots for app stores in `/public/screenshots/`
3. Deploy with HTTPS (required for service workers)
4. Test with Lighthouse PWA audit

## 📊 SEO Checklist

- [x] Meta title & description
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Schema.org structured data
- [x] Canonical URL
- [x] Semantic HTML hierarchy
- [x] Alt text for images
- [x] Mobile-friendly design
- [x] Fast page load speed

## 📈 Google Analytics 4

GA4 tracking is integrated into the project. To enable it:

1. **Create a GA4 Property** at [analytics.google.com](https://analytics.google.com)
2. **Get your Measurement ID** (format: `G-XXXXXXXXXX`)
3. **Update `.env` file**:
   ```env
   VITE_GA4_ID=G-XXXXXXXXXX
   ```
4. **Restart the dev server** for env changes to take effect

### Tracking Features

- **Automatic page views** on all routes
- **Custom events** via `trackEvents` helper:

  ```jsx
  import { trackEvents } from "./hooks/useAnalytics";

  // Example: Track booking completion
  trackEvents.bookingCompleted("BK12345", 1500);

  // Example: Track CTA click
  trackEvents.ctaClicked("Book Now", "Hero Section");
  ```

### Available Events

| Event                  | Description                   |
| ---------------------- | ----------------------------- |
| `bookingStarted`       | User starts booking flow      |
| `bookingStepCompleted` | User completes a booking step |
| `bookingCompleted`     | Booking confirmed             |
| `serviceViewed`        | User views a service          |
| `locationSelected`     | User selects a location       |
| `callClicked`          | User clicks phone number      |
| `contactFormSubmitted` | Contact form submitted        |
| `ctaClicked`           | Any CTA button clicked        |
| `pwaInstalled`         | PWA installed                 |

## 🚀 Next Steps

1. **Backend Integration**: Connect booking form to API
2. **Real-time Availability**: Integrate calendar/scheduling system
3. **Payment Gateway**: Add online payment options
4. **SMS/Email**: Set up notification system
5. **Content**: Replace placeholder content with actual copy
6. **Images**: Replace stock images with real photos
7. **Testing**: Cross-browser and device testing

## 📄 License

This is a prototype project for HH Asia Tyre Alliance Plus+.

---

**Development**: Open http://localhost:5173 in your browser after running `npm run dev`.
