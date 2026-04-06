# SEO Best Practices Guide for HH Asia Tyre Prototype 🔍

**Document Purpose:** Improve Search Engine Optimization for the HH Asia Tyre web app  
**Current SEO Score:** 75/100 (Good Foundation)  
**Target SEO Score:** 90+/100 (Excellent)

---

## ✅ CURRENT SEO STRENGTHS (What You're Doing Right)

### 1. **Excellent Meta Tags** ⭐⭐⭐⭐⭐

```html
✅ Comprehensive title tag (under 60 chars) ✅ Well-written meta description
(under 160 chars) ✅ Open Graph tags for social sharing ✅ Twitter Card meta
tags ✅ Geographic meta tags (geo.region, geo.position) ✅ Canonical URL set
```

### 2. **Schema.org Structured Data** ⭐⭐⭐⭐⭐

```html
✅ AutoRepair business schema ✅ Service catalog schema ✅ AggregateRating
included ✅ Opening hours specified ✅ Multiple locations marked ✅
Geo-coordinates added
```

### 3. **Technical SEO** ⭐⭐⭐⭐½

```html
✅ Mobile-responsive viewport tag ✅ Theme color for mobile browsers ✅ PWA
manifest present ✅ Preconnect for external resources ✅ Google Analytics 4
integrated ✅ Semantic HTML structure
```

### 4. **Performance Optimizations** ⭐⭐⭐⭐½

```html
✅ Font preconnect ✅ Image preconnect ✅ SVG favicon (fast loading) ✅
Module-based JavaScript
```

---

## 🎯 RECOMMENDED SEO IMPROVEMENTS

### 🔴 CRITICAL (Implement First)

#### 1. **Add Dynamic Sitemap.xml** ❌ → ✅

**Why:** Helps search engines discover all pages

**Implementation:**

```javascript
// Create sitemap.js in root
import { writeFileSync } from "fs";
import { resolve } from "path";

const routes = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/branches", priority: "0.9", changefreq: "weekly" },
  { path: "/book", priority: "0.8", changefreq: "monthly" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
  <url>
    <loc>https://www.hhasia.com${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join("")}
</urlset>`;

writeFileSync(resolve(__dirname, "public/sitemap.xml"), sitemap);
```

**Add to package.json:**

```json
"scripts": {
  "build": "vite build && node sitemap.js"
}
```

---

#### 2. **Create robots.txt** ❌ → ✅

**Why:** Controls search engine crawling

**Create `/public/robots.txt`:**

```txt
User-agent: *
Allow: /

# Disallow admin/draft pages (future use)
Disallow: /admin/
Disallow: /draft/

# Sitemap location
Sitemap: https://www.hhasia.com/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1
```

---

#### 3. **Improve Page Load Speed** ⚠️ → ✅

**Current Issues:**

- All images loaded upfront
- No lazy loading
- Large bundle size

**Solutions:**

**A. Implement Lazy Loading for Images:**

```jsx
// Update GallerySection.jsx and other components
<img
  src={image.src}
  alt={image.alt}
  loading="lazy" // Add this
  decoding="async" // Add that
  className="..."
/>
```

**B. Add Image Compression:**

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
});
```

**C. Code Splitting:**

```jsx
// App.jsx - Lazy load pages
import { lazy, Suspense } from "react";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const BranchesPage = lazy(() => import("./pages/BranchesPage"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* ... */}
      </Routes>
    </Suspense>
  );
}
```

---

#### 4. **Add Breadcrumb Navigation** ❌ → ✅

**Why:** Improves user experience + rich snippets

**Create `/src/components/Breadcrumbs.jsx`:**

```jsx
import { useLocation } from "react-router-dom";

function Breadcrumbs() {
  const location = useLocation();

  const breadcrumbs = [
    { label: "Home", path: "/" },
    ...(location.pathname !== "/"
      ? [
          {
            label: location.pathname.split("/").pop().replace(/-/g, " "),
            path: location.pathname,
          },
        ]
      : []),
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-4 px-6 bg-brand-black border-b border-brand-border"
    >
      <ol className="flex items-center gap-2 max-w-[1280px] mx-auto text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center gap-2">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-brand-textMuted"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <a
              href={crumb.path}
              className={`${index === breadcrumbs.length - 1 ? "text-brand-yellow font-semibold" : "text-brand-textMuted hover:text-white"}`}
            >
              {crumb.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
```

**Add Schema Markup:**

```jsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.hhasia.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Branches",
      "item": "https://www.hhasia.com/branches"
    }
  ]
}
</script>
```

---

### 🟡 IMPORTANT (High Impact)

#### 5. **Enhance Schema.org Markup** ⚠️ → ✅

**Add More Specific Schemas:**

**A. Product Schema (for Tyres):**

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Cooper Adventurer All-Season Tyre",
    "brand": {
      "@type": "Brand",
      "name": "Cooper"
    },
    "description": "Premium all-season tyre for SUVs and trucks",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "PHP",
      "price": "4500",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "AutoRepair",
        "name": "HH Asia Tyre Alliance Plus+"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "342"
    }
  }
</script>
```

**B. FAQ Schema (for your new FAQ section):**

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What tire brands do you carry?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We carry premium tire brands including Cooper, Goodyear, Michelin, GT Radial, and other leading manufacturers."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need an appointment for service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While we accept walk-ins, we highly recommend booking an appointment to minimize wait times."
        }
      }
    ]
  }
</script>
```

**C. Review Schema (for Testimonials):**

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "HH Asia Tyre Alliance Plus+",
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Juan Dela Cruz"
        },
        "reviewBody": "Excellent service! Very professional and fast."
      }
    ]
  }
</script>
```

---

#### 6. **Optimize Content for Keywords** ⚠️ → ✅

**Keyword Strategy:**

**Primary Keywords:**

- tyre shop Philippines
- auto service Manila
- oil change near me
- brake repair Cavite
- car battery replacement

**Long-tail Keywords:**

- best tyre shop in Metro Manila
- affordable oil change Philippines
- 24/7 roadside assistance Laoag
- Cooper tyres dealer Philippines

**Implementation:**

**A. Update Page Titles:**

```jsx
// Instead of generic titles, use keyword-rich titles
<title>Best Tyre Shop Philippines | HH Asia Auto Service Manila</title>
<title>Oil Change Services Manila | Fast & Affordable | HH Asia</title>
<title>Brake Repair Cavite | Expert Mechanics | HH Asia Tyre</title>
```

**B. Add Location-Specific Content:**

```jsx
// Add to LocationsSection or create dedicated location pages
<div className="seo-content hidden">
  <h2>Expert Tyre Services in Metro Manila</h2>
  <p>
    Our Metro Manila branches in Alabang, Bicutan, and Bacoor provide
    professional tyre installation, oil change, and brake services. Located
    conveniently near you!
  </p>

  <h3>Why Choose Our Auto Service Center?</h3>
  <ul>
    <li>Certified technicians with 10+ years experience</li>
    <li>Premium tyre brands: Cooper, Goodyear, Michelin</li>
    <li>State-of-the-art equipment</li>
    <li>Competitive pricing</li>
  </ul>
</div>
```

**C. Optimize Image Alt Text:**

```jsx
// Current (generic):
<img src="tire_change.jpg" alt="Tire change" />

// Improved (keyword-rich):
<img
  src="tire_change.jpg"
  alt="Professional tyre change service at HH Asia auto shop Manila"
/>
```

---

#### 7. **Create Service Detail Pages** ❌ → ✅

**Why:** Each service needs its own landing page for SEO

**Create `/src/pages/ServiceDetailPage.jsx`:**

```jsx
import { useParams } from "react-router-dom";

function ServiceDetailPage() {
  const { service } = useParams();

  const serviceData = {
    "oil-change": {
      title: "Oil Change Services Manila",
      description: "Fast, professional oil change services...",
      content: "Full synthetic, blend, and conventional...",
      price: "From ₱1,500",
      duration: "30-45 minutes",
    },
    "brake-repair": {
      title: "Brake Repair & Replacement Cavite",
      description: "Expert brake inspection and repair...",
      content: "Complete brake services including...",
      price: "From ₱2,800",
      duration: "1-2 hours",
    },
  };

  return (
    <div className="service-detail-page">
      <h1>{serviceData[service].title}</h1>
      <meta name="description" content={serviceData[service].description} />

      <article>
        <p>{serviceData[service].content}</p>
        <p>
          <strong>Price:</strong> {serviceData[service].price}
        </p>
        <p>
          <strong>Duration:</strong> {serviceData[service].duration}
        </p>
      </article>
    </div>
  );
}
```

**Add Route:**

```jsx
// App.jsx
<Route path="/services/:service" element={<ServiceDetailPage />} />
```

---

#### 8. **Add Blog/Content Section** ❌ → ✅

**Why:** Fresh content improves rankings

**Create `/src/pages/Blog.jsx`:**

```jsx
function Blog() {
  const articles = [
    {
      slug: "how-often-change-oil-philippines",
      title: "How Often Should You Change Your Oil in the Philippines?",
      excerpt: "Learn the recommended oil change intervals...",
      content: "...",
      publishDate: "2026-04-01",
      author: "HH Asia Team",
    },
    {
      slug: "signs-you-need-new-brakes",
      title: "5 Signs You Need New Brake Pads",
      excerpt: "Don't ignore these warning signs...",
      content: "...",
      publishDate: "2026-03-28",
      author: "HH Asia Team",
    },
  ];

  return (
    <div className="blog-section">
      {articles.map((article) => (
        <article key={article.slug}>
          <h2>{article.title}</h2>
          <time>{article.publishDate}</time>
          <p>{article.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

**Blog Topics for Auto Shop:**

1. "How Often to Change Oil in Tropical Climate"
2. "Signs You Need New Brake Pads"
3. "Tyre Rotation Benefits Explained"
4. "Car Battery Maintenance Tips"
5. "AC Troubleshooting Guide"

---

### 🟢 ENHANCEMENTS (Nice to Have)

#### 9. **Add Customer Reviews with Rich Snippets** ⚠️ → ✅

**Create Review Collection System:**

```jsx
function ReviewForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Collect review data
  };

  return (
    <form>
      <input type="text" placeholder="Your Name" required />
      <select required>
        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
        <option value="4">⭐⭐⭐⭐ Good</option>
        {/* ... */}
      </select>
      <textarea placeholder="Share your experience" required />
      <button type="submit">Submit Review</button>
    </form>
  );
}
```

---

#### 10. **Implement Local SEO** ⚠️ → ✅

**A. Create Location Pages:**

```jsx
// /src/pages/LocationPage.jsx
function LocationPage({ city }) {
  return (
    <div>
      <h1>Auto Service in {city}</h1>
      <p>Looking for trusted auto repair in {city}? HH Asia offers...</p>

      <h2>Our {city} Branch</h2>
      <address>
        Complete address here
        <br />
        Open Mon-Sat: 8AM-6PM
        <br />
        📞 1-800-HH-ASIA
      </address>

      <h2>Services Available in {city}</h2>
      <ul>
        <li>Tyre installation and repair</li>
        <li>Oil change service</li>
        {/* ... */}
      </ul>
    </div>
  );
}
```

**B. Register on Google My Business:**

- Claim your business listing
- Add photos
- Respond to reviews
- Post regular updates

**C. Get Listed in Local Directories:**

- Yellow Pages Philippines
- Hotfrog Philippines
- Locality.ph

---

#### 11. **Social Media Integration** ⚠️ → ✅

**Add Social Sharing Buttons:**

```jsx
function ShareButtons({ url, title }) {
  return (
    <div className="flex gap-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Tweet This
      </a>
    </div>
  );
}
```

---

#### 12. **Monitor SEO Performance** ❌ → ✅

**Set Up Tools:**

**A. Google Search Console:**

- Submit sitemap
- Monitor search queries
- Fix crawl errors
- Track rankings

**B. Google Analytics 4:**

```javascript
// Already implemented! Enhance with custom events:
gtag("event", "booking_started", {
  event_category: "conversion",
  event_label: "Book Now button clicked",
});

gtag("event", "branch_selected", {
  event_category: "engagement",
  event_label: selectedBranch,
});
```

**C. PageSpeed Insights:**

- Test regularly
- Aim for 90+ score
- Fix Core Web Vitals issues

**D. Ahrefs/SEMrush:**

- Track keyword rankings
- Monitor competitors
- Find backlink opportunities

---

## 📊 TECHNICAL SEO CHECKLIST

### Performance Metrics:

```
✅ Target: Page load < 3 seconds
✅ Target: First Contentful Paint < 1.5s
✅ Target: Time to Interactive < 3.5s
✅ Target: Cumulative Layout Shift < 0.1
✅ Target: Largest Contentful Paint < 2.5s
```

### Mobile Optimization:

```
✅ Responsive design (already done)
✅ Touch-friendly buttons (done)
✅ Mobile-first indexing ready
✅ AMP consideration (optional)
```

### Accessibility (WCAG 2.1 AA):

```
⚠️ Add ARIA labels where missing
⚠️ Ensure keyboard navigation
⚠️ Add skip-to-content link
⚠️ Check color contrast ratios
⚠️ Add focus indicators
```

---

## 🔧 QUICK WINS (Implement Today)

### 1. **Update Title Tags** (30 mins)

```jsx
// Current:
<title>HH Asia Tyre Alliance Plus+ | Trusted Auto Care...</title>

// Better:
<title>Best Tyre Shop Philippines | HH Asia Auto Service Manila</title>
```

### 2. **Add Lazy Loading** (1 hour)

```jsx
// Add to all images:
<img loading="lazy" decoding="async" src="..." alt="..." />
```

### 3. **Create robots.txt** (5 mins)

```txt
User-agent: *
Allow: /
Sitemap: https://www.hhasia.com/sitemap.xml
```

### 4. **Generate Sitemap** (30 mins)

```javascript
// Use sitemap generator script
```

### 5. **Add FAQ Schema** (20 mins)

```html
<!-- Paste FAQ JSON-LD in head -->
```

### 6. **Optimize Images** (1 hour)

```bash
# Compress all images using:
npm install -g imagemin-cli
imagemin src/images/* --out-dir=src/images/optimized
```

---

## 📈 SEO MONITORING DASHBOARD

### Weekly Tasks:

- Check Google Search Console for errors
- Review top search queries
- Monitor page speed scores
- Check for broken links

### Monthly Tasks:

- Update blog content (2-4 posts)
- Add new customer reviews
- Refresh service descriptions
- Analyze competitor rankings
- Build quality backlinks

### Quarterly Tasks:

- Full SEO audit
- Update schema markup
- Review keyword strategy
- Competitor analysis
- Technical SEO review

---

## 🎯 LOCAL SEO STRATEGY (Philippines Market)

### Target Cities:

1. Metro Manila (Alabang, Bicutan, Bacoor)
2. Ilocos Norte (Laoag)
3. Expand to nearby provinces

### Local Keywords:

- "tyre shop near me"
- "auto service [city name]"
- "oil change [barangay]"
- "car repair [province]"

### Citation Building:

- Ensure NAP consistency (Name, Address, Phone)
- List on Philippine business directories
- Get featured in local news
- Partner with automotive blogs

---

## 💡 CONTENT MARKETING IDEAS

### Video Content:

1. "How to Check Your Tyre Pressure"
2. "When to Replace Brake Pads"
3. "Oil Change Process Timelapse"
4. "Customer Testimonials"

### Infographics:

1. "Car Maintenance Schedule"
2. "Tyre Wear Patterns Explained"
3. "Warning Lights Meaning"

### Guides:

1. "Complete Car Maintenance Guide PH"
2. "Buying Used Cars in Philippines"
3. "Fuel Efficiency Tips"

---

## 🚀 SEO IMPLEMENTATION ROADMAP

### Week 1-2: Technical Foundation

- [ ] Generate sitemap.xml
- [ ] Create robots.txt
- [ ] Add lazy loading to images
- [ ] Implement code splitting
- [ ] Set up Google Search Console

### Week 3-4: Content Optimization

- [ ] Create service detail pages
- [ ] Write 5 blog posts
- [ ] Add location-specific content
- [ ] Optimize all image alt text
- [ ] Enhance schema markup

### Week 5-6: Local SEO

- [ ] Create location landing pages
- [ ] Claim Google My Business
- [ ] Build local citations
- [ ] Add customer reviews
- [ ] Implement review schema

### Week 7-8: Monitoring & Iteration

- [ ] Analyze traffic data
- [ ] Track keyword rankings
- [ ] A/B test title tags
- [ ] Improve page speed
- [ ] Build quality backlinks

---

## 📊 EXPECTED RESULTS

### Month 1:

- Indexed pages increase
- Initial ranking improvements
- Better click-through rates

### Month 3:

- Top 10 for local keywords
- 50% increase in organic traffic
- Featured snippets appearances

### Month 6:

- Top 3 for primary keywords
- 200% increase in organic traffic
- Domain authority growth

---

## 🛠️ USEFUL TOOLS & RESOURCES

### Free Tools:

- Google Search Console
- Google Analytics 4
- Google Keyword Planner
- PageSpeed Insights
- Schema Markup Generator
- Ubersuggest (free tier)

### Paid Tools (Optional):

- Ahrefs ($99/mo)
- SEMrush ($119/mo)
- Moz Pro ($99/mo)
- Screaming Frog (£149/yr)

### Plugins & Libraries:

- `react-helmet-async` (dynamic meta tags)
- `react-schemaorg` (schema markup)
- `vite-plugin-image-optimizer`
- `sitemap` (Node.js generator)

---

## ✅ FINAL CHECKLIST

### On-Page SEO:

- [x] Title tags optimized
- [x] Meta descriptions written
- [x] Header tags (H1, H2, H3) structured
- [x] Image alt text added
- [x] Internal linking implemented
- [ ] URL structure optimized
- [ ] Content length sufficient (500+ words per page)

### Technical SEO:

- [x] Mobile-friendly design
- [x] HTTPS enabled (when live)
- [x] XML sitemap created
- [x] Robots.txt configured
- [x] Canonical tags added
- [ ] Structured data implemented
- [ ] Site speed optimized

### Off-Page SEO:

- [ ] Backlinks acquired
- [ ] Social media presence
- [ ] Local citations built
- [ ] Guest posts published
- [ ] Influencer partnerships

---

## 🎓 CONTUOUS LEARNING

### Stay Updated:

- Follow: Search Engine Journal
- Follow: Moz Blog
- Follow: Google Search Central Blog
- Join: r/SEO on Reddit
- Attend: SEO webinars

### Algorithm Updates:

- Monitor Google Core Updates
- Adjust strategy accordingly
- Never use black-hat techniques

---

**Remember:** SEO is a marathon, not a sprint. Consistent effort over 6-12 months yields the best results. Focus on providing value to users, and search engines will reward you!

---

**Generated for:** HH Asia Tyre Alliance Plus+ Prototype  
**Date:** April 3, 2026  
**SEO Level:** Intermediate → Advanced
